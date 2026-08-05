// ============================================================
//  Render .docx cho SRS v4.0 (SERVER-ONLY)
//  Tạo file Word (.docx) chuẩn theo thiết kế đẹp 100% khớp template gốc CIC v4.0 (outline.py).
//  Định dạng chuẩn ISO A4 (Lề 2.5cm/2.5cm/2.0cm/2.0cm), Bảng TableStyle3 xanh navy CIC (#0050B3),
//  bảo toàn nét & tỷ lệ khung hình ảnh gốc, bóc tách sạch cú pháp Markdown ảnh & chống duplicate ảnh.
// ============================================================

import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    HeadingLevel,
    WidthType,
    AlignmentType,
    BorderStyle,
    ImageRun,
} from 'docx';
import type { SrsV4DocData } from '@/types/srsV4';

const FONT_FAMILY = 'Times New Roman';
const PRIMARY_COLOR = '0050B3'; // CIC Navy Blue
const HEADER_BG = '0050B3'; // Header table background
const ALT_ROW_BG = 'F9FBFD'; // Row xen kẽ
const TEXT_COLOR = '262626'; // Dark charcoal text
const MAX_DOCX_WIDTH = 480; // ~16.5cm vừa khít lề A4 CIC

type HeadingLevelValue = (typeof HeadingLevel)[keyof typeof HeadingLevel];

export interface ImageAttachment {
    name?: string;
    dataUrl: string;
}

/**
 * Đọc kích thước gốc (Pixel Width & Height) từ Buffer ảnh PNG/JPEG
 */
function getImageDimensions(buf: Buffer): { width: number; height: number } {
    try {
        if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
            const width = buf.readUInt32BE(16);
            const height = buf.readUInt32BE(20);
            if (width > 0 && height > 0) return { width, height };
        }
        if (buf.length >= 10 && buf[0] === 0xff && buf[1] === 0xd8) {
            let i = 2;
            while (i < buf.length - 8) {
                if (buf[i] === 0xff) {
                    const marker = buf[i + 1];
                    if (marker >= 0xc0 && marker <= 0xc3) {
                        const height = buf.readUInt16BE(i + 5);
                        const width = buf.readUInt16BE(i + 7);
                        if (width > 0 && height > 0) return { width, height };
                    }
                    const len = buf.readUInt16BE(i + 2);
                    i += 2 + len;
                } else {
                    i++;
                }
            }
        }
    } catch {
        // Fallback
    }
    return { width: 800, height: 450 };
}

/**
 * Tạo Paragraph chứa ảnh giữ chuẩn tỷ lệ khung hình & nét gốc
 */
function createImageParagraph(dataUrl: string, caption?: string): Paragraph[] {
    if (!dataUrl || !dataUrl.includes('base64,')) return [];
    try {
        const base64Str = dataUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, '').trim();
        const buf = Buffer.from(base64Str, 'base64');
        if (buf.length < 50) return [];

        const dim = getImageDimensions(buf);
        let renderWidth = dim.width;
        let renderHeight = dim.height;

        if (renderWidth > MAX_DOCX_WIDTH) {
            renderHeight = Math.round((renderHeight * MAX_DOCX_WIDTH) / renderWidth);
            renderWidth = MAX_DOCX_WIDTH;
        }

        const result: Paragraph[] = [
            new Paragraph({
                spacing: { before: 180, after: 100 },
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        data: buf,
                        transformation: {
                            width: renderWidth,
                            height: renderHeight,
                        },
                        type: 'png',
                    }),
                ],
            }),
        ];

        if (caption) {
            result.push(
                new Paragraph({
                    spacing: { after: 180 },
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: caption,
                            italics: true,
                            font: FONT_FAMILY,
                            size: 20, // 10pt
                            color: '595959',
                        }),
                    ],
                }),
            );
        }

        return result;
    } catch {
        return [];
    }
}

