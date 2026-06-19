// ============================================================
//  POST /api/confluence/docx — chuyển 1 trang Confluence → Word với template CIC.
//  Body: { url?, pageId?, token? }
//  Luồng: body.view HTML → normalize headings → nhúng ảnh base64 → Pandoc + reference.docx → .docx
//  KHÔNG qua AI. PAT (Bearer) chỉ ở server.
// ============================================================

import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { loadConfluenceConfig } from '../confluenceConfig';
import { cfFetch, resolvePageId, fetchImageAsDataUrl } from '../confluenceClient';

export const runtime = 'nodejs';

// Content width cap cho ảnh: A4 (210mm) trừ 3cm trái + 2cm phải = 160mm ≈ 605px @96dpi.
// Khớp với margin trong cic-reference.docx.
const CONTENT_PX = 605;

// Cache spaceKey+title → pageId trong vòng 1 process (tránh gọi API lặp cho nhiều ảnh cùng trang include).
const embeddedPageCache = new Map<string, string | null>();

// Khi Confluence "Include Page" macro, export_view sinh URL dạng:
//   /download/attachments/embedded-page/{space}/{titlePart1}/{titlePart2}/{file}?...
// Chú ý: title có thể chứa "/" thật (VD: "D10/D11 - ...") → span nhiều path segment.
// Bearer token không hoạt động cho embedded-page URL → 302 permissionViolation.
// Giải pháp: parse space + title (tất cả segments giữa space và filename cuối) → lookup pageId →
// rewrite sang /download/attachments/{pageId}/{file} (URL này hoạt động với Bearer).
async function resolveEmbeddedPageUrl(
    cfg: ReturnType<typeof loadConfluenceConfig>,
    token: string,
    src: string,
): Promise<string | null> {
    if (!cfg) return null;

    const EMBEDDED_PREFIX = '/download/attachments/embedded-page/';
    // Lấy pathname + search, bỏ scheme+host
    let pathname = src;
    let qs = '';
    try {
        const u = new URL(src);
        pathname = u.pathname;
        qs = u.search; // '?api=v2' hay rỗng
    } catch {
        const qi = src.indexOf('?');
        if (qi >= 0) { qs = src.slice(qi); pathname = src.slice(0, qi); }
    }

    const pidx = pathname.indexOf(EMBEDDED_PREFIX);
    if (pidx === -1) return null;

    // Tách các segment sau /embedded-page/
    const segments = pathname.slice(pidx + EMBEDDED_PREFIX.length).split('/').filter(Boolean);
    // Cần ít nhất: [space, titlePart, filename]
    if (segments.length < 3) return null;

    const spaceKey = decodeURIComponent(segments[0]);
    const filename = segments[segments.length - 1]; // last segment = filename (giữ nguyên encoded)
    // Tất cả segments ở giữa = các phần của title (join bằng / sau khi decode từng segment)
    const pageTitle = segments.slice(1, -1)
        .map(seg => { try { return decodeURIComponent(seg); } catch { return seg; } })
        .join('/');

    const cacheKey = `${spaceKey}::${pageTitle}`;
    let pageId = embeddedPageCache.get(cacheKey);
    if (pageId === undefined) {
        try {
            const res = await cfFetch(cfg, token,
                `/rest/api/content?spaceKey=${encodeURIComponent(spaceKey)}&title=${encodeURIComponent(pageTitle)}&limit=1`);
            const data = await res.json();
            pageId = data?.results?.[0]?.id ?? null;
        } catch { pageId = null; }
        embeddedPageCache.set(cacheKey, pageId ?? null);
        if (pageId) console.log(`[docx/embedded] "${spaceKey}/${pageTitle}" → pageId=${pageId}`);
        else console.warn(`[docx/embedded] Cannot resolve: "${spaceKey}/${pageTitle}"`);
    }
    if (!pageId) return null;
    // Rewrite: /download/attachments/{pageId}/{filename}?...
    return `/download/attachments/${pageId}/${filename}${qs}`;
}

const MAX_IMAGES = 50;
const MAX_TOTAL_IMAGE_BYTES = 30 * 1024 * 1024;

