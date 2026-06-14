// ============================================================
//  buildConfluence — sinh Confluence Wiki Markup từ DocData.
//  Pure function (port nguyên từ bản gốc, thêm types).
// ============================================================

import type { DocData } from './types';

export function buildConfluence(d: DocData): string {
    const today = new Date().toLocaleDateString('vi-VN');
    const code = d.screenCode || 'SCR-???';
    const mod = d.module || '';
    const esc = (v: unknown) => String(v ?? '').replace(/\|/g, '\\|');
    const row = <T extends object>(obj: T, cols: (keyof T)[]) =>
        '| ' + cols.map((c) => esc(obj[c])).join(' | ') + ' |';

    return [
        `h1. ${d.funcName}`,
        `{info:title=Thong tin tai lieu}`,
        `*Ma:* ${code} | *Module:* ${mod} | *Ngay:* ${today} | *Trang thai:* Draft`,
        `{info}`,
        `----`,
        `h2. 1. Thong tin chung`,
        `h3. 1.1. Muc dich`,
        d.purpose || '',
        `h3. 1.2. Pham vi ap dung`,
        ...(d.scope || []).map((s) => `* ${s}`),
        `----`,
        `h2. 2. ${d.funcName}`,
        `h3. 2.1. Tong quan man hinh`,
        `|| Thuoc tinh || Gia tri ||`,
        `| Ten man hinh | ${esc(d.funcName)} |`,
        `| Ma man hinh | ${code} |`,
        `| Module | ${mod} |`,
        `| Loai man hinh | ${esc(d.screenType)} |`,
        `| Quyen truy cap | ${esc(d.accessRoles)} |`,
        `| Man hinh cha | ${esc(d.parentScreen) || '—'} |`,
        `| Man hinh con | ${esc(d.childScreens) || '—'} |`,
        `h3. 2.2. Mockup / Wireframe`,
        `{note:title=Huong dan}Chen anh bang lenh !ten-file.png!{note}`,
        `h3. 2.3. Danh sach thanh phan UI`,
        `|| STT || Ten thanh phan || Loai || Bat buoc || Mo ta / Gia tri || Validation ||`,
        ...(d.components || []).map((c) =>
            row(c, ['stt', 'name', 'type', 'required', 'desc', 'validation']),
        ),
        `{note}Cot Bat buoc = Co: truong bat loi khi submit.{note}`,
        `h3. 2.4. Luong xu ly chinh`,
        `|| Buoc || Nguoi thuc hien || Hanh dong || Ket qua / Ghi chu ||`,
        ...(d.flow || []).map((f) => row(f, ['step', 'actor', 'action', 'result'])),
        `h3. 2.5. Xu ly loi va thong bao`,
        `|| Tinh huong loi || Thong bao hien thi || Hanh dong he thong ||`,
        ...(d.errors || []).map((e) => row(e, ['situation', 'message', 'action'])),
        `h3. 2.6. Dieu kien nghiep vu dac biet`,
        ...(d.businessRules || []).map((r) => `* ${r}`),
        `h3. 2.7. Cau hoi mo / Ghi chu`,
        `|| # || Chu de || Noi dung || Nguoi hoi || Trang thai ||`,
        ...(d.openQuestions || []).map(
            (q, i) => `| ${i + 1} | ${esc(q.topic)} | ${esc(q.content)} | BA | Dang mo |`,
        ),
        `----`,
        `_Sinh tu dong boi CIC UI Doc Generator - ${today}_`,
    ].join('\n');
}