function createHeaderCell(text: string, widthTwips: number): TableCell {
    return new TableCell({
        width: { size: widthTwips, type: WidthType.DXA },
        shading: { fill: HEADER_BG },
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 12, color: '003B80' },
            left: { style: BorderStyle.SINGLE, size: 4, color: '0050B3' },
            right: { style: BorderStyle.SINGLE, size: 4, color: '0050B3' },
        },
        children: [
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({
                        text: text ?? '',
                        bold: true,
                        font: FONT_FAMILY,
                        size: 21, // 10.5pt
                        color: 'FFFFFF', // Chữ trắng trên nền Navy Blue
                    }),
                ],
            }),
        ],
    });
}

function createBodyCell(text: string, widthTwips: number, isBold = false, isAltRow = false): TableCell {
    return new TableCell({
        width: { size: widthTwips, type: WidthType.DXA },
        shading: isAltRow ? { fill: ALT_ROW_BG } : undefined,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9' },
            left: { style: BorderStyle.SINGLE, size: 4, color: 'E8E8E8' },
            right: { style: BorderStyle.SINGLE, size: 4, color: 'E8E8E8' },
        },
        children: [
            new Paragraph({
                children: [
                    new TextRun({
                        text: text ?? '',
                        bold: isBold,
                        font: FONT_FAMILY,
                        size: 21, // 10.5pt
                        color: TEXT_COLOR,
                    }),
                ],
            }),
        ],
    });
}

function createStyledTable(
    headers: string[],
    widths: number[],
    rowsData: string[][],
): Table {
    const headerRow = new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: headers.map((h, i) => createHeaderCell(h, widths[i])),
    });

    const dataRows = rowsData.map((rowCells, rIdx) => {
        const isAlt = rIdx % 2 === 1;
        return new TableRow({
            cantSplit: true,
            children: rowCells.map((cellText, cIdx) => createBodyCell(cellText, widths[cIdx], cIdx === 0 && rowCells.length <= 2, isAlt)),
        });
    });

    return new Table({
        width: { size: 9355, type: WidthType.DXA },
        alignment: AlignmentType.CENTER,
        rows: [headerRow, ...dataRows],
    });
}

function createHeading(text: string, level: HeadingLevelValue): Paragraph {
    const isH3 = level === HeadingLevel.HEADING_3;
    const isH4 = level === HeadingLevel.HEADING_4;
    const isH5 = level === HeadingLevel.HEADING_5;

    return new Paragraph({
        heading: level,
        spacing: { before: isH3 ? 300 : isH4 ? 240 : 180, after: isH5 ? 80 : 120 },
        children: [
            new TextRun({
                text: text ?? '',
                bold: true,
                italics: isH4 || isH5,
                font: FONT_FAMILY,
                size: isH3 ? 28 : isH4 ? 26 : 24, // 14pt / 13pt / 12pt
                color: isH3 || isH4 ? PRIMARY_COLOR : '262626',
            }),
        ],
    });
}

function createPara(text: string, isItalic = false, isBold = false): Paragraph {
    return new Paragraph({
        spacing: { after: 120, line: 276 }, // 1.15 line spacing
        children: [
            new TextRun({
                text: text ?? '',
                italics: isItalic,
                bold: isBold,
                font: FONT_FAMILY,
                size: 24, // 12pt
                color: TEXT_COLOR,
            }),
        ],
    });
}

function createNote(text: string): Paragraph {
    return new Paragraph({
        spacing: { after: 120 },
        children: [
            new TextRun({
                text: text ?? '',
                italics: true,
                font: FONT_FAMILY,
                size: 21, // 10.5pt
                color: '595959',
            }),
        ],
    });
}

/**
 * Render chuỗi văn bản chứa cú pháp Markdown ảnh ![alt](filename.png),
 * tự động loại bỏ cú pháp thô ![...](...) và chèn ảnh thực tế ngay tại vị trí đó.
 * Sử dụng usedImagesSet để KHÔNG BAO GIỜ bị duplicate ảnh.
 */