function err(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

// Chuyển chuỗi tiếng Việt có dấu → không dấu (ASCII Latin).
// Xử lý: đ/Đ → d/D (không tự decompose qua NFD), rồi NFD + bỏ combining diacritics.
function removeVietnameseDiacritics(s: string): string {
    return s
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

// Tên file: "{pageId} - {title}.docx". Loại bỏ ký tự không hợp lệ trong tên file Windows/macOS.
// Content-Disposition dùng filename* (RFC 5987) để giữ tiếng Việt; filename= là fallback không dấu.
function buildContentDisposition(pageId: string, title: string): string {
    const safeTitle = (title || 'confluence').replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 150);
    const name = `${pageId} - ${safeTitle || 'confluence'}.docx`;
    const ascii = removeVietnameseDiacritics(name).replace(/[^\x20-\x7e]/g, '_');
    return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

// Đọc kích thước pixel thật của ảnh từ buffer (PNG/JPEG/GIF) — không cần thư viện ngoài.
function pixelSize(buf: Buffer): { w: number; h: number } | null {
    if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    if (buf.length >= 10 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
        return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
    }
    if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
        let pos = 2;
        while (pos + 9 < buf.length) {
            if (buf[pos] !== 0xff) break;
            const marker = buf[pos + 1];
            if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                return { h: buf.readUInt16BE(pos + 5), w: buf.readUInt16BE(pos + 7) };
            }
            pos += 2 + buf.readUInt16BE(pos + 2);
        }
    }
    return null;
}

// Tính width/height hiển thị (px): giữ tỉ lệ, thu về maxPx nếu quá rộng, không phóng to.
// maxPx = bề rộng khả dụng (toàn trang, hoặc bề rộng cột nếu ảnh nằm trong bảng).
function displaySize(dataUrl: string, maxPx: number): { w: number; h: number } {
    try {
        const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
        const px = pixelSize(buf);
        if (px && px.w > 0 && px.h > 0) {
            if (px.w <= maxPx) return { w: px.w, h: px.h };
            return { w: maxPx, h: Math.round(px.h * maxPx / px.w) };
        }
    } catch { /* ignore */ }
    return { w: maxPx, h: Math.round(maxPx * 0.6) };
}

// Lấy giá trị 1 thuộc tính từ chuỗi thẻ <img ...>.
function attr(tag: string, name: string): string | null {
    const m = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i').exec(tag)
        || new RegExp(`${name}\\s*=\\s*'([^']*)'`, 'i').exec(tag);
    return m ? m[1] : null;
}

// Pandoc xử lý ảnh inline trong <span>/<a> bình thường (KHÁC html-to-docx), nên việc nhấc img
// không còn bắt buộc — giữ lại để dọn caption span trùng (lặp alt/title) + đơn giản hóa cây.
function liftImageWrappers(html: string): string {
    html = html.replace(/<span[^>]*confluence-embedded-image-title[^>]*>[\s\S]*?<\/span>/gi, '');
    let prev: string;
    do {
        prev = html;
        html = html.replace(
            /<(?:span|a)\b[^>]*>((?:\s|<br\s*\/?>)*)(<img\b[^>]*>)((?:\s|<br\s*\/?>)*)<\/(?:span|a)>/gi,
            '$1$2$3',
        );
    } while (html !== prev);
    return html;
}

// Confluence thường dùng <th> trong <tbody> thay vì <thead>.
// Pandoc chỉ sinh tblHeader (lặp header row qua trang) khi row nằm trong <thead>.
// → Phát hiện row đầu có toàn <th> (không có <td>) → wrap trong <thead>.
function ensureTableHead(html: string): string {
    return html.replace(/<table\b[\s\S]*?<\/table>/gi, (tbl) => {
        if (/<thead\b/i.test(tbl)) return tbl;
        const firstRowM = /<tr\b[^>]*>([\s\S]*?)<\/tr>/i.exec(tbl);
        if (!firstRowM) return tbl;
        const rowContent = firstRowM[1];
        if (/<th\b/i.test(rowContent) && !/<td\b/i.test(rowContent)) {
            return tbl.replace(firstRowM[0], `<thead>${firstRowM[0]}</thead>`);
        }
        return tbl;
    });
}

