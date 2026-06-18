// ============================================================
//  aiService — CLIENT side
//  Gọi proxy /api/ai/generate (server giữ key + dựng prompt + parse JSON).
//  FE chỉ gửi dữ liệu màn hình thô, nhận về DocData đã parse.
// ============================================================

import type { DocData, DocInput, ProviderInfo } from '@/modules/tools/UIDocGenerator/types';

// Lấy danh sách provider từ server (chỉ id/label/type — không có key).
export async function fetchProviders(): Promise<ProviderInfo[]> {
    const res = await fetch('/api/ai/providers');
    if (!res.ok) throw new Error('Không tải được danh sách provider.');
    return (await res.json()).providers as ProviderInfo[];
}

// Lấy nhãn nhận diện system prompt đang dùng (dòng @label). kind: 'srs' | 'confluence'.
export async function fetchPromptLabel(kind: 'srs' | 'confluence' = 'srs'): Promise<string | null> {
    try {
        const res = await fetch(`/api/ai/prompt?kind=${kind}`);
        if (!res.ok) return null;
        return ((await res.json()).label as string | null) ?? null;
    } catch {
        return null;
    }
}

// Gửi dữ liệu màn hình → backend dựng prompt, gọi AI, parse JSON → trả DocData.
export async function generateDoc(input: DocInput, providerId: string): Promise<DocData> {
    const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            providerId,
            screen: {
                funcName: input.funcName,
                screenCode: input.screenCode,
                module: input.module,
                description: input.funcDesc,
            },
            images: input.images.map((img) => ({ dataUrl: img.dataUrl })),
        }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? 'Yêu cầu AI thất bại.');
    return data.doc as DocData;
}

// ─── Confluence ──────────────────────────────────────────────
export interface ConfluencePage {
    pageId: string;
    title: string;
    markdown: string;
    images: { name: string; dataUrl: string }[];
}

// Kéo nội dung 1 trang Confluence. token = PAT của người dùng (localStorage), ghi đè PAT mặc định server.
export async function fetchConfluencePage(
    input: { url?: string; pageId?: string },
    token?: string,
): Promise<ConfluencePage> {
    const res = await fetch('/api/confluence/page', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...input, token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? 'Không kéo được trang Confluence.');
    return data as ConfluencePage;
}

// Kiểm tra PAT + lấy fullname (displayName) của người dùng.
export async function validateConfluencePat(
    token: string,
): Promise<{ valid: boolean; fullname?: string; username?: string; error?: string }> {
    const res = await fetch('/api/confluence/validate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
    });
    return res.json();
}

// Chuyển 1 trang Confluence → Word TRUNG THỰC (không qua AI). Trả blob .docx + tên file + tiêu đề.
export async function fetchConfluenceDocx(
    input: { url?: string; pageId?: string },
    token?: string,
): Promise<{ blob: Blob; filename: string; title?: string }> {
    const res = await fetch('/api/confluence/docx', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...input, token }),
    });
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? 'Không chuyển được trang Confluence sang Word.');
    }
    const blob = await res.blob();
    const cd = res.headers.get('Content-Disposition') ?? '';
    const m = /filename="([^"]+)"/.exec(cd);
    const titleHeader = res.headers.get('X-Doc-Title');
    const title = titleHeader ? decodeURIComponent(titleHeader) : undefined;
    return { blob, filename: m ? m[1] : 'confluence.docx', title };
}

// Sinh DocData từ nội dung nguồn (markdown) + ảnh — dùng cho Confluence Importer.
export async function generateDocFromSource(
    source: string,
    images: { dataUrl: string }[],
    providerId: string,
): Promise<DocData> {
    const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ providerId, source, images: images.map((i) => ({ dataUrl: i.dataUrl })) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? 'Yêu cầu AI thất bại.');
    return data.doc as DocData;
}

// Gọi backend render .docx từ template Word → trả về { blob, filename }.
export async function fetchDocxBlob(
    doc: DocData,
    image?: string,
    author?: string,
): Promise<{ blob: Blob; filename: string }> {
    const res = await fetch('/api/ai/docx', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ doc, image, author }),
    });
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? 'Tạo file .docx thất bại.');
    }
    const blob = await res.blob();
    const cd = res.headers.get('Content-Disposition') ?? '';
    const m = /filename="([^"]+)"/.exec(cd);
    return { blob, filename: m ? m[1] : 'tai-lieu.docx' };
}

// Tải file .docx về máy. author → fill [Tên BA].
export async function downloadDocx(doc: DocData, image?: string, author?: string): Promise<void> {
    const { blob, filename } = await fetchDocxBlob(doc, image, author);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