function renderTextWithImages(
    rawText: string,
    images: ImageAttachment[],
    defaultCaption: string,
    usedImagesSet: Set<string>,
): Paragraph[] {
    if (!rawText) return [createPara('')];

    const result: Paragraph[] = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(rawText)) !== null) {
        const textBefore = rawText.slice(lastIndex, match.index).trim();
        if (textBefore) {
            result.push(createPara(textBefore));
        }

        const altText = match[1]?.trim() || '';
        const imgRef = match[2]?.trim() || '';

        // Tìm ảnh trong danh sách images
        const matchedImg = images.find((img) => {
            if (!img.name) return false;
            const cleanName = img.name.replace(/[^\w.-]/g, '_').toLowerCase();
            const refClean = imgRef.replace(/[^\w.-]/g, '_').toLowerCase();
            const refBase = refClean.replace(/\.[^.]+$/, '');
            return cleanName.includes(refBase) || refClean.includes(cleanName);
        });

        if (matchedImg && matchedImg.name && !usedImagesSet.has(matchedImg.name)) {
            usedImagesSet.add(matchedImg.name);
            const caption = altText && !altText.startsWith('image-') ? `Hình: ${altText}` : `Hình: ${matchedImg.name}`;
            const imgParas = createImageParagraph(matchedImg.dataUrl, caption);
            result.push(...imgParas);
        } else if (imgRef.startsWith('data:image')) {
            const imgParas = createImageParagraph(imgRef, altText ? `Hình: ${altText}` : `Hình: ${defaultCaption}`);
            result.push(...imgParas);
        }

        lastIndex = imageRegex.lastIndex;
    }

    const textAfter = rawText.slice(lastIndex).trim();
    if (textAfter) {
        result.push(createPara(textAfter));
    }

    if (result.length === 0) {
        result.push(createPara(rawText));
    }

    return result;
}

