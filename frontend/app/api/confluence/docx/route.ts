// ============================================================
//  POST /api/confluence/docx — chuyển 1 trang Confluence → Word TRUNG THỰC.
//  Body: { url?, pageId?, token? }
//  Luồng: body.view HTML → nhúng ảnh base64 đúng vị trí → html-to-docx → .docx
//  KHÔNG qua AI, KHÔNG ép template SRS. PAT (Bearer) chỉ ở server.
// ============================================================

import { NextResponse } from 'next/server';
import htmlToDocx from 'html-to-docx';
import { loadConfluenceConfig } from '../confluenceConfig';
import { cfFetch, resolvePageId, fetchImageAsDataUrl } from '../confluenceClient';

export const runtime = 'nodejs';

// ── Khổ giấy & margin ──────────────────────────────────────
// A4: 11906 × 16838 twips. Margin 1 inch (1440 twips) mỗi bên.
// Content width = (11906 - 1440 - 1440) twips = 9026 twips = 9026/1440*96 ≈ 601 px @96dpi.
const A4_W = 11906;
const A4_H = 16838;
const MARGIN = 1440; // 1 inch
const CONTENT_PX = Math.floor((A4_W - MARGIN * 2) / 1440 * 96); // ≈ 601

const MAX_IMAGES = 50;
const MAX_TOTAL_IMAGE_BYTES = 30 * 1024 * 1024;

function err(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

function safeName(s: string): string {
    return (s || 'confluence').replace(/\s+/g, '_').replace(/[^\w_-]/g, '').slice(0, 80) || 'confluence';
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

// Tính width/height hiển thị (px): giữ tỉ lệ, thu về CONTENT_PX nếu quá rộng, không phóng to.
function displaySize(dataUrl: string): { w: number; h: number } {
    try {
        const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
        const px = pixelSize(buf);
        if (px && px.w > 0 && px.h > 0) {
            if (px.w <= CONTENT_PX) return { w: px.w, h: px.h };
            return { w: CONTENT_PX, h: Math.round(px.h * CONTENT_PX / px.w) };
        }
    } catch { /* ignore */ }
    return { w: CONTENT_PX, h: Math.round(CONTENT_PX * 0.6) }; // fallback
}

// Lấy giá trị 1 thuộc tính từ chuỗi thẻ <img ...>.
function attr(tag: string, name: string): string | null {
    const m = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i').exec(tag)
        || new RegExp(`${name}\\s*=\\s*'([^']*)'`, 'i').exec(tag);
    return m ? m[1] : null;
}

// html-to-docx CHỈ nhúng <img> khi nó là con trực tiếp của block (vd <p>).
// Confluence bọc ảnh trong <span class="confluence-embedded-file-wrapper"> → img nằm
// trong span inline → bị bỏ. Gỡ caption span + nhấc img ra khỏi mọi <span>/<a> bao quanh.
function liftImageWrappers(html: string): string {
    // bỏ caption overlay của Confluence (chỉ lặp lại alt/title)
    html = html.replace(/<span[^>]*confluence-embedded-image-title[^>]*>[\s\S]*?<\/span>/gi, '');
    // nhấc img ra khỏi span/a bao quanh (lặp để xử lý lồng nhau)
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

// Duyệt mọi <img>, tải ảnh về data:base64 thay vào src (giữ đúng vị trí trong HTML).
// Ảnh lỗi/vượt cap → bỏ luôn thẻ (không vỡ tài liệu). Trả HTML đã xử lý + số ảnh nhúng.
async function inlineImages(
    html: string,
    cfg: ReturnType<typeof loadConfluenceConfig>,
    token: string,
): Promise<{ html: string; embedded: number }> {
    if (!cfg) return { html, embedded: 0 };
    const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
    let embedded = 0;
    let totalBytes = 0;

    for (const tag of imgTags) {
        if (embedded >= MAX_IMAGES || totalBytes >= MAX_TOTAL_IMAGE_BYTES) {
            html = html.replace(tag, '');
            continue;
        }
        const rawSrc = attr(tag, 'data-image-src') || attr(tag, 'src');
        if (!rawSrc || rawSrc.startsWith('data:')) continue; // đã base64 → giữ nguyên
        // src trong HTML đã escape entity (&amp; → &) — decode trước khi fetch.
        const src = rawSrc.replace(/&amp;/g, '&').replace(/&#38;/g, '&').replace(/&quot;/g, '"');
        const dataUrl = await fetchImageAsDataUrl(cfg, token, src);
        if (!dataUrl) {
            html = html.replace(tag, ''); // tải lỗi → bỏ ảnh
            continue;
        }
        totalBytes += Math.ceil((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
        embedded += 1;

        // Tính kích thước hiển thị: đọc pixel thật → thu nhỏ nếu > CONTENT_PX, không phóng to.
        // html-to-docx dùng width/height attr (px) để suy ra kích thước trong docx.
        const { w, h } = displaySize(dataUrl);
        const newTag = `<img src="${dataUrl}" width="${w}" height="${h}" />`;
        html = html.replace(tag, newTag);
    }
    return { html, embedded };
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

        const pageRes = await cfFetch(cfg, token, `/rest/api/content/${pageId}?expand=body.view,title`);
        if (pageRes.status === 401 || pageRes.status === 403) {
            return err('Confluence: token sai hoặc không có quyền đọc trang.', 502);
        }
        if (pageRes.status === 404) return err(`Không tìm thấy trang pageId=${pageId}.`, 502);
        if (!pageRes.ok) return err(`Confluence lỗi (${pageRes.status}).`, 502);

        const page = await pageRes.json();
        const title: string = page?.title ?? '';
        const rawHtml: string = page?.body?.view?.value ?? '';

        const { html: bodyHtml } = await inlineImages(liftImageWrappers(rawHtml), cfg, token);
        const fullHtml = `<h1>${escapeHtml(title)}</h1>\n${bodyHtml}`;

        const buffer: Buffer = (await htmlToDocx(fullHtml, undefined, {
            pageSize: { width: A4_W, height: A4_H },
            margins: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN, header: 720, footer: 720, gutter: 0 },
            table: { row: { cantSplit: true } },
            footer: false,
            pageNumber: false,
        })) as Buffer;

        const filename = `${safeName(title)}.docx`;
        return new NextResponse(buffer as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
                // Tiêu đề trang (đã encode) cho client hiển thị header.
                'X-Doc-Title': encodeURIComponent(title),
            },
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi khi chuyển Confluence → Word.';
        return err(message, 502);
    }
}
