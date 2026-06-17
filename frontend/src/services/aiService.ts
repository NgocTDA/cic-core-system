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

// Kéo nội dung 1 trang Confluence (server giữ PAT) → markdown + ảnh.
export async function fetchConfluencePage(input: { url?: string; pageId?: string }): Promise<ConfluencePage> {
    const res = await fetch('/api/confluence/page', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? 'Không kéo được trang Confluence.');
    return data as ConfluencePage;
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
): Promise<{ blob: Blob; filename: string }> {
    const res = await fetch('/api/ai/docx', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ doc, image }),
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

// Tải file .docx về máy.
export async function downloadDocx(doc: DocData, image?: string): Promise<void> {
    const { blob, filename } = await fetchDocxBlob(doc, image);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