// Ước lượng số cột của 1 bảng = số ô (td/th) lớn nhất trong 1 hàng (dùng làm fallback).
function tableColumnCount(tableHtml: string): number {
    const rows = tableHtml.match(/<tr\b[\s\S]*?<\/tr>/gi) ?? [];
    let max = 1;
    for (const r of rows) {
        const cells = (r.match(/<t[dh]\b/gi) ?? []).length;
        if (cells > max) max = cells;
    }
    return max;
}

// Đọc bề rộng pixel từ <col> elements.
// Trả null nếu bất kỳ <col> nào thiếu width (không đủ tin cậy để dùng).
function extractColWidths(tbl: string): number[] | null {
    const cols = tbl.match(/<col\b[^>]*\/?>/gi) ?? [];
    if (!cols.length) return null;
    const widths = cols.map(col => {
        const style = attr(col, 'style') ?? '';
        const pct = /width\s*:\s*([0-9.]+)%/i.exec(style);
        if (pct) return Math.round(CONTENT_PX * parseFloat(pct[1]) / 100);
        const px = /width\s*:\s*([0-9.]+)px/i.exec(style);
        if (px) return Math.round(parseFloat(px[1]));
        const wa = attr(col, 'width');
        if (wa) return Math.round(parseFloat(wa));
        return null;
    });
    if (widths.some(w => w === null)) return null;
    return widths as number[];
}

