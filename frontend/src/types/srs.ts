// ============================================================
//  Kiểu dữ liệu đề cương đặc tả chức năng (SRS) — dùng CHUNG cho
//  server (app/api/srs/*) và client (modules/tools/*).
//
//  Hình dạng phản chiếu outline.json, vốn được SINH RA từ
//  `srs/tools/outline.py`. Đổi cấu trúc bên Python thì sửa ở đây.
// ============================================================

// 4 loại gốc + DANHMUC (biến thể rút gọn của UI, nhưng vẫn là giá trị
// hợp lệ ở dòng "Loại chức năng" của bảng Mô tả chung).
export const PROFILE_IDS = ['UI', 'TICHHOP', 'JOB', 'PHANTICH', 'DANHMUC'] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

// Một bảng trong đề cương. `widths` tính bằng twips, tổng luôn = `usable` (9355).
export interface OutlineTable {
    label?: string; // nhãn phụ khi 1 mục có nhiều bảng (vd "Luồng chính")
    headers: string[];
    widths: number[];
    rows: number; // số hàng gợi ý của mẫu rỗng — không phải ràng buộc
    labels?: string[]; // có = bảng key-value, cột đầu cố định
}

export interface OutlineSection {
    name: string;
    note?: string;
    noteMd?: string; // hướng dẫn riêng cho bản Confluence, ghi đè `note`
    diagram?: boolean; // mục chứa placeholder [[DIAGRAM: ...]]
    tables?: OutlineTable[];
}

export interface OutlineProfile {
    ten: string;
    requireDiagram: boolean;
    variantOf: ProfileId | null;
    before: OutlineSection[]; // 6 mục Heading 4 trước khối Tính năng
    features: OutlineSection[]; // mục Heading 5 trong MỖI khối Tính năng
    after: OutlineSection[]; // 3 mục Heading 4 sau khối Tính năng
}

export interface OutlineCodeRule {
    label: string;
    form: string;
    example: string;
    pattern: string; // regex, giữ cú pháp chung Python/JS
}

// Phần chung mọi phản hồi của /api/srs/outline đều kèm theo.
export interface OutlineCommon {
    schema: string;
    outlineVersion: string;
    sourceSha256: string;
    usable: number;
    baseProfiles: string[];
    title: string;
    featureTitle: string;
    featureNote: string;
    diagramMark: string;
    codeRules: Record<string, OutlineCodeRule>;
}

export interface Outline extends OutlineCommon {
    guidance: string[];
    profiles: Record<ProfileId, OutlineProfile>;
}

// GET /api/srs/outline?meta=1
export interface OutlineMeta extends OutlineCommon {
    profiles: {
        id: ProfileId;
        ten: string;
        requireDiagram: boolean;
        variantOf: ProfileId | null;
    }[];
}

// GET /api/srs/outline?profile=UI
export interface OutlineProfileResponse extends OutlineCommon {
    guidance: string[];
    profile: OutlineProfile & { id: ProfileId };
}
