# -*- coding: utf-8 -*-
"""
Build config/cic-reference.docx (+ .example.docx) cho Pandoc.
Base = Pandoc default reference (đủ style Pandoc cần) + ghép visual CIC từ srs-template.docx:
  - docDefaults: Arial 11pt, màu 1A1A1A
  - Heading 1/2/3: màu + cỡ CIC (xanh), in đậm
  - 3 style trang bìa: Cover Org / Cover Title / Cover Meta (Pandoc custom-style theo NAME)
  - Header/Footer CIC (copy nguyên từ srs-template — không có ảnh)
  - Khổ A4 + margin CIC (2cm/2.5cm)
Dùng string-surgery + zipfile để giữ nguyên byte các phần không đụng (tránh lỗi namespace).
"""
import zipfile, re, shutil, os, subprocess

SRS  = "config/srs-template.docx"
OUT  = "config/cic-reference.docx"
OUT2 = "config/cic-reference.example.docx"
TMP  = "config/_cic_ref_tmp.docx"
BASE = "config/_pandoc_default_ref.docx"  # base PRISTINE sinh mới mỗi lần (idempotent)

def find_pandoc() -> str:
    p = shutil.which("pandoc")
    if p:
        return p
    cand = r"C:\Program Files\Pandoc\pandoc.exe"
    if os.path.exists(cand):
        return cand
    raise SystemExit("Không tìm thấy pandoc (cần để sinh base reference mặc định).")

# Sinh base = Pandoc default reference.docx (đủ mọi style Pandoc cần) — KHÔNG tái dùng output cũ
# (tránh ghép header/footer/cover lặp lại gây duplicate zip entry).
def make_base():
    data = subprocess.check_output([find_pandoc(), "--print-default-data-file", "reference.docx"])
    with open(BASE, "wb") as f:
        f.write(data)

# ---- visual CIC (lấy từ srs-template) ----
# Toàn bộ tài liệu dùng Times New Roman (chuẩn văn bản hành chính VN). Đặt EXPLICIT ở mọi nơi
# (docDefaults + heading + cover + theme) để Word lẫn docx-preview hiển thị đồng nhất — không phụ
# thuộc theme font (Aptos) mà docx-preview resolve không chuẩn → preview lộn xộn nhiều font.
RFONTS_TNR = '<w:rFonts w:ascii="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'
DOC_DEFAULTS = (
    '<w:docDefaults><w:rPrDefault><w:rPr>'
    + RFONTS_TNR +
    '<w:color w:val="1A1A1A"/><w:sz w:val="26"/><w:szCs w:val="26"/>'
    '<w:lang w:val="vi-VN" w:eastAsia="vi-VN" w:bidi="ar-SA"/>'
    '</w:rPr></w:rPrDefault>'
    # Giãn dòng Single (line 240, auto) + Before = After = 6pt (120 twips) cho mọi style text.
    '<w:pPrDefault><w:pPr><w:jc w:val="both"/><w:spacing w:before="120" w:after="120" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault>'
    '</w:docDefaults>'
)
# Spacing chuẩn dùng lại cho heading: Single + 6pt/6pt.
PARA_SPACING = '<w:spacing w:before="120" w:after="120" w:line="240" w:lineRule="auto"/>'
HEAD_RPR = {
    "Heading1": '<w:rPr>' + RFONTS_TNR + '<w:b/><w:bCs/><w:color w:val="2E74B5"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr>',
    "Heading2": '<w:rPr>' + RFONTS_TNR + '<w:b/><w:bCs/><w:color w:val="2E74B5"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>',
    "Heading3": '<w:rPr>' + RFONTS_TNR + '<w:b/><w:bCs/><w:color w:val="1F4D78"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>',
}
COVER_STYLES = (
    '<w:style w:type="paragraph" w:customStyle="1" w:styleId="CoverOrg">'
    '<w:name w:val="Cover Org"/><w:basedOn w:val="Normal"/><w:qFormat/>'
    '<w:pPr><w:spacing w:before="2400" w:after="0"/><w:jc w:val="center"/></w:pPr>'
    '<w:rPr>' + RFONTS_TNR + '<w:b/><w:bCs/><w:color w:val="1F4D78"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style>'
    '<w:style w:type="paragraph" w:customStyle="1" w:styleId="CoverTitle">'
    '<w:name w:val="Cover Title"/><w:basedOn w:val="Normal"/><w:qFormat/>'
    '<w:pPr><w:spacing w:before="2000" w:after="480"/><w:jc w:val="center"/></w:pPr>'
    '<w:rPr>' + RFONTS_TNR + '<w:b/><w:bCs/><w:color w:val="2E74B5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr></w:style>'
    '<w:style w:type="paragraph" w:customStyle="1" w:styleId="CoverMeta">'
    '<w:name w:val="Cover Meta"/><w:basedOn w:val="Normal"/><w:qFormat/>'
    '<w:pPr><w:spacing w:before="120" w:after="0"/><w:jc w:val="center"/></w:pPr>'
    '<w:rPr>' + RFONTS_TNR + '<w:color w:val="595959"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>'
)
NEW_SECTPR = (
    '<w:sectPr>'
    '<w:headerReference w:type="default" r:id="rId10"/>'
    '<w:footerReference w:type="default" r:id="rId11"/>'
    '<w:footnotePr><w:numRestart w:val="eachSect"/></w:footnotePr>'
    '<w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/>'
    '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417" '
    'w:header="708" w:footer="708" w:gutter="0"/>'
    '<w:cols w:space="720"/></w:sectPr>'
)

