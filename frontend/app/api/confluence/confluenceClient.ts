// ============================================================
//  Confluence client helpers (SERVER-ONLY) — dùng chung cho các route.
//  Gồm: parse URL → pageId, resolvePageId, fetch có Bearer, tải ảnh → dataUrl.
// ============================================================

import type { ConfluenceConfig } from './confluenceConfig';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // bỏ ảnh > 5MB để payload không quá lớn

// Tách pageId / (space,title) từ URL Confluence (nhiều dạng).
export function parseUrl(url: string): { pageId?: string; space?: string; title?: string } {
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

// Fetch tới Confluence: pathOrUrl tương đối (ghép baseUrl) hoặc tuyệt đối. Luôn kèm Bearer.
export async function cfFetch(cfg: ConfluenceConfig, token: string, pathOrUrl: string): Promise<Response> {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${cfg.baseUrl}${pathOrUrl}`;
    return fetch(url, {
        headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
    });
}

export async function resolvePageId(
    cfg: ConfluenceConfig,
    token: string,
    body: { url?: string; pageId?: string },
): Promise<string> {
    if (body.pageId?.trim()) return body.pageId.trim();
    if (!body.url?.trim()) throw new Error('Thiếu url hoặc pageId.');
    const parsed = parseUrl(body.url);
    if (parsed.pageId) return parsed.pageId;
    if (parsed.space && parsed.title) {
        const q = `/rest/api/content?spaceKey=${encodeURIComponent(parsed.space)}&title=${encodeURIComponent(parsed.title)}&limit=1`;
        const res = await cfFetch(cfg, token, q);
        if (!res.ok) throw new Error(`Không tra được trang theo URL (${res.status}).`);
        const data = await res.json();
        const id = data?.results?.[0]?.id;
        if (!id) throw new Error('Không tìm thấy trang khớp URL. Hãy dán pageId trực tiếp.');
        return id;
    }
    throw new Error('Không lấy được pageId từ URL. Hãy dán pageId trực tiếp.');
}

// Tải 1 ảnh về dạng data:base64. src có thể tương đối (/download/...) hoặc tuyệt đối (ảnh ngoài).
// Ảnh cùng host Confluence → kèm Bearer; ảnh ngoài → fetch trần. Lỗi/không phải ảnh/quá lớn → null.
export async function fetchImageAsDataUrl(
    cfg: ConfluenceConfig,
    token: string,
    src: string,
): Promise<string | null> {
    try {
        const absolute = src.startsWith('http') ? src : `${cfg.baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
        const sameHost = absolute.startsWith(cfg.baseUrl);
        const res = await fetch(absolute, {
            headers: sameHost ? { authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return null;
        const media = (res.headers.get('content-type') || '').split(';')[0].trim();
        if (!media.startsWith('image/')) return null;
        const buf = Buffer.from(await res.arrayBuffer());
        if (!buf.byteLength || buf.byteLength > MAX_IMAGE_BYTES) return null;
        return `data:${media};base64,${buf.toString('base64')}`;
    } catch {
        return null;
    }
}
