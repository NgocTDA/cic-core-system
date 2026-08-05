// ============================================================
//  POST /api/confluence/page — kéo nội dung 1 trang Confluence + Trang con (Server/DC)
//  Body: { url?: string, pageId?: string, token?: string, includeChildren?: boolean }
//  Server dùng PAT (Bearer) → KHÔNG lộ ra browser.
//  Trả: { title, markdown, images: [{ name, dataUrl }] }
// ============================================================

import { NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { loadConfluenceConfig, type ConfluenceConfig } from '../confluenceConfig';
import { cfFetch, resolvePageId, MAX_IMAGE_BYTES } from '../confluenceClient';

export const runtime = 'nodejs';

const MAX_IMAGES = 50;

function err(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

function htmlToMarkdown(html: string): string {
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    td.use(gfm);
    td.addRule('keepImageTag', {
        filter: 'img',
        replacement: (_content, node) => {
            const el = node as HTMLElement;
            const alt = el.getAttribute('alt') || '';
            const src = el.getAttribute('src') || el.getAttribute('data-image-src') || '';
            const title = el.getAttribute('title') || '';
            const rawName = src.split('/').pop()?.split('?')[0] || '';
            let filename = decodeURIComponent(rawName || alt || title || 'image.png');
            // Clean filename
            filename = filename.replace(/[^\w.-]/g, '_');
            return `\n![${filename}](${filename})\n`;
        },
    });
    return td.turndown(html);
}

async function fetchPageAttachments(
    cfg: ConfluenceConfig,
    token: string,
    targetPageId: string,
    existingImages: { name: string; dataUrl: string }[],
) {
    const attRes = await cfFetch(cfg, token, `/rest/api/content/${targetPageId}/child/attachment?limit=100`);
    if (!attRes.ok) return;

    const att = await attRes.json();
    const list: any[] = att?.results ?? [];
    for (const a of list) {
        if (existingImages.length >= MAX_IMAGES) break;
        const media: string = a?.extensions?.mediaType ?? a?.metadata?.mediaType ?? '';
        const download: string = a?._links?.download ?? '';
        if (!media.startsWith('image/') || !download) continue;

        const imgTitle: string = (a?.title ?? 'image').replace(/[^\w.-]/g, '_');
        if (existingImages.some((img) => img.name === imgTitle)) continue;

        const dlRes = await cfFetch(cfg, token, download);
        if (!dlRes.ok) continue;
        const buf = Buffer.from(await dlRes.arrayBuffer());
        if (buf.byteLength > MAX_IMAGE_BYTES) continue;

        existingImages.push({
            name: imgTitle,
            dataUrl: `data:${media};base64,${buf.toString('base64')}`,
        });
    }
}

export async function POST(req: Request) {
    const cfg = loadConfluenceConfig();
    if (!cfg) return err('Chưa cấu hình baseUrl Confluence trên server (config/confluence.json).', 400);

    let body: { url?: string; pageId?: string; token?: string; includeChildren?: boolean };
    try {
        body = await req.json();
    } catch {
        return err('Body không phải JSON hợp lệ.');
    }

    const token = body.token?.trim() || cfg.token;
    if (!token) return err('Chưa có PAT Confluence. Hãy cấu hình PAT trong tool.', 400);

    try {
        const pageId = await resolvePageId(cfg, token, body);

        // 1) Lấy trang gốc
        const pageRes = await cfFetch(cfg, token, `/rest/api/content/${pageId}?expand=body.view,title`);
        if (pageRes.status === 401 || pageRes.status === 403) {
            return err('Confluence: token sai hoặc không có quyền đọc trang.', 502);
        }
        if (pageRes.status === 404) return err(`Không tìm thấy trang pageId=${pageId}.`, 502);
        if (!pageRes.ok) return err(`Confluence lỗi (${pageRes.status}).`, 502);

        const page = await pageRes.json();
        const mainTitle: string = page?.title ?? '';
        const mainHtml: string = page?.body?.view?.value ?? '';
        let fullMarkdown = `# ${mainTitle}\n\n` + htmlToMarkdown(mainHtml);

        const images: { name: string; dataUrl: string }[] = [];
        await fetchPageAttachments(cfg, token, pageId, images);

        // 2) Kiểm tra và kéo trang con (nếu có)
        const childrenRes = await cfFetch(cfg, token, `/rest/api/content/${pageId}/child/page?limit=50&expand=body.view,title`);
        if (childrenRes.ok) {
            const childrenData = await childrenRes.json();
            const childPages: any[] = childrenData?.results ?? [];

            for (const child of childPages) {
                const childId: string = child?.id;
                const childTitle: string = child?.title ?? '';
                const childHtml: string = child?.body?.view?.value ?? '';

                fullMarkdown += `\n\n---\n## Trang con: ${childTitle}\n\n` + htmlToMarkdown(childHtml);
                if (childId) {
                    await fetchPageAttachments(cfg, token, childId, images);
                }
            }
        }

        return NextResponse.json({ pageId, title: mainTitle, markdown: fullMarkdown, images });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Lỗi không xác định khi kéo Confluence.';
        return err(message, 502);
    }
}
