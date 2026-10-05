// ============================================================
//  CIC Core System — Subsystem Domain Metadata & Accents
//  Single source of truth for business subsystem identity.
// ============================================================

export const SUBSYSTEM_COLORS = {
    kkn:        '#f59e0b', // Kênh kết nối       — Amber Gold
    collection: '#38bdf8', // Thu thập dữ liệu   — Sky Teal-Blue
    product:    '#2a765b', // Quản lý sản phẩm   — ReqHub Emerald / Forest
    ops:        '#8b5cf6', // Hỗ trợ vận hành    — Modern Iris/Violet
    analytics:  '#f43f5e', // Báo cáo thống kê   — Rose Coral
    governance: '#14b8a6', // Quản trị dữ liệu   — Deep Mint
    design:     '#7c3aed', // Design System      — Indigo
    portal:     '#0050b3', // Web Portal         — Navy Blue
    tools:      '#1f4e79', // Công cụ nội bộ      — CIC Navy
} as const;

export type SubSystemKey = keyof typeof SUBSYSTEM_COLORS;

// ─── Tools subsystem palette (internal tools) ─────────────
// Tông navy/blue nhận diện CIC, dùng trong subsystem `tools`.
export const TOOLS_COLORS = {
    primary:   '#1f4e79', // navy — header, heading
    secondary: '#2e75b6', // blue — accent, link
    light:     '#d6e4f0', // blue light — table header / meta cell
    xlight:    '#eef5fb', // blue xtra-light — row alternating
} as const;