// Phân loại từng cột: true = có ít nhất 1 cell chứa <img>, false = chỉ text.
// Duyệt tất cả <tr>, tính colspan để xác định đúng vị trí cột.
function classifyColumns(tbl: string): boolean[] {
    const result: boolean[] = [];
    for (const row of tbl.match(/<tr\b[\s\S]*?<\/tr>/gi) ?? []) {
        let ci = 0;
        for (const cell of row.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi) ?? []) {
            const cs = parseInt(/colspan\s*=\s*["']?(\d+)/i.exec(cell)?.[1] ?? '1');
            for (let d = 0; d < cs; d++) {
                while (result.length <= ci + d) result.push(false);
                if (/<img\b/i.test(cell)) result[ci + d] = true;
            }
            ci += cs;
        }
    }
    return result;
}

// Bề rộng tối thiểu cho cột chỉ có text/label (không có ảnh).
const TEXT_COL_PX = 120;

// Tính bề rộng pixel cho mỗi cột:
// 1. Dùng explicit <col> widths nếu có → chính xác nhất.
// 2. Không có <col> widths → heuristic: cột ảnh nhận phần lớn không gian còn lại,
//    cột text nhận TEXT_COL_PX tối thiểu.
function calcColWidths(tbl: string): number[] {
    const explicit = extractColWidths(tbl);
    if (explicit) return explicit.map(w => Math.min(w, CONTENT_PX));

    const cls = classifyColumns(tbl);
    const total = cls.length || tableColumnCount(tbl);
    const numImg = cls.filter(Boolean).length;

    if (numImg === 0) {
        // Không có cột ảnh → equal split (fallback cũ)
        const w = Math.max(60, Math.floor(CONTENT_PX / total) - 20);
        return Array(total).fill(w);
    }

    // Cột ảnh: chia đều phần còn lại sau khi trừ text cols + cell padding (~10px/cột)
    const imgPx = Math.max(60,
        Math.floor((CONTENT_PX - (total - numImg) * TEXT_COL_PX - total * 10) / numImg));
    return cls.map(isImg => isImg ? imgPx : TEXT_COL_PX);
}

// Ảnh trong ô bảng phải cap theo BỀ RỘNG CỘT thực tế (Word/OOXML không tự co ảnh theo ô).
// Chiến lược: đọc <col> widths nếu có, không có → heuristic dựa vào loại nội dung cột.
// Xử lý row-by-row để gắn đúng data-maxw cho từng ảnh theo vị trí cột (cộng colspan).
function annotateTableImages(html: string): string {
    return html.replace(/<table\b[\s\S]*?<\/table>/gi, (tbl) => {
        if (!/<img\b/i.test(tbl)) return tbl;
        const colWidths = calcColWidths(tbl);
        return tbl.replace(/<tr\b[\s\S]*?<\/tr>/gi, (row) => {
            if (!/<img\b/i.test(row)) return row;
            let ci = 0;
            return row.replace(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi, (cell) => {
                const cs = parseInt(/colspan\s*=\s*["']?(\d+)/i.exec(cell)?.[1] ?? '1');
                let out = cell;
                if (/<img\b/i.test(cell)) {
                    let totalPx = 0;
                    for (let d = 0; d < cs; d++)
                        totalPx += colWidths[Math.min(ci + d, colWidths.length - 1)];
                    out = cell.replace(/<img\b/gi,
                        `<img data-maxw="${Math.max(60, Math.floor(totalPx) - 20)}"`);
                }
                ci += cs;
                return out;
            });
        });
    });
}

// Xóa mọi khai báo bề rộng cột/bảng → đẩy Pandoc vào nhánh autofit (Word tự dãn cột theo nội dung).
// Lý do: Confluence ép <col style="width:X%"> → Pandoc sinh bảng tblLayout="fixed" mà Word KHÔNG
// co giãn được → text header bị squish dọc. Bảng không có width → Pandoc autofit → Word dãn theo
// nội dung. Chỉ tác động bên trong <table>; ảnh đã được annotateTableImages gắn data-maxw rồi.
function stripTableWidths(html: string): string {
    return html.replace(/<table\b[\s\S]*?<\/table>/gi, (tbl) => {
        let out = tbl.replace(/<colgroup\b[\s\S]*?<\/colgroup>/gi, '');
        out = out.replace(/<col\b[^>]*\/?>/gi, '');
        // Chỉ bỏ width trên td/th (KHÔNG bỏ trên <table>) — giữ width="100%" của bảng để
        // Pandoc sinh tblW=100% và bảng fill trang. Bỏ trên col/colgroup đã xử lý ở trên.
        out = out.replace(/(<(?:td|th)\b[^>]*?)\swidth\s*=\s*("[^"]*"|'[^']*')/gi, '$1');
        out = out.replace(/(<(?:td|th)\b[^>]*?style\s*=\s*")([^"]*)"/gi,
            (_m, pre, css) => `${pre}${css.replace(/width\s*:[^;"]*;?/gi, '')}"`);
        return out;
    });
}

// Duyệt mọi <img>, tải ảnh về data:base64 thay vào src (giữ đúng vị trí trong HTML).
async function inlineImages(
    html: string,
    cfg: ReturnType<typeof loadConfluenceConfig>,
    token: string,
): Promise<{ html: string; embedded: number; skipped: number; skipLog: string[] }> {
    if (!cfg) return { html, embedded: 0, skipped: 0, skipLog: [] };
    const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
    let embedded = 0;
    let skipped = 0;
    let totalBytes = 0;
    const skipLog: string[] = [];

    for (const tag of imgTags) {
        if (embedded >= MAX_IMAGES || totalBytes >= MAX_TOTAL_IMAGE_BYTES) {
            html = html.replace(tag, '');
            skipped++;
            skipLog.push(`[cap] ${attr(tag, 'data-image-src') || attr(tag, 'src') || '?'}`);
            continue;
        }
        const rawSrc = attr(tag, 'data-image-src') || attr(tag, 'src');
        if (!rawSrc || rawSrc.startsWith('data:')) continue;
        const src = rawSrc.replace(/&amp;/g, '&').replace(/&#38;/g, '&').replace(/&quot;/g, '"');
        let { dataUrl, reason } = await fetchImageAsDataUrl(cfg, token, src);
        // embedded-page URLs (Include Page macro) cần resolve qua REST API
        if (!dataUrl && src.includes('/embedded-page/')) {
            const resolvedSrc = await resolveEmbeddedPageUrl(cfg, token, src);
            if (resolvedSrc) {
                ({ dataUrl, reason } = await fetchImageAsDataUrl(cfg, token, resolvedSrc));
            }
        }
        if (!dataUrl) {
            console.warn(`[docx/img] SKIP ${src.slice(0, 120)} → ${reason}`);
            skipLog.push(`[${reason}] ${src.slice(0, 100)}`);
            skipped++;
            html = html.replace(tag, '');
            continue;
        }
        totalBytes += Math.ceil((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
        embedded += 1;

        // Bề rộng tối đa: bề rộng cột (data-maxw do annotateTableImages gắn) hoặc cả trang.
        const maxAttr = attr(tag, 'data-maxw');
        const maxPx = maxAttr ? Math.max(60, parseInt(maxAttr, 10) || CONTENT_PX) : CONTENT_PX;
        const { w, h } = displaySize(dataUrl, maxPx);
        const newTag = `<img src="${dataUrl}" width="${w}" height="${h}" />`;
        html = html.replace(tag, newTag);
    }
    return { html, embedded, skipped, skipLog };
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Chuẩn hóa cấp heading: cấp nhỏ nhất có trong nội dung → H1, các cấp còn lại dịch xuống tương ứng.
// Ví dụ: Confluence dùng H3 làm cấp cao nhất → H3→H1, H4→H2, H5→H3, H6→H4.
function normalizeHeadings(html: string): string {
    let minLevel = 7;
    for (let i = 1; i <= 6; i++) {
        if (new RegExp(`<h${i}\\b`, 'i').test(html)) { minLevel = i; break; }
    }
    if (minLevel <= 1) return html;
    const shift = minLevel - 1;
    // Xử lý từ minLevel lên 6: chuyển H{i} → H{i-shift}. Thứ tự này an toàn vì không tự ghi đè.
    for (let i = minLevel; i <= 6; i++) {
        const to = Math.min(i - shift, 6);
        html = html.replace(new RegExp(`<(\/?)h${i}(\\b[^>]*)>`, 'gi'), `<$1h${to}$2>`);
    }
    return html;
}

// Trang bìa CIC + ngắt trang + nội dung.
// Pandoc BỎ inline CSS (text-align/font-size/margin) → căn lề/cỡ chữ phải đến từ style trong
// reference.docx qua custom-style. Ngắt trang phải qua Lua filter (CSS page-break không có tác dụng):
// dùng <div class="page-break"> → pagebreak.lua đổi thành raw OOXML <w:br w:type="page"/>.
function buildFullHtml(title: string, bodyHtml: string): string {
    const today = new Date().toLocaleDateString('vi-VN');
    const cover = `<div custom-style="Cover Org"><strong>TRUNG TÂM THÔNG TIN TÍN DỤNG QUỐC GIA VIỆT NAM</strong></div>
<div custom-style="Cover Title"><strong>${escapeHtml(title)}</strong></div>
<div custom-style="Cover Meta">Ngày: ${today}</div>
<div custom-style="Cover Meta">Phiên bản: 1.0</div>
<div class="page-break"></div>`;
    return `<!DOCTYPE html><html><body>\n${cover}\n${bodyHtml}\n</body></html>`;
}

// Tìm file reference.docx: bản sống gitignored → bản example committed → null (dùng style mặc định Pandoc).
function getReferencePath(): string | null {
    const live = path.join(process.cwd(), 'config', 'cic-reference.docx');
    if (fs.existsSync(live)) return live;
    const example = path.join(process.cwd(), 'config', 'cic-reference.example.docx');
    if (fs.existsSync(example)) return example;
    return null;
}

// Lua filter đổi <div class="page-break"> thành raw OOXML ngắt trang (CSS page-break bị Pandoc bỏ).
function getPageBreakFilter(): string | null {
    const p = path.join(process.cwd(), 'config', 'pagebreak.lua');
    return fs.existsSync(p) ? p : null;
}

// ── ZIP post-processor: inject <w:tblLayout w:type="autofit"/> vào từng <w:tblPr> trong
//    word/document.xml của DOCX Pandoc output. Đảm bảo autofit trực tiếp trong document.xml
//    thay vì phụ thuộc style inheritance (không reliable trên mọi phiên bản Word).
//    Thuần Node.js built-in zlib, không thêm dependency.

const CRC32_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        t[i] = c;
    }
    return t;
})();

function crc32(buf: Buffer): number {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = CRC32_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function unpackZip(buf: Buffer): Array<{ name: string; data: Buffer }> {
    let eocdOff = -1;
    for (let i = buf.length - 22; i >= 0; i--) {
        if (buf.readUInt32LE(i) === 0x06054b50) { eocdOff = i; break; }
    }
    if (eocdOff === -1) return [];
    const cdOff = buf.readUInt32LE(eocdOff + 16);
    const numEntries = buf.readUInt16LE(eocdOff + 10);
    const entries: Array<{ name: string; data: Buffer }> = [];
    let pos = cdOff;
    for (let i = 0; i < numEntries; i++) {
        if (buf.readUInt32LE(pos) !== 0x02014b50) break;
        const method = buf.readUInt16LE(pos + 10);
        const compSize = buf.readUInt32LE(pos + 20);
        const fnLen = buf.readUInt16LE(pos + 28);
        const extraLen = buf.readUInt16LE(pos + 30);
        const commentLen = buf.readUInt16LE(pos + 32);
        const localOff = buf.readUInt32LE(pos + 42);
        const name = buf.slice(pos + 46, pos + 46 + fnLen).toString('utf-8');
        const lhFnLen = buf.readUInt16LE(localOff + 26);
        const lhExtraLen = buf.readUInt16LE(localOff + 28);
        const dataOff = localOff + 30 + lhFnLen + lhExtraLen;
        const compressed = buf.slice(dataOff, dataOff + compSize);
        const data = method === 8 ? zlib.inflateRawSync(compressed) : compressed;
        entries.push({ name, data });
        pos += 46 + fnLen + extraLen + commentLen;
    }
    return entries;
}

function repackZip(entries: Array<{ name: string; data: Buffer }>): Buffer {
    const parts: Buffer[] = [];
    const cds: Buffer[] = [];
    let offset = 0;
    for (const { name, data } of entries) {
        const compressed = zlib.deflateRawSync(data, { level: 6 });
        const checksum = crc32(data);
        const nameBuf = Buffer.from(name, 'utf-8');
        const lh = Buffer.alloc(30 + nameBuf.length);
        lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
        lh.writeUInt16LE(8, 8); lh.writeUInt32LE(checksum, 14);
        lh.writeUInt32LE(compressed.length, 18); lh.writeUInt32LE(data.length, 22);
        lh.writeUInt16LE(nameBuf.length, 26); nameBuf.copy(lh, 30);
        const cd = Buffer.alloc(46 + nameBuf.length);
        cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6);
        cd.writeUInt16LE(8, 10); cd.writeUInt32LE(checksum, 16);
        cd.writeUInt32LE(compressed.length, 20); cd.writeUInt32LE(data.length, 24);
        cd.writeUInt16LE(nameBuf.length, 28); cd.writeUInt32LE(offset, 42);
        nameBuf.copy(cd, 46);
        parts.push(lh, compressed); cds.push(cd);
        offset += lh.length + compressed.length;
    }
    const cdBuf = Buffer.concat(cds);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(entries.length, 8);
    eocd.writeUInt16LE(entries.length, 10); eocd.writeUInt32LE(cdBuf.length, 12);
    eocd.writeUInt32LE(offset, 16);
    return Buffer.concat([...parts, cdBuf, eocd]);
}

// Bề rộng vùng text A4 theo margin cic-reference: 11906 - left 1417 - right 1134 = 9355 twips.
const TABLE_MAX_TWIPS = 9355;

function patchDocxTableAutofit(docxBuf: Buffer): Buffer {
    const entries = unpackZip(docxBuf);
    if (!entries.length) return docxBuf;
    const patched = entries.map(({ name, data }) => {
        if (name !== 'word/document.xml') return { name, data };
        let xml = data.toString('utf-8');
        // Match cặp tblPr + tblGrid (2 sibling đầu mỗi bảng; không lồng nhau nên an toàn cả với nested table).
        xml = xml.replace(
            /(<w:tblPr>)([\s\S]*?)(<\/w:tblPr>)(\s*<w:tblGrid>[\s\S]*?<\/w:tblGrid>)/g,
            (_all, open: string, inner: string, close: string, grid: string) => {
                // 1. tblW → 100% (pct 5000): bảng luôn rộng đúng trang. Thay tại chỗ giữ thứ tự schema.
                if (/<w:tblW\b[^>]*\/>/.test(inner)) {
                    inner = inner.replace(/<w:tblW\b[^>]*\/>/, '<w:tblW w:w="5000" w:type="pct"/>');
                } else {
                    inner = `<w:tblW w:w="5000" w:type="pct"/>${inner}`;
                }
                // 2. tblLayout → autofit (OVERRIDE cả 'fixed' của Pandoc → Word tự co cột vừa trang,
                //    không ép theo gridCol cứng gây tràn margin). Đặt ngay sau tblW (đúng thứ tự schema).
                if (/<w:tblLayout\b/.test(inner)) {
                    inner = inner.replace(/<w:tblLayout\b[^>]*\/>/, '<w:tblLayout w:type="autofit"/>');
                } else {
                    inner = inner.replace(/(<w:tblW\b[^>]*\/>)/, '$1<w:tblLayout w:type="autofit"/>');
                }
                // 3. Rescale gridCol nếu tổng > bề rộng trang (giúp docx-preview & fallback fixed không tràn).
                const cols = [...grid.matchAll(/<w:gridCol w:w="(\d+)"/g)].map((m) => parseInt(m[1], 10));
                const sum = cols.reduce((a, b) => a + b, 0);
                if (sum > TABLE_MAX_TWIPS) {
                    const f = TABLE_MAX_TWIPS / sum;
                    grid = grid.replace(/<w:gridCol w:w="(\d+)"/g,
                        (_m, w) => `<w:gridCol w:w="${Math.round(parseInt(w, 10) * f)}"`);
                }
                return `${open}${inner}${close}${grid}`;
            },
        );
        // Format trực tiếp HEADER ROW (row có <w:tblHeader>): căn giữa ngang + dọc. Bold đã có sẵn
        // từ Pandoc. Dùng direct formatting thay conditional firstRow để Word lẫn docx-preview đều đúng.
        // Header row không chứa bảng lồng → match <w:tr>…</w:tr> non-greedy an toàn.
        xml = xml.replace(/<w:tr\b[^>]*>[\s\S]*?<\/w:tr>/g, (row) => {
            if (!row.includes('<w:tblHeader')) return row;
            let r = row;
            // Vertical center: tcPr rỗng → thêm vAlign; tcPr có nội dung & chưa có vAlign → chèn đầu.
            r = r.replace(/<w:tcPr\s*\/>/g, '<w:tcPr><w:vAlign w:val="center"/></w:tcPr>');
            r = r.replace(/<w:tcPr>(?![\s\S]*?<w:vAlign)([\s\S]*?)<\/w:tcPr>/g,
                '<w:tcPr><w:vAlign w:val="center"/>$1</w:tcPr>');
            // Horizontal center: thay jc sẵn có; pPr chưa có jc → thêm vào cuối pPr.
            r = r.replace(/<w:jc w:val="[^"]*"\s*\/>/g, '<w:jc w:val="center"/>');
            r = r.replace(/<w:pPr>(?![\s\S]*?<w:jc)([\s\S]*?)<\/w:pPr>/g,
                '<w:pPr>$1<w:jc w:val="center"/></w:pPr>');
            return r;
        });
        return { name, data: Buffer.from(xml, 'utf-8') };
    });
    return repackZip(patched);
}

async function runPandoc(html: string, refDoc: string | null): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const args = ['--from=html', '--to=docx', '--standalone', '-o', '-'];
        if (refDoc) args.push(`--reference-doc=${refDoc}`);
        const luaFilter = getPageBreakFilter();
        if (luaFilter) args.push(`--lua-filter=${luaFilter}`);
        const child = spawn('pandoc', args);
        const chunks: Buffer[] = [];
        let errMsg = '';
        child.stdout.on('data', (c: Buffer) => chunks.push(c));
        child.stderr.on('data', (d: Buffer) => { errMsg += d.toString(); });
        child.on('close', (code: number | null) => {
            if (code !== 0) reject(new Error(`Pandoc lỗi (${code}): ${errMsg.slice(0, 400)}`));
            else resolve(Buffer.concat(chunks));
        });
        child.on('error', (e: Error) => reject(new Error(`Không thể khởi động Pandoc: ${e.message}`)));
        child.stdin.write(html, 'utf8');
        child.stdin.end();
    });
}

// ── In-memory DOCX store: lưu file đã tạo 30 phút để preview và download dùng cùng 1 binary.
interface DocxEntry { buffer: Buffer; filename: string; title: string; expires: number; }
const docxStore = new Map<string, DocxEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

function cleanExpired() {
    const now = Date.now();
    for (const [k, v] of docxStore) if (v.expires < now) docxStore.delete(k);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');
    if (!fileId) return err('Thiếu fileId.', 400);
    const entry = docxStore.get(fileId);
    if (!entry) return err('File không tồn tại hoặc đã hết hạn (30 phút). Vui lòng tạo lại.', 404);
    const isDownload = searchParams.get('download') === '1';
    return new NextResponse(entry.buffer as unknown as BodyInit, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': isDownload
                ? `attachment; filename="${entry.filename}"; filename*=UTF-8''${encodeURIComponent(entry.filename)}`
                : 'inline',
        },
    });
}

