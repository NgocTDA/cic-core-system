// ============================================================
//  registryService — Client Service tương tác với Sổ đăng ký SRS
// ============================================================

export type RegistryKey =
    | 'manifest'
    | 'groups'
    | 'usecases'
    | 'messages'
    | 'states'
    | 'roles'
    | 'participants'
    | 'objects';

export interface MatchResult {
    phanHe?: string;
    maChucNang?: string;
    tenChucNang?: string;
    nhomChucNang?: string;
    useCases?: string[];
}

export async function fetchRegistryItems<T = Record<string, string>>(
    registry: RegistryKey,
    query?: string,
): Promise<T[]> {
    try {
        const q = query ? `&q=${encodeURIComponent(query)}` : '';
        const res = await fetch(`/api/srs/registries?registry=${registry}${q}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.items as T[]) || [];
    } catch {
        return [];
    }
}

export async function saveRegistryItems(
    registry: RegistryKey,
    items: Record<string, string>[],
): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch('/api/srs/registries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ registry, items }),
    });
    return res.json();
}

/**
 * Hàm tìm kiếm & gợi ý mã thông minh từ Tiêu đề trang Confluence (Page Title)
 * Đọc từ manifest.csv & groups.csv & usecases.csv
 */
export async function matchPageTitleToCodes(pageTitle: string): Promise<MatchResult> {
    const titleClean = pageTitle.trim().toLowerCase();
    if (!titleClean) return {};

    const [manifests, groups] = await Promise.all([
        fetchRegistryItems<{ ma_chuc_nang: string; ten_chuc_nang: string; phan_he: string; nhom: string }>('manifest'),
        fetchRegistryItems<{ ma: string; ten_nhom: string; phan_he: string }>('groups'),
    ]);

    // 1. Thử tìm exact / fuzzy match trong manifest.csv
    const manifestMatch = manifests.find(
        (m) =>
            m.ten_chuc_nang &&
            (titleClean.includes(m.ten_chuc_nang.toLowerCase()) ||
                m.ten_chuc_nang.toLowerCase().includes(titleClean)),
    );

    if (manifestMatch) {
        return {
            phanHe: manifestMatch.phan_he,
            maChucNang: manifestMatch.ma_chuc_nang,
            tenChucNang: manifestMatch.ten_chuc_nang,
            nhomChucNang: manifestMatch.nhom,
        };
    }

    // 2. Nếu không khớp manifest, thử đoán Phân hệ từ tiêu đề hoặc mã mặc định
    let phanHe = 'QLSP';
    if (titleClean.includes('kênh') || titleClean.includes('kết nối')) phanHe = 'KENH';
    else if (titleClean.includes('xử lý') || titleClean.includes('thu thập')) phanHe = 'XLDL';
    else if (titleClean.includes('hỗ trợ') || titleClean.includes('vận hành') || titleClean.includes('người dùng')) phanHe = 'HTVH';
    else if (titleClean.includes('báo cáo') || titleClean.includes('thống kê')) phanHe = 'BCTK';
    else if (titleClean.includes('quản trị') || titleClean.includes('dữ liệu')) phanHe = 'QTDL';

    // Tìm nhóm thuộc phân hệ
    const groupMatch = groups.find((g) => g.phan_he === phanHe);
    const nhomChucNang = groupMatch ? groupMatch.ma : `GRP-${phanHe}-01`;

    // Sinh mã gợi ý mặc định
    const maChucNang = `FUNC-${phanHe}-001`;

    return {
        phanHe,
        maChucNang,
        tenChucNang: pageTitle,
        nhomChucNang,
    };
}