export async function renderSrsV4Docx(
    doc: SrsV4DocData,
    author?: string,
    images: ImageAttachment[] = [],
): Promise<Buffer> {
    const gen = doc.general || ({} as any);
    const profile = doc.profile || 'UI';
    const funcCode = gen.maChucNang || 'FUNC-001';
    const funcName = gen.tenChucNang || 'Tên chức năng';

    // Tập hợp theo dõi các ảnh đã chèn để CHỐNG DUPLICATE 100%
    const usedImagesSet = new Set<string>();

    const children: (Paragraph | Table)[] = [];

    // Title H3 (Word Heading 3)
    children.push(createHeading(`Chức năng [${funcCode}] «${funcName}»`, HeadingLevel.HEADING_3));
    children.push(createPara(`Đặc tả chức năng chuẩn SRS v4.0 · Loại: ${profile} · Tác giả: ${author || 'Cán bộ BA'} · Ngày: ${new Date().toLocaleDateString('vi-VN')}`, true));

    // ## Mô tả chung (Heading 4)
    children.push(createHeading('Mô tả chung', HeadingLevel.HEADING_4));
    children.push(createNote(`Loại chức năng: điền đúng một trong UI / TICHHOP / JOB / PHANTICH / DANHMUC. Nhóm chức năng: mã từ groups.csv.`));
    
    const genRows = [
        ['Loại chức năng', profile],
        ['Mã chức năng', funcCode],
        ['Tên chức năng', funcName],
        ['Nhóm chức năng', gen.nhomChucNang || ''],
        ['Mô tả chức năng', gen.moTa || ''],
        ['Tác nhân chính', gen.tacNhanChinh || ''],
        ['Tác nhân phụ', gen.tacNhanPhu || ''],
        ['Vị trí chức năng', gen.viTriChucNang || ''],
        ['Điều kiện tiên quyết', gen.dieuKienTienQuyet || ''],
        ['Hậu điều kiện', gen.hauDieuKien || ''],
        ['Chức năng tiền đề', gen.chucNangTienDe || ''],
        ['Chức năng kế tiếp', gen.chucNangKeTiep || ''],
        ['Chức năng dùng chung', gen.chucNangDungChung || ''],
        ['Yêu cầu đặc thù', gen.yeuCauDacThu || ''],
    ];

    children.push(createStyledTable(['Hạng mục', 'Nội dung'], [2400, 6955], genRows));

    // ## Truy vết yêu cầu (Heading 4)
    children.push(createHeading('Truy vết yêu cầu', HeadingLevel.HEADING_4));
    children.push(createNote('Mỗi UC phải có ĐÚNG MỘT chức năng khai vai trò “Chính”; các chức năng khác chỉ khai “Dùng chung” và không đặc tả lại.'));
    
    const traceItems = doc.traceability && doc.traceability.length > 0 ? doc.traceability : [];
    const traceRows = traceItems.length > 0
        ? traceItems.map((t) => [t.maUc, t.tenUc, t.tinhNangDapUng, t.vaiTro, t.mucDapUng, t.ghiChu || ''])
        : [['—', '—', '—', '—', '—', '—']];
    children.push(createStyledTable(['Mã UC', 'Tên UC', 'Tính năng đáp ứng', 'Vai trò', 'Mức đáp ứng', 'Ghi chú'], [1100, 2600, 2000, 1200, 1200, 1255], traceRows));

    // ## Ma trận phân quyền (Heading 4)
    children.push(createHeading('Ma trận phân quyền', HeadingLevel.HEADING_4));
    children.push(createNote('Mã vai trò lấy từ roles.csv, không đặt tên tự do. Ô đánh “X” = được phép.'));
    
    const permItems = doc.permissions && doc.permissions.length > 0 ? doc.permissions : [];
    const permRows = permItems.length > 0
        ? permItems.map((p, idx) => [
              String(idx + 1),
              p.maFeat,
              p.tinhNang,
              p.roles?.['ROLE-QTHT'] || 'X',
              p.roles?.['ROLE-CB'] || 'X',
              p.roles?.['ROLE-KH'] || '',
              p.phamVi || 'Toàn hệ thống',
          ])
        : [['1', 'FEAT-01', 'Quản lý chung', 'X', 'X', '', 'Toàn hệ thống']];
    children.push(createStyledTable(['STT', 'Mã tính năng', 'Tính năng / Thao tác', 'ROLE-QTHT', 'ROLE-CB', 'ROLE-KH', 'Phạm vi dữ liệu'], [500, 1900, 2400, 800, 800, 800, 2155], permRows));

    // ## Luồng màn hình / Sơ đồ kiến trúc (Heading 4)
    const flowTitleMap: Record<string, string> = {
        UI: 'Luồng màn hình',
        TICHHOP: 'Sơ đồ kiến trúc tích hợp',
        JOB: 'Sơ đồ luồng dữ liệu',
        PHANTICH: 'Luồng màn hình',
        DANHMUC: 'Luồng màn hình',
    };
    const currentFlowTitle = flowTitleMap[profile] || 'Luồng màn hình';
    children.push(createHeading(currentFlowTitle, HeadingLevel.HEADING_4));
    children.push(...renderTextWithImages(doc.overallFlow || `[[DIAGRAM: ${funcCode}_seq-01]]`, images, currentFlowTitle, usedImagesSet));

    // ## Sơ đồ trạng thái (Heading 4)
    children.push(createHeading('Sơ đồ trạng thái', HeadingLevel.HEADING_4));
    children.push(...renderTextWithImages(doc.stateDiagram || 'Không áp dụng.', images, 'Sơ đồ trạng thái', usedImagesSet));

    // ## Luồng nghiệp vụ (Heading 4)
    children.push(createHeading('Luồng nghiệp vụ', HeadingLevel.HEADING_4));
    children.push(...renderTextWithImages(doc.businessFlow || 'Không áp dụng.', images, 'Luồng nghiệp vụ', usedImagesSet));

    // ## Quy tắc nghiệp vụ (Heading 4)
    children.push(createHeading('Quy tắc nghiệp vụ', HeadingLevel.HEADING_4));
    children.push(createNote('Mã theo dạng BR-«phân hệ»-«số chức năng»-«3 số», ví dụ BR-QLSP-047-001.'));
    
    const brItems = doc.businessRules && doc.businessRules.length > 0 ? doc.businessRules : [];
    const brRows = brItems.length > 0
        ? brItems.map((br) => [br.maBr, br.noiDung, br.apDungCho, br.maThongBao])
        : [['—', '—', '—', '—']];
    children.push(createStyledTable(['Mã quy tắc', 'Nội dung quy tắc', 'Áp dụng cho', 'Mã thông báo khi vi phạm'], [2200, 3355, 1900, 1900], brRows));

    // Lặp từng Khối Tính năng FEAT (Heading 4: Tính năng [MÃ] «Tên»)
    const features = doc.features && doc.features.length > 0 ? doc.features : [];
    features.forEach((feat, featIdx) => {
        children.push(createHeading(`Tính năng [${feat.maFeat}] «${feat.tenFeat}»`, HeadingLevel.HEADING_4));

        // ### Mô tả yêu cầu (Heading 5)
        children.push(createHeading('Mô tả yêu cầu', HeadingLevel.HEADING_5));
        children.push(createPara(feat.moTaYeuCau || 'Không có mô tả chi tiết.'));

        // ### Luồng xử lý (Heading 5)
        children.push(createHeading('Luồng xử lý', HeadingLevel.HEADING_5));

        // Luồng chính
        children.push(createPara('Luồng chính', false, true));
        const mainFlow = feat.luongChinh && feat.luongChinh.length > 0 ? feat.luongChinh : [];
        const mainRows = mainFlow.length > 0
            ? mainFlow.map((lc) => [String(lc.step), lc.actor, lc.action, lc.result])
            : [['1', 'User', 'Thực hiện', 'Thành công']];
        children.push(createStyledTable(['Bước', 'Tác nhân', 'Hành động', 'Phản hồi của hệ thống'], [700, 1800, 3400, 3455], mainRows));

        // Luồng thay thế
        children.push(createPara('Luồng thay thế', false, true));
        const altFlow = feat.luongThayThe && feat.luongThayThe.length > 0 ? feat.luongThayThe : [];
        const altRows = altFlow.length > 0
            ? altFlow.map((lt) => [lt.maLuong, lt.dieuKien, lt.xuLy, lt.quayVeStep])
            : [['ALT_01', 'Không đạt điều kiện', 'Hệ thống báo lỗi', 'Bước 1']];
        children.push(createStyledTable(['Mã luồng', 'Điều kiện rẽ nhánh', 'Xử lý', 'Quay về bước'], [1300, 2800, 3400, 1855], altRows));

        // Luồng ngoại lệ
        children.push(createPara('Luồng ngoại lệ', false, true));
        const excFlow = feat.luongNgoaiLe && feat.luongNgoaiLe.length > 0 ? feat.luongNgoaiLe : [];
        const excRows = excFlow.length > 0
            ? excFlow.map((le) => [le.maLuong, le.tinhHuong, le.xuLy, le.maThongBao])
            : [['EXC_01', 'Lỗi kết nối', 'Báo lỗi hệ thống', 'ERR_014']];
        children.push(createStyledTable(['Mã luồng', 'Tình huống ngoại lệ', 'Xử lý của hệ thống', 'Mã thông báo'], [1300, 2800, 3400, 1855], excRows));

        // ### Thiết kế giao diện (Heading 5)
        children.push(createHeading('Thiết kế giao diện', HeadingLevel.HEADING_5));
        
        let uiImageEmbedded = false;

        // 1) Nếu thietKeGiaoDien chứa text hoặc cú pháp Markdown ảnh
        if (feat.thietKeGiaoDien) {
            const paras = renderTextWithImages(feat.thietKeGiaoDien, images, `Mockup Giao diện: ${feat.tenFeat}`, usedImagesSet);
            if (paras.length > 0) {
                children.push(...paras);
                uiImageEmbedded = true;
            }
        }

        // 2) Fallback nếu chưa có ảnh nào được chèn cho tính năng UI này, lấy ảnh chưa dùng kế tiếp
        if (!uiImageEmbedded && profile === 'UI') {
            const unusedImg = images.find((img) => img.name && !usedImagesSet.has(img.name));
            if (unusedImg && unusedImg.name) {
                usedImagesSet.add(unusedImg.name);
                children.push(...createImageParagraph(unusedImg.dataUrl, `Mockup Giao diện: ${feat.tenFeat}`));
                uiImageEmbedded = true;
            }
        }

        if (!uiImageEmbedded) {
            children.push(createPara(`![Mockup ${feat.maFeat}](FEAT_${feat.maFeat}_mockup.png)`));
        }

        // ### Mô tả các thành phần trên giao diện (Heading 5)
        children.push(createHeading('Mô tả các thành phần trên giao diện', HeadingLevel.HEADING_5));
        const uiComps = feat.thanhPhanGiaoDien && feat.thanhPhanGiaoDien.length > 0 ? feat.thanhPhanGiaoDien : [];
        const compRows = uiComps.length > 0
            ? uiComps.map((tp, i) => [String(i + 1), tp.name, tp.type, tp.required, tp.limit || '', tp.validation || ''])
            : [['1', '—', '—', '—', '—', '—']];
        children.push(createStyledTable(['STT', 'Tên thành phần', 'Kiểu dữ liệu / Loại control', 'Bắt buộc / Giá trị mặc định', 'Giới hạn', 'Mô tả ràng buộc'], [500, 1800, 1500, 1400, 1000, 3155], compRows));

        // ### Xử lý sự kiện và thao tác (Heading 5)
        children.push(createHeading('Xử lý sự kiện và thao tác', HeadingLevel.HEADING_5));
        const events = feat.suKienThaoTac && feat.suKienThaoTac.length > 0 ? feat.suKienThaoTac : [];
        const eventRows = events.length > 0
            ? events.map((sk, i) => [String(i + 1), sk.event, sk.condition || '', sk.processing, sk.resultMsg || ''])
            : [['1', 'Click Nút Lưu', 'Form hợp lệ', 'Lưu CSDL', 'SUC_001']];
        children.push(createStyledTable(['STT', 'Sự kiện / Thao tác', 'Điều kiện', 'Xử lý của hệ thống', 'Kết quả / Mã thông báo'], [500, 2000, 1800, 3000, 2055], eventRows));

        // ### Thông báo (Heading 5)
        children.push(createHeading('Thông báo', HeadingLevel.HEADING_5));
        children.push(createNote('Mã dùng chung TOÀN HỆ THỐNG, dạng «LOẠI»_«3 số» — ví dụ ERR_014.'));
        
        const msgs = feat.thongBao && feat.thongBao.length > 0 ? feat.thongBao : [];
        const msgRows = msgs.length > 0
            ? msgs.map((m, i) => [String(i + 1), m.maThongBao, m.loai, m.noiDung, m.dieuKien])
            : [['1', 'ERR_014', 'ERR', 'Lỗi hệ thống', 'Khi lỗi']];
        children.push(createStyledTable(['STT', 'Mã thông báo', 'Loại', 'Nội dung', 'Điều kiện phát sinh'], [500, 2000, 1200, 3300, 2355], msgRows));

        // ### Tiêu chí chấp nhận (Heading 5)
        children.push(createHeading('Tiêu chí chấp nhận', HeadingLevel.HEADING_5));
        children.push(createNote('3–6 câu khẳng định KIỂM ĐƯỢC cho mỗi tính năng, không phải kịch bản kiểm thử đầy đủ.'));
        
        const acs = feat.tieuChiChapNhan && feat.tieuChiChapNhan.length > 0 ? feat.tieuChiChapNhan : [];
        const acRows = acs.length > 0
            ? acs.map((ac, i) => [String(i + 1), ac.tieuChi, ac.maBr || ''])
            : [['1', 'Khi nhập đủ thông tin bắt buộc thì hệ thống phải lưu thành công', 'BR-001']];
        children.push(createStyledTable(['STT', 'Tiêu chí — «Khi … thì hệ thống phải …»', 'Mã BR liên quan'], [500, 6855, 2000], acRows));
    });

    // ## Dữ liệu và tích hợp (Heading 4)
    children.push(createHeading('Dữ liệu và tích hợp', HeadingLevel.HEADING_4));
    children.push(createNote('Loại: Bảng CSDL / API / File / Hàng đợi. Chiều: Đọc / Ghi / Vào / Ra.'));
    children.push(createStyledTable(['STT', 'Loại', 'Tên đối tượng', 'Chiều', 'Mô tả / Ghi chú'], [500, 1400, 2400, 1200, 3855], [['1', 'Bảng CSDL', 'DANH_MUC', 'Ghi', 'Lưu dữ liệu']]));

    // ## Phân loại dữ liệu (Heading 4)
    children.push(createHeading('Phân loại dữ liệu', HeadingLevel.HEADING_4));
    children.push(createNote('Phân loại: Công khai / Nội bộ / Nhạy cảm / Định danh cá nhân.'));
    
    const dataClass = doc.dataClassification && doc.dataClassification.length > 0 ? doc.dataClassification : [];
    const dataClassRows = dataClass.length > 0
        ? dataClass.map((dc, i) => [String(i + 1), dc.truongDuLieu, dc.phanLoai, dc.quyTacChe, dc.ghiNhatKy, dc.thoiHanLuu])
        : [['1', '—', '—', '—', '—', '—']];
    children.push(createStyledTable(['STT', 'Trường / Nhóm dữ liệu', 'Phân loại', 'Quy tắc che', 'Ghi nhật ký', 'Thời hạn lưu'], [500, 2400, 1600, 2200, 1300, 1355], dataClassRows));

    // ## Vấn đề còn mở (Heading 4)
    children.push(createHeading('Vấn đề còn mở', HeadingLevel.HEADING_4));
    children.push(createNote('Mục này PHẢI rỗng thì chức năng mới được chuyển sang status = approved.'));
    
    const oqs = doc.openQuestions && doc.openQuestions.length > 0 ? doc.openQuestions : [];
    const oqRows = oqs.length > 0
        ? oqs.map((q, i) => [String(i + 1), q.topic, q.content])
        : [['1', 'Không áp dụng', 'Chưa có câu hỏi mở']];
    children.push(createStyledTable(['#', 'Chủ đề', 'Nội dung'], [500, 3800, 5055], oqRows));

    // ## Lịch sử thay đổi (Heading 4)
    children.push(createHeading('Lịch sử thay đổi', HeadingLevel.HEADING_4));
    children.push(createNote('Script build tự đổ nội dung từ Git log của chính file này. Không gõ tay.'));
    children.push(createStyledTable(['Phiên bản', 'Ngày', 'Người thực hiện', 'Mô tả thay đổi'], [1100, 1400, 2200, 4655], [['v4.0', new Date().toLocaleDateString('vi-VN'), author || 'Cán bộ BA', 'Khởi tạo từ Tool Confluence Importer SRS v4.0']]));

    const wordDoc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1417, // 2.5cm ISO A4
                            bottom: 1417, // 2.5cm ISO A4
                            left: 1417, // 2.5cm ISO A4
                            right: 1417, // 2.5cm ISO A4
                        },
                    },
                },
                children,
            },
        ],
    });

    return await Packer.toBuffer(wordDoc);
}
