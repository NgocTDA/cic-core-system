// ============================================================
//  Đề cương đặc tả chức năng (SERVER-ONLY) — hợp đồng với pipeline SRS.
//
//  outline.json được SINH RA từ `srs/tools/outline.py` bằng
//  `python tools/export_outline_json.py`. KHÔNG sửa file này bằng tay —
//  sửa outline.py rồi xuất lại, CI của repo srs sẽ chặn nếu hai bên lệch.
//
//  Khác với ai-providers.json / confluence.json (tùy chọn, chứa secret,
//  gitignored): outline.json BẮT BUỘC phải có, không chứa secret, và được
//  commit. Thiếu nó thì công cụ Chuẩn hóa tài liệu không chạy được — nên
//  loader ném lỗi rõ ràng thay vì trả null.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { PROFILE_IDS, type Outline, type OutlineProfile, type ProfileId } from '@/types/srs';

export const OUTLINE_SCHEMA = 'cic-srs-outline/1';

// Kiểu dữ liệu khai báo ở @/types/srs để client dùng chung — re-export cho tiện.
export * from '@/types/srs';

function outlinePath(): string {
    return process.env.SRS_OUTLINE_FILE
        ? path.resolve(process.env.SRS_OUTLINE_FILE)
        : path.join(process.cwd(), 'config', 'outline.json');
}

// Cache theo mtime: file ~55KB, parse lại mỗi request là lãng phí, nhưng vẫn
// phải nhận được thay đổi khi thay file lúc chạy (config mount vào Docker).
let cache: { path: string; mtimeMs: number; data: Outline } | null = null;

export function loadOutline(): Outline {
    const file = outlinePath();

    let stat: fs.Stats;
    try {
        stat = fs.statSync(file);
    } catch {
        throw new Error(
            `Không tìm thấy đề cương tại ${file}. ` +
                'Sinh bằng: python tools/export_outline_json.py (repo srs) rồi chép vào config/outline.json.',
        );
    }

    if (cache && cache.path === file && cache.mtimeMs === stat.mtimeMs) return cache.data;

    let data: Outline;
    try {
        data = JSON.parse(fs.readFileSync(file, 'utf-8')) as Outline;
    } catch {
        throw new Error(`File đề cương ${file} không phải JSON hợp lệ.`);
    }

    if (data?.schema !== OUTLINE_SCHEMA) {
        throw new Error(
            `Đề cương có schema "${data?.schema ?? '(thiếu)'}", cần "${OUTLINE_SCHEMA}". ` +
                'Xuất lại bằng phiên bản export_outline_json.py tương ứng.',
        );
    }

    // Bắt trường hợp pipeline thêm/đổi loại chức năng mà web chưa cập nhật:
    // thà lỗi rõ ràng còn hơn âm thầm bỏ sót một loại.
    const found = Object.keys(data.profiles ?? {});
    const missing = PROFILE_IDS.filter((p) => !found.includes(p));
    const extra = found.filter((p) => !PROFILE_IDS.includes(p as ProfileId));
    if (missing.length || extra.length) {
        throw new Error(
            'Danh sách loại chức năng trong outline.json không khớp với web' +
                (missing.length ? ` — thiếu: ${missing.join(', ')}` : '') +
                (extra.length ? ` — lạ: ${extra.join(', ')}` : '') +
                '. Cập nhật PROFILE_IDS trong outlineConfig.ts.',
        );
    }

    cache = { path: file, mtimeMs: stat.mtimeMs, data };
    return data;
}

export function getProfile(id: string): OutlineProfile | null {
    const outline = loadOutline();
    return (outline.profiles as Record<string, OutlineProfile>)[id] ?? null;
}

// Tên mọi mục Heading 4 dùng đúng một lần (không tính khối "Tính năng" lặp).
// Tương đương outline.h4_singleton(profile) bên Python.
export function h4Singleton(p: OutlineProfile): string[] {
    return [...p.before, ...p.after].map((s) => s.name);
}

// Tên các mục Heading 5 bắt buộc trong MỖI khối Tính năng.
export function h5Required(p: OutlineProfile): string[] {
    return p.features.map((s) => s.name);
}
