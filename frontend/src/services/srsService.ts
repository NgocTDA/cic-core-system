// ============================================================
//  srsService — CLIENT side
//  Gọi /api/srs/* . Đề cương không chứa secret nên trả thẳng cho client.
// ============================================================

import type { OutlineMeta, OutlineProfileResponse, ProfileId } from '@/types/srs';

async function getJson<T>(url: string, fallbackError: string): Promise<T> {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string })?.error ?? fallbackError);
    return data as T;
}

// Metadata + danh sách loại chức năng (nhẹ — không kèm cây mục).
export function fetchOutlineMeta(): Promise<OutlineMeta> {
    return getJson<OutlineMeta>('/api/srs/outline?meta=1', 'Không tải được đề cương.');
}

// Cây mục đầy đủ của MỘT loại chức năng.
export function fetchOutlineProfile(id: ProfileId): Promise<OutlineProfileResponse> {
    return getJson<OutlineProfileResponse>(
        `/api/srs/outline?profile=${encodeURIComponent(id)}`,
        `Không tải được đề cương loại ${id}.`,
    );
}