# Pandoc áp style "Table" cho bảng. Bản default KHÔNG có viền → bảng mất border.
# Thêm tblBorders đủ 6 cạnh (single, ½pt), màu 83CAEB (theo mẫu). Vị trí: sau tblInd, trước tblCellMar.
TABLE_BORDER_COLOR = "83CAEB"
TABLE_BORDERS = (
    '<w:tblBorders>'
    f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{TABLE_BORDER_COLOR}"/>'
    f'<w:left w:val="single" w:sz="4" w:space="0" w:color="{TABLE_BORDER_COLOR}"/>'
    f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{TABLE_BORDER_COLOR}"/>'
    f'<w:right w:val="single" w:sz="4" w:space="0" w:color="{TABLE_BORDER_COLOR}"/>'
    f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{TABLE_BORDER_COLOR}"/>'
    f'<w:insideV w:val="single" w:sz="4" w:space="0" w:color="{TABLE_BORDER_COLOR}"/>'
    '</w:tblBorders>'
)
# Bảng Pandoc mặc định không có tblLayout → Word chia đều cột theo gridCol hints.
# Thêm autofit vào Table style → bảng tự giãn theo nội dung (= Word "Auto Fit Contents").
# Vị trí: sau tblBorders, trước tblCellMar (đúng thứ tự schema CT_TblPrBase).
TABLE_LAYOUT = '<w:tblLayout w:type="autofit"/>'

# Header row (in đậm + căn giữa ngang/dọc) KHÔNG dùng conditional formatting firstRow:
# docx-preview gắn class "first-row" ở cấp <table> nhưng selector lại là "tr.first-row td"
# → bold/căn giữa leak ra TOÀN bảng trong preview. Thay vào đó format TRỰC TIẾP header row
# trong document.xml (xem route.ts) để Word lẫn preview đều đúng. Ở đây chỉ gỡ block firstRow gốc.

def patch_styles(xml: str) -> str:
    # docDefaults
    xml = re.sub(r"<w:docDefaults>.*?</w:docDefaults>", DOC_DEFAULTS, xml, count=1, flags=re.S)
    # headings: bỏ rPr cũ + chuẩn hoá spacing (Single + 6pt/6pt), chèn rPr CIC trước </w:style>
    for sid, rpr in HEAD_RPR.items():
        m = re.search(r'(<w:style [^>]*w:styleId="' + sid + r'"[^>]*>)(.*?)(</w:style>)', xml, re.S)
        if not m:
            raise SystemExit("Không thấy style " + sid)
        body = re.sub(r"<w:rPr>.*?</w:rPr>", "", m.group(2), flags=re.S)
        body = re.sub(r"<w:spacing\b[^>]*/>", PARA_SPACING, body)
        xml = xml[:m.start()] + m.group(1) + body + rpr + m.group(3) + xml[m.end():]
    # viền bảng + autofit: chèn vào tblPr của style "Table" (nếu chưa có)
    mt = re.search(r'(<w:style w:type="table"[^>]*w:styleId="Table"[^>]*>.*?</w:style>)', xml, re.S)
    if not mt:
        raise SystemExit("Không thấy style Table")
    block = mt.group(1)
    new_block = block
    if "<w:tblBorders>" not in new_block:
        new_block = new_block.replace("<w:tblCellMar>", TABLE_BORDERS + "<w:tblCellMar>", 1)
        if new_block == block:
            raise SystemExit("Không chèn được tblBorders (thiếu tblCellMar)")
    if "<w:tblLayout" not in new_block:
        new_block = new_block.replace("<w:tblCellMar>", TABLE_LAYOUT + "<w:tblCellMar>", 1)
        if new_block == block:
            raise SystemExit("Không chèn được tblLayout (thiếu tblCellMar)")
    # Gỡ block conditional firstRow gốc (gây leak bold ra cả bảng trong docx-preview).
    new_block = re.sub(r'<w:tblStylePr w:type="firstRow">.*?</w:tblStylePr>', '', new_block, flags=re.S)
    xml = xml.replace(block, new_block, 1)
    # cover styles
    xml = xml.replace("</w:styles>", COVER_STYLES + "</w:styles>", 1)
    return xml

