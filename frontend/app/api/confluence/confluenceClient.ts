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

// Only the administrator-configured origin is trusted, including private/internal hosts.
// External images are deliberately rejected: they must not become an SSRF proxy.
export function trustedUrl(cfg: ConfluenceConfig, input: string): URL {
    const base = new URL(cfg.baseUrl);
    const url = new URL(input, `${cfg.baseUrl.replace(/\/$/, '')}/`);
    if (!['http:', 'https:'].includes(base.protocol) || url.origin !== base.origin ||
        url.username || url.password || base.username || base.password) {
        throw new Error('Confluence URL ngoài origin được cấu hình.');
    }
    return url;
}

// Confluence returns both context-relative and origin-relative links.
function requestUrl(cfg: ConfluenceConfig, input: string): URL {
    const base = new URL(cfg.baseUrl);
    const context = base.pathname.replace(/\/$/, '');
    if (input.startsWith('/') && !input.startsWith('//')) {
        return trustedUrl(cfg, input === context || input.startsWith(`${context}/`)
            ? new URL(input, base.origin).href : `${cfg.baseUrl.replace(/\/$/, '')}${input}`);
    }
    return trustedUrl(cfg, input);
}

export async function cfFetch(cfg: ConfluenceConfig, token: string, pathOrUrl: string,
    maxBytes = 10 * 1024 * 1024): Promise<Response> {
    // REST paths are relative to the configured context path (e.g. /confluence).
    let url = requestUrl(cfg, pathOrUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
        for (let redirects = 0; redirects <= 5; redirects++) {
            const res = await fetch(url, {
                headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
                redirect: 'manual', signal: controller.signal, cache: 'no-store',
            });
            if ([301, 302, 303, 307, 308].includes(res.status)) {
                await res.body?.cancel();
                const location = res.headers.get('location');
                if (!location || redirects === 5) throw new Error('Confluence redirect limit exceeded.');
                url = trustedUrl(cfg, new URL(location, url).href);
                continue;
            }
            const declared = Number(res.headers.get('content-length'));
            if (declared > maxBytes) {
                await res.body?.cancel();
                throw new Error('Confluence response exceeds byte limit.');
            }
            const chunks: Uint8Array[] = [];
            let length = 0;
            const reader = res.body?.getReader();
            if (reader) {
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        length += value.byteLength;
                        if (length > maxBytes) throw new Error('Confluence response exceeds byte limit.');
                        chunks.push(value);
                    }
                } finally {
                    await reader.cancel();
                    reader.releaseLock();
                }
            }
            return new Response([204, 205, 304].includes(res.status) ? null : Buffer.concat(chunks), {
                status: res.status, statusText: res.statusText, headers: res.headers,
            });
        }
        throw new Error('Confluence redirect limit exceeded.');
    } finally {
        clearTimeout(timer);
    }
}

// Fail explicitly on loops/limits rather than silently returning incomplete data.
export async function cfFetchCollection(cfg: ConfluenceConfig, token: string, path: string): Promise<any[]> {
    const results: any[] = [];
    const visited = new Set<string>();
    let next: string | undefined = path;
    for (let page = 0; next && page < 10; page++) {
        if (visited.has(next)) throw new Error('Confluence pagination loop.');
        visited.add(next);
        const res = await cfFetch(cfg, token, next);
        if (!res.ok) throw new Error(`Confluence collection HTTP ${res.status}.`);
        const data = await res.json();
        if (!Array.isArray(data.results)) throw new Error('Confluence collection invalid.');
        results.push(...data.results);
        if (results.length > 1000) throw new Error('Confluence collection exceeds 1000 items.');
        // Resolve pagination against the current URL; do not duplicate context paths.
        const current: URL = requestUrl(cfg, next);
        const link = data._links?.next;
        next = link ? (link.startsWith('/') ? requestUrl(cfg, link) : trustedUrl(cfg, new URL(link, current).href)).href : undefined;
    }
    if (next) throw new Error('Confluence collection exceeds 10 pages.');
    return results;
}

export async function resolvePageId(
    cfg: ConfluenceConfig,
    token: string,
    body: { url?: string; pageId?: string },
): Promise<string> {
    if (body.pageId?.trim()) {
        if (!/^\d+$/.test(body.pageId.trim())) throw new Error('pageId phải là số.');
        return body.pageId.trim();
    }
    if (!body.url?.trim()) throw new Error('Thiếu url hoặc pageId.');
    const parsed = parseUrl(body.url);
    if (parsed.pageId && /^\d+$/.test(parsed.pageId)) return parsed.pageId;
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
// Chỉ tải ảnh từ origin Confluence đã cấu hình. Lỗi/không phải ảnh/quá lớn → null.
export async function fetchImageAsDataUrl(
    cfg: ConfluenceConfig,
    token: string,
    src: string,
): Promise<{ dataUrl: string | null; reason: string }> {
    try {
        const res = await cfFetch(cfg, token, src, MAX_IMAGE_BYTES);
        if (!res.ok) return { dataUrl: null, reason: `HTTP ${res.status} ${res.statusText}` };
        const media = (res.headers.get('content-type') || '').split(';')[0].trim();
        if (!media.startsWith('image/')) return { dataUrl: null, reason: `content-type="${media}" (not image)` };
        const buf = Buffer.from(await res.arrayBuffer());
        if (!buf.byteLength) return { dataUrl: null, reason: 'empty body' };
        if (buf.byteLength > MAX_IMAGE_BYTES) return { dataUrl: null, reason: `size ${(buf.byteLength / 1024 / 1024).toFixed(1)}MB > ${MAX_IMAGE_BYTES / 1024 / 1024}MB limit` };
        return { dataUrl: `data:${media};base64,${buf.toString('base64')}`, reason: 'ok' };
    } catch (e) {
        return { dataUrl: null, reason: e instanceof Error ? e.message : String(e) };
    }
}
