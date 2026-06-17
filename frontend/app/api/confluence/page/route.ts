// ============================================================
//  POST /api/confluence/page — kéo nội dung 1 trang Confluence (Server/DC)
//  Body: { url?: string, pageId?: string }
//  Server dùng PAT (Bearer) → KHÔNG lộ ra browser.
//  Trả: { title, markdown, images: [{ name, dataUrl }] }
// ============================================================

import { NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { loadConfluenceConfig, type ConfluenceConfig } from '../confluenceConfig';

export const runtime = 'nodejs';

const MAX_IMAGES = 10;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // bỏ ảnh > 5MB để payload không quá lớn

function err(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

// Tách pageId / (space,title) từ URL Confluence (nhiều dạng).
function parseUrl(url: string): { pageId?: string; space?: string; title?: string } {
    try {
        const u = new URL(url);
        const pid = u.searchParams.get('pageId');
        if (pid) return { pageId: pid };
        const mPages = /\/pages\/(\d+)/.exec(u.pathname);
        if (mPages) return { pageId: mPages[1] };
        const mDisplay = /\/display\/([^/]+)\/([^/?#]+)/.exec(u.pathname);
        if (mDisplay) {
            return {
                space: decodeURIComponent(mDisplay[1]),
                title: decodeURIComponent(mDisplay[2].replace(/\+/g, ' ')),
            };
        }
    } catch {
        // không phải URL hợp lệ
    }
    return {};
}

async function cfFetch(cfg: ConfluenceConfig, pathOrUrl: string): Promise<Response> {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${cfg.baseUrl}${pathOrUrl}`;
    return fetch(url, {
        headers: { authorization: `Bearer ${cfg.token}`, accept: 'application/json' },
    });
}

async function resolvePageId(cfg: ConfluenceConfig, body: { url?: string; pageId?: string }): Promise<string> {
    if (body.pageId?.trim()) return body.pageId.trim();
    if (!body.url?.trim()) throw new Error('Thiếu url hoặc pageId.');
    const parsed = parseUrl(body.url);
    if (parsed.pageId) return parsed.pageId;
    if (parsed.space && parsed.title) {
        const q = `/rest/api/content?spaceKey=${encodeURIComponent(parsed.space)}&title=${encodeURIComponent(parsed.title)}&limit=1`;
        const res = await cfFetch(cfg, q);
        if (!res.ok) throw new Error(`Không tra được trang theo URL (${res.status}).`);
        const data = await res.json();
        const id = data?.results?.[0]?.id;
        if (!id) throw new Error('Không tìm thấy trang khớp URL. Hãy dán pageId trực tiếp.');
        return id;
    }
    throw new Error('Không lấy được pageId từ URL. Hãy dán pageId trực tiếp.');
}

function htmlToMarkdown(html: string): string {
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    td.use(gfm);
    td.addRule('dropImages', { filter: 'img', replacement: () => '' }); // ảnh trả riêng
    return td.turndown(html);
}

export async function POST(req: Request) {
    const cfg = loadConfluenceConfig();
    if (!cfg) return err('Chưa cấu hình Confluence (config/confluence.json: baseUrl + token).', 400);

    let body: { url?: string; pageId?: string };
    try {
        body = await req.json();
    } catch {
        return err('Body không phải JSON hợp lệ.');
    }

    try {
        const pageId = await resolvePageId(cfg, body);

        // 1) Lấy body.view (HTML render) + title
        const pageRes = await cfFetch(cfg, `/rest/api/content/${pageId}?expand=body.view,title`);
        if (pageRes.status === 401 || pageRes.status === 403) {
            return err('Confluence: token sai hoặc không có quyền đọc trang.', 502);
        }
        if (pageRes.status === 404) return err(`Không tìm thấy trang pageId=${pageId}.`, 502);
        if (!pageRes.ok) return err(`Confluence lỗi (${pageRes.status}).`, 502);
        const page = await pageRes.json();
        const title: string = page?.title ?? '';
        const html: string = page?.body?.view?.value ?? '';
        const markdown = htmlToMarkdown(html);

        // 2) Tải ảnh attachment
        const images: { name: string; dataUrl: string }[] = [];
        const attRes = await cfFetch(cfg, `/rest/api/content/${pageId}/child/attachment?limit=100`);
        if (attRes.ok) {
            const att = await attRes.json();
            const list: any[] = att?.results ?? [];
            for (const a of list) {
                if (images.length >= MAX_IMAGES) break;
                const media: string = a?.extensions?.mediaType ?? a?.metadata?.mediaType ?? '';
                const download: string = a?._links?.download ?? '';
                if (!media.startsWith('image/') || !download) continue;
                const dlRes = await cfFetch(cfg, download);
                if (!dlRes.ok) continue;
                const buf = Buffer.from(await dlRes.arrayBuffer());
                if (buf.byteLength > MAX_IMAGE_BYTES) continue;
                images.push({ name: a?.title ?? 'image', dataUrl: `data:${media};base64,${buf.toString('base64')}` });
            }
        }

        return NextResponse.json({ pageId, title, markdown, images });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi không xác định khi kéo Confluence.';
        return err(message, 502);
    }
}