def patch_document(xml: str) -> str:
    n = re.subn(r"<w:sectPr\b.*?</w:sectPr>", NEW_SECTPR, xml, count=1, flags=re.S)
    if n[1] != 1:
        raise SystemExit("Không thay được sectPr")
    return n[0]

def patch_rels(xml: str) -> str:
    add = ('<Relationship Id="rId10" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>'
           '<Relationship Id="rId11" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>')
    return xml.replace("</Relationships>", add + "</Relationships>", 1)

def patch_ct(xml: str) -> str:
    add = ('<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'
           '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>')
    return xml.replace("</Types>", add + "</Types>", 1)

# Theme mặc định của Pandoc dùng Aptos/Aptos Display (font Office mới, máy thường không cài →
# Word & browser thay thế khác nhau → preview lộn xộn). Style heading/Title/TOC tham chiếu theme
# (majorHAnsi/minorHAnsi) nên phải đổi font trong theme1.xml → Times New Roman để đồng nhất.
def patch_theme(xml: str) -> str:
    def fix_block(block: str) -> str:
        block = re.sub(r'<a:latin typeface="[^"]*"', '<a:latin typeface="Times New Roman"', block)
        block = re.sub(r'(<a:font script="Viet" typeface=")[^"]*(")', r'\1Times New Roman\2', block)
        return block
    for tag in ("majorFont", "minorFont"):
        m = re.search(r"<a:" + tag + r">.*?</a:" + tag + r">", xml, re.S)
        if m:
            xml = xml.replace(m.group(0), fix_block(m.group(0)), 1)
    return xml

# sinh base pristine
make_base()

# header/footer copy từ srs-template
srs = zipfile.ZipFile(SRS)
HEADER = srs.read("word/header1.xml")
FOOTER = srs.read("word/footer1.xml")
EMPTY_RELS = b'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>'
srs.close()

# Header CIC: trái = "TÀI LIỆU ĐẶC TẢ CHỨC NĂNG", phải = "Phiên bản:.....".
# Thay text 2 run sẵn có; đẩy tab phải về sát lề phải (9355 = bề rộng vùng text A4).
def patch_header(data: bytes) -> bytes:
    xml = data.decode("utf-8")
    xml = xml.replace("TRUNG TÂM THÔNG TIN TÍN DỤNG QUỐC GIA VIỆT NAM (CIC)",
                      "TÀI LIỆU ĐẶC TẢ CHỨC NĂNG")
    xml = xml.replace("Tài liệu Thiết kế Giao diện", "Phiên bản:.....")
    xml = re.sub(r'<w:tab w:val="right" w:pos="\d+"/>', '<w:tab w:val="right" w:pos="9355"/>', xml)
    return xml.encode("utf-8")

HEADER = patch_header(HEADER)

zin = zipfile.ZipFile(BASE, "r")
names = zin.namelist()
with zipfile.ZipFile(TMP, "w", zipfile.ZIP_DEFLATED) as zout:
    for n in names:
        data = zin.read(n)
        if n == "word/styles.xml":
            data = patch_styles(data.decode("utf-8")).encode("utf-8")
        elif n == "word/document.xml":
            data = patch_document(data.decode("utf-8")).encode("utf-8")
        elif n == "word/_rels/document.xml.rels":
            data = patch_rels(data.decode("utf-8")).encode("utf-8")
        elif n == "[Content_Types].xml":
            data = patch_ct(data.decode("utf-8")).encode("utf-8")
        elif n == "word/theme/theme1.xml":
            data = patch_theme(data.decode("utf-8")).encode("utf-8")
        zout.writestr(n, data)
    # thêm parts header/footer
    zout.writestr("word/header1.xml", HEADER)
    zout.writestr("word/footer1.xml", FOOTER)
    zout.writestr("word/_rels/header1.xml.rels", EMPTY_RELS)
    zout.writestr("word/_rels/footer1.xml.rels", EMPTY_RELS)
zin.close()

shutil.move(TMP, OUT)
shutil.copyfile(OUT, OUT2)
if os.path.exists(BASE):
    os.remove(BASE)  # dọn base tạm
print("OK ->", OUT, "(", os.path.getsize(OUT), "bytes )")
print("OK ->", OUT2)
