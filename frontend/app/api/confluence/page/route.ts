// ============================================================
//  POST /api/confluence/page — kéo nội dung 1 trang Confluence (Server/DC)
//  Body: { url?: string, pageId?: string }
//  Server dùng PAT (Bearer) → KHÔNG lộ ra browser.
//  Trả: { title, markdown, images: [{ name, dataUrl }] }
// ============================================================

import { NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { loadConfluenceConfig } from '../confluenceConfig';
import { cfFetch, resolvePageId, MAX_IMAGE_BYTES } from '../confluenceClient';

export const runtime = 'nodejs';

const MAX_IMAGES = 10;

function err(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

function htmlToMarkdown(html: string): string {
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    td.use(gfm);
    td.addRule('dropImages', { filter: 'img', replacement: () => '' }); // ảnh trả riêng
    return td.turndown(html);
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

    // PAT của người dùng (từ localStorage, gửi lên) ghi đè PAT mặc định trong config.
    const token = body.token?.trim() || cfg.token;
    if (!token) return err('Chưa có PAT Confluence. Hãy cấu hình PAT trong tool.', 400);

    try {
        const pageId = await resolvePageId(cfg, token, body);

        // 1) Lấy body.view (HTML render) + title
        const pageRes = await cfFetch(cfg, token, `/rest/api/content/${pageId}?expand=body.view,title`);
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
        const attRes = await cfFetch(cfg, token, `/rest/api/content/${pageId}/child/attachment?limit=100`);
        if (attRes.ok) {
            const att = await attRes.json();
            const list: any[] = att?.results ?? [];
            for (const a of list) {
                if (images.length >= MAX_IMAGES) break;
                const media: string = a?.extensions?.mediaType ?? a?.metadata?.mediaType ?? '';
                const download: string = a?._links?.download ?? '';
                if (!media.startsWith('image/') || !download) continue;
                const dlRes = await cfFetch(cfg, token, download);
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
