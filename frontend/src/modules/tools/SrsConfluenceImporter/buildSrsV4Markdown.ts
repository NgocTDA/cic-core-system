// ============================================================
//  buildSrsV4Markdown — Chuyển SrsV4DocData -> Markdown v4.0
//  Chuẩn 100% theo CHILD_TEMPLATE_<PROFILE>.md trong srs-pipeline
// ============================================================

import type { SrsV4DocData } from '@/types/srsV4';

export function buildSrsV4Markdown(d: SrsV4DocData): string {
    const gen = d.general || ({} as any);
    const profile = d.profile || 'UI';
    const funcCode = gen.maChucNang || 'FUNC-xxx-001';
    const funcName = gen.tenChucNang || 'Tên chức năng';

    const lines: string[] = [];

    // Title H3
    lines.push(`> **Tiêu đề trang:** \`Chức năng [${funcCode}] «${funcName}»\``);
    lines.push('');
    lines.push('---');
    lines.push('');

    // ## Mô tả chung
    lines.push('## Mô tả chung');
    lines.push('');
    lines.push('| Hạng mục | Nội dung |');
    lines.push('|---|---|');
    lines.push(`| Loại chức năng | ${profile} |`);
    lines.push(`| Mã chức năng | ${funcCode} |`);
    lines.push(`| Tên chức năng | ${funcName} |`);
    lines.push(`| Nhóm chức năng | ${gen.nhomChucNang || ''} |`);
    lines.push(`| Mô tả chức năng | ${gen.moTa || ''} |`);
    lines.push(`| Tác nhân chính | ${gen.tacNhanChinh || ''} |`);
    lines.push(`| Tác nhân phụ | ${gen.tacNhanPhu || ''} |`);
    lines.push(`| Vị trí chức năng | ${gen.viTriChucNang || ''} |`);
    lines.push(`| Điều kiện tiên quyết | ${gen.dieuKienTienQuyet || ''} |`);
    lines.push(`| Hậu điều kiện | ${gen.hauDieuKien || ''} |`);
    lines.push(`| Chức năng tiền đề | ${gen.chucNangTienDe || ''} |`);
    lines.push(`| Chức năng kế tiếp | ${gen.chucNangKeTiep || ''} |`);
    lines.push(`| Chức năng dùng chung | ${gen.chucNangDungChung || ''} |`);
    lines.push(`| Yêu cầu đặc thù | ${gen.yeuCauDacThu || ''} |`);
    lines.push('');

    // ## Truy vết yêu cầu
    lines.push('## Truy vết yêu cầu');
    lines.push('');
    lines.push('| Mã UC | Tên UC | Tính năng đáp ứng | Vai trò | Mức đáp ứng | Ghi chú |');
    lines.push('|---|---|---|---|---|---|');
    if (d.traceability && d.traceability.length > 0) {
        d.traceability.forEach((t) => {
            lines.push(`| ${t.maUc} | ${t.tenUc} | ${t.tinhNangDapUng} | ${t.vaiTro} | ${t.mucDapUng} | ${t.ghiChu || ''} |`);
        });
    } else {
        lines.push('| | | | | | |');
    }
    lines.push('');

    // ## Ma trận phân quyền
    lines.push('## Ma trận phân quyền');
    lines.push('');
    lines.push('| STT | Mã tính năng | Tính năng / Thao tác | ROLE-QTHT | ROLE-CB | ROLE-KH | Phạm vi dữ liệu |');
    lines.push('|---|---|---|---|---|---|---|');
    if (d.permissions && d.permissions.length > 0) {
        d.permissions.forEach((p, idx) => {
            const r1 = p.roles?.['ROLE-QTHT'] || 'X';
            const r2 = p.roles?.['ROLE-CB'] || 'X';
            const r3 = p.roles?.['ROLE-KH'] || '';
            lines.push(`| ${idx + 1} | ${p.maFeat} | ${p.tinhNang} | ${r1} | ${r2} | ${r3} | ${p.phamVi || 'Toàn hệ thống'} |`);
        });
    } else {
        lines.push('| 1 | FEAT-01 | Quản lý chung | X | X | | Toàn hệ thống |');
    }
    lines.push('');

    // ## Luồng màn hình / Sơ đồ kiến trúc / Luồng dữ liệu
    const flowTitleMap: Record<string, string> = {
        UI: 'Luồng màn hình',
        TICHHOP: 'Sơ đồ kiến trúc tích hợp',
        JOB: 'Sơ đồ luồng dữ liệu',
        PHANTICH: 'Luồng màn hình',
        DANHMUC: 'Luồng màn hình',
    };
    lines.push(`## ${flowTitleMap[profile] || 'Luồng màn hình'}`);
    lines.push('');
    lines.push(d.overallFlow || 'Không áp dụng.');
    lines.push('');

    // ## Sơ đồ trạng thái
    lines.push('## Sơ đồ trạng thái');
    lines.push('');
    lines.push(d.stateDiagram || 'Không áp dụng.');
    lines.push('');

    // ## Luồng nghiệp vụ
    lines.push('## Luồng nghiệp vụ');
    lines.push('');
    lines.push(d.businessFlow || 'Không áp dụng.');
    lines.push('');

    // ## Quy tắc nghiệp vụ
    lines.push('## Quy tắc nghiệp vụ');
    lines.push('');
    lines.push('| Mã quy tắc | Nội dung quy tắc | Áp dụng cho | Mã thông báo khi vi phạm |');
    lines.push('|---|---|---|---|');
    if (d.businessRules && d.businessRules.length > 0) {
        d.businessRules.forEach((br) => {
            lines.push(`| ${br.maBr} | ${br.noiDung} | ${br.apDungCho} | ${br.maThongBao} |`);
        });
    } else {
        lines.push('| | | | |');
    }
    lines.push('');

    // Lặp từng khối Tính năng (FEAT-...)
    const features = d.features && d.features.length > 0 ? d.features : [];
    features.forEach((feat) => {
        lines.push(`## Tính năng [${feat.maFeat}] «${feat.tenFeat}»`);
        lines.push('');

        lines.push('### Mô tả yêu cầu');
        lines.push('');
        lines.push(feat.moTaYeuCau || 'Không có mô tả chi tiết.');
        lines.push('');

        lines.push('### Luồng xử lý');
        lines.push('');
        lines.push('**Luồng chính**');
        lines.push('');
        lines.push('| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |');
        lines.push('|---|---|---|---|');
        if (feat.luongChinh && feat.luongChinh.length > 0) {
            feat.luongChinh.forEach((lc) => {
                lines.push(`| ${lc.step} | ${lc.actor} | ${lc.action} | ${lc.result} |`);
            });
        } else {
            lines.push('| 1 | Người dùng | Yêu cầu thực hiện | Hệ thống phản hồi |');
        }
        lines.push('');

        lines.push('**Luồng thay thế**');
        lines.push('');
        lines.push('| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |');
        lines.push('|---|---|---|---|');
        if (feat.luongThayThe && feat.luongThayThe.length > 0) {
            feat.luongThayThe.forEach((lt) => {
                lines.push(`| ${lt.maLuong} | ${lt.dieuKien} | ${lt.xuLy} | ${lt.quayVeStep} |`);
            });
        } else {
            lines.push('| ALT_01 | Không đạt điều kiện | Hệ thống báo lỗi | Bước 1 |');
        }
        lines.push('');

        lines.push('**Luồng ngoại lệ**');
        lines.push('');
        lines.push('| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |');
        lines.push('|---|---|---|---|');
        if (feat.luongNgoaiLe && feat.luongNgoaiLe.length > 0) {
            feat.luongNgoaiLe.forEach((le) => {
                lines.push(`| ${le.maLuong} | ${le.tinhHuong} | ${le.xuLy} | ${le.maThongBao} |`);
            });
        } else {
            lines.push('| EXC_01 | Lỗi kết nối hệ thống | Hiển thị thông báo lỗi | ERR_014 |');
        }
        lines.push('');

        lines.push('### Thiết kế giao diện');
        lines.push('');
        lines.push(feat.thietKeGiaoDien || `![Mockup ${feat.maFeat}](FEAT_${feat.maFeat}_mockup.png)`);
        lines.push('');

        lines.push('### Mô tả các thành phần trên giao diện');
        lines.push('');
        lines.push('| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |');
        lines.push('|---|---|---|---|---|---|');
        if (feat.thanhPhanGiaoDien && feat.thanhPhanGiaoDien.length > 0) {
            feat.thanhPhanGiaoDien.forEach((tp, i) => {
                lines.push(`| ${i + 1} | ${tp.name} | ${tp.type} | ${tp.required} | ${tp.limit || ''} | ${tp.validation || ''} |`);
            });
        } else {
            lines.push('| 1 | Tên trường | InputText | Có | Max 100 char | Nhập đúng định dạng |');
        }
        lines.push('');

        lines.push('### Xử lý sự kiện và thao tác');
        lines.push('');
        lines.push('| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |');
        lines.push('|---|---|---|---|---|');
        if (feat.suKienThaoTac && feat.suKienThaoTac.length > 0) {
            feat.suKienThaoTac.forEach((sk, i) => {
                lines.push(`| ${i + 1} | ${sk.event} | ${sk.condition || ''} | ${sk.processing} | ${sk.resultMsg || ''} |`);
            });
        } else {
            lines.push('| 1 | Click Nút Lưu | Form hợp lệ | Lưu dữ liệu vào CSDL | SUC_001 |');
        }
        lines.push('');

        lines.push('### Thông báo');
        lines.push('');
        lines.push('| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |');
        lines.push('|---|---|---|---|---|');
        if (feat.thongBao && feat.thongBao.length > 0) {
            feat.thongBao.forEach((tb, i) => {
                lines.push(`| ${i + 1} | ${tb.maThongBao} | ${tb.loai} | ${tb.noiDung} | ${tb.dieuKien} |`);
            });
        } else {
            lines.push('| 1 | ERR_014 | ERR | Xảy ra lỗi hệ thống | Không kết nối được CSDL |');
        }
        lines.push('');

        lines.push('### Tiêu chí chấp nhận');
        lines.push('');
        lines.push('| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |');
        lines.push('|---|---|---|');
        if (feat.tieuChiChapNhan && feat.tieuChiChapNhan.length > 0) {
            feat.tieuChiChapNhan.forEach((tc, i) => {
                lines.push(`| ${i + 1} | ${tc.tieuChi} | ${tc.maBr || ''} |`);
            });
        } else {
            lines.push('| 1 | Khi nhập đủ thông tin bắt buộc thì hệ thống phải lưu thành công | BR-QLSP-047-001 |');
        }
        lines.push('');
    });

    // ## Dữ liệu và tích hợp
    lines.push('## Dữ liệu và tích hợp');
    lines.push('');
    lines.push(d.dataAndIntegration || 'Không áp dụng.');
    lines.push('');

    // ## Phân loại dữ liệu
    lines.push('## Phân loại dữ liệu');
    lines.push('');
    lines.push('| STT | Trường / Nhóm dữ liệu | Phân loại | Quy tắc che | Ghi nhật ký | Thời hạn lưu |');
    lines.push('|---|---|---|---|---|---|');
    if (d.dataClassification && d.dataClassification.length > 0) {
        d.dataClassification.forEach((dc, i) => {
            lines.push(`| ${i + 1} | ${dc.truongDuLieu} | ${dc.phanLoai} | ${dc.quyTacChe} | ${dc.ghiNhatKy} | ${dc.thoiHanLuu} |`);
        });
    } else {
        lines.push('| 1 | Thông tin cá nhân | Định danh cá nhân | Che 6 số giữa | Có | 5 năm |');
    }
    lines.push('');

    // ## Vấn đề còn mở
    lines.push('## Vấn đề còn mở');
    lines.push('');
    lines.push('| # | Chủ đề | Nội dung |');
    lines.push('|---|---|---|');
    if (d.openQuestions && d.openQuestions.length > 0) {
        d.openQuestions.forEach((oq, i) => {
            lines.push(`| ${i + 1} | ${oq.topic} | ${oq.content} |`);
        });
    } else {
        lines.push('| 1 | Không áp dụng | Chưa có câu hỏi mở |');
    }
    lines.push('');

    // ## Lịch sử thay đổi
    lines.push('## Lịch sử thay đổi');
    lines.push('');
    lines.push('> Mục này do script build tự đổ từ Git log.');

    return lines.join('\n');
}