export async function POST(req: Request) {
    const cfg = loadConfluenceConfig();
    if (!cfg) return err('Chưa cấu hình baseUrl Confluence trên server (config/confluence.json).', 400);

    let body: { url?: string; pageId?: string; token?: string };
    try {
        body = await req.json();
    } catch {
        return err('Body không phải JSON hợp lệ.');
    }

    const token = body.token?.trim() || cfg.token;
    if (!token) return err('Chưa có PAT Confluence. Hãy cấu hình PAT trong tool.', 400);

    try {
        const pageId = await resolvePageId(cfg, token, body);

        // export_view = representation Confluence dùng cho Export-to-Word: ảnh full-res (không thumbnail),
        // HTML sạch hơn body.view. Giữ body.view làm fallback nếu export_view rỗng.
        const pageRes = await cfFetch(
            cfg, token,
            `/rest/api/content/${pageId}?expand=body.export_view,body.view,title`,
        );
        if (pageRes.status === 401 || pageRes.status === 403) {
            return err('Confluence: token sai hoặc không có quyền đọc trang.', 502);
        }
        if (pageRes.status === 404) return err(`Không tìm thấy trang pageId=${pageId}.`, 502);
        if (!pageRes.ok) return err(`Confluence lỗi (${pageRes.status}).`, 502);

        const page = await pageRes.json();
        const title: string = page?.title ?? '';
        const rawHtml: string =
            page?.body?.export_view?.value || page?.body?.view?.value || '';

        const { html: bodyHtml, embedded, skipped, skipLog } = await inlineImages(
            stripTableWidths(annotateTableImages(normalizeHeadings(ensureTableHead(liftImageWrappers(rawHtml))))),
            cfg,
            token,
        );
        if (skipped > 0) {
            console.warn(`[docx/img] pageId=${pageId} embedded=${embedded} skipped=${skipped}`);
            skipLog.forEach(l => console.warn('  ', l));
        }
        const fullHtml = buildFullHtml(title, bodyHtml);
        const refDoc = getReferencePath();
        const buffer = patchDocxTableAutofit(await runPandoc(fullHtml, refDoc));

        const safeTitle = (title || 'confluence').replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 150);
        const asciiFilename = removeVietnameseDiacritics(`${pageId} - ${safeTitle || 'confluence'}.docx`)
            .replace(/[^\x20-\x7e]/g, '_');

        cleanExpired();
        const fileId = crypto.randomUUID();
        docxStore.set(fileId, { buffer, filename: asciiFilename, title, expires: Date.now() + CACHE_TTL_MS });

        return NextResponse.json({ fileId, title, filename: asciiFilename });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi khi chuyển Confluence → Word.';
        return err(message, 502);
    }
}
