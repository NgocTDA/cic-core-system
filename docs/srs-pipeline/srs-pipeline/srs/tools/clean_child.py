#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
clean_child.py — Chuan hoa file dac ta chuc nang bi lan style tu nguon khac.

Dung khi BA copy noi dung tu tai lieu khac / web / email sang. Word keo theo
style la, font la, co chu la, to nen, vien, danh so truc tiep — nhin tren file
con thi van on, nhung khi ghep vao tai lieu tong thi bien dang.

Cong cu lam 6 viec:
  1. Anh xa style la ve bo style duoc phep (T-NoiDung / T-Gach - / Heading 3-5).
  2. Go dinh dang truc tiep tren chu: font, co chu, mau, to nen, vien, gian chu.
     GIU LAI dam / nghieng / gach chan / chi so — day thuong la nhan manh co y.
  3. Go dinh dang truc tiep tren doan: to nen, vien, thut le, gian dong, can le.
  4. Ep bang ve TableStyle3, go to nen o.
  5. Go ngat trang thu cong, ngat section, danh so truc tiep tren doan bullet.
  6. Don rac XML: proofErr, noProof, lastRenderedPageBreak, bookmark rong.

Mac dinh chi BAO CAO, khong sua. Them --apply de ghi (tu dong tao ban .bak).

    python tools/clean_child.py functions/FUNC-XTH-001_Dang-nhap.docx
    python tools/clean_child.py functions/*.docx --apply
    python tools/clean_child.py f.docx --apply --shift-headings 2
    python tools/clean_child.py f.docx --apply --keep-layout
"""
import argparse
import shutil
import sys
import zipfile
from collections import Counter
from pathlib import Path

from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


def q(t: str) -> str:
    return f"{{{W}}}{t}"


PARTS = ("word/document.xml",)

# Style duoc phep ton tai trong file con
ALLOWED_PARA = {"Heading3", "Heading4", "Heading5", "T-NoiDung",
                "T-Gach-", "T-Gach", "Caption"}
# "Normal" khong nam trong danh sach tren: doan than bai ngoai bang phai la
# T-NoiDung. Rieng doan trong o bang thi de nguyen Normal — doi hang loat chi
# tao nhieu bao cao nhieu chu khong duoc gi.
ALLOWED_CHAR = {"Strong", "Hyperlink"}
TABLE_STYLE = "TableStyle3"

# Style la -> style dich. Khop theo styleId, khong phan biet hoa thuong.
STYLE_MAP = {
    # danh sach / bullet cac loai
    "listparagraph": "T-Gach-", "listbullet": "T-Gach-", "listbullet2": "T-Gach",
    "listbullet3": "T-Gach", "listnumber": "T-Gach-", "listnumber2": "T-Gach",
    "bulletlist1": "T-Gach-", "numbertable": "T-NoiDung",
    # than bai cac loai
    "bodytext": "T-NoiDung", "bodytext2": "T-NoiDung", "bodytext3": "T-NoiDung",
    "bodytextindent": "T-NoiDung", "nospacing": "T-NoiDung",
    "normalweb": "T-NoiDung", "plaintext": "T-NoiDung", "default": "T-NoiDung",
    "htmlpreformatted": "T-NoiDung", "quote": "T-NoiDung",
    "intensequote": "T-NoiDung", "noparagraphstyle": "T-NoiDung",
}

# Thuoc tinh chu bi go sach — day la thu lam bien dang khi ghep
RUN_DROP = ["rFonts", "sz", "szCs", "color", "highlight", "shd", "spacing", "w",
            "kern", "position", "bdr", "effect", "em", "outline", "shadow",
            "emboss", "imprint", "smallCaps", "caps", "noProof", "lang",
            "eastAsianLayout", "fitText"]

# Thuoc tinh chu GIU LAI: b, bCs, i, iCs, u, strike, vertAlign, rtl

# Thuoc tinh doan bi go
PARA_DROP_ALWAYS = ["shd", "pBdr", "framePr", "textboxTightWrap",
                    "suppressAutoHyphens", "widowControl", "wordWrap"]
PARA_DROP_LAYOUT = ["spacing", "ind", "jc", "contextualSpacing", "keepNext",
                    "keepLines", "pageBreakBefore", "tabs"]


class Cleaner:
    def __init__(self, shift: int = 0, keep_layout: bool = False):
        self.shift = shift
        self.keep_layout = keep_layout
        self.log = Counter()
        self.detail = []

    def note(self, key: str, sample: str = "") -> None:
        self.log[key] += 1
        if sample and len([d for d in self.detail if d[0] == key]) < 3:
            self.detail.append((key, sample))

    # ---------------------------------------------------------------- style
    def map_style(self, sid: str) -> str:
        if sid in ALLOWED_PARA:
            return sid
        low = sid.lower()
        if low in STYLE_MAP:
            return STYLE_MAP[low]
        if low.startswith("heading") and low[7:].isdigit():
            n = int(low[7:])
            if self.shift:
                n = min(max(n + self.shift, 3), 5)
                return f"Heading{n}"
            return "!HEADING"          # bao loi, khong tu doi
        return "T-NoiDung"

    def clean_paragraph(self, p, in_table: bool = False) -> None:
        ppr = p.find(q("pPr"))
        text = "".join(t.text or "" for t in p.iter(q("t")))[:45]

        if ppr is None and text.strip() and not in_table:
            ppr = etree.Element(q("pPr"))
            p.insert(0, ppr)

        if ppr is not None:
            pstyle = ppr.find(q("pStyle"))
            sid = pstyle.get(q("val")) if pstyle is not None else "Normal"
            new = sid if (in_table and sid == "Normal") else self.map_style(sid)

            if new == "!HEADING":
                self.note(f"Heading lạ '{sid}' — cần --shift-headings hoặc sửa tay", text)
            elif new != sid:
                if pstyle is None:
                    pstyle = etree.SubElement(ppr, q("pStyle"))
                    ppr.insert(0, pstyle)
                pstyle.set(q("val"), new)
                self.note(f"style {sid} → {new}", text)

            # danh so truc tiep tren doan bullet -> style da co bullet roi
            numpr = ppr.find(q("numPr"))
            if numpr is not None and new in ("T-Gach-", "T-Gach"):
                ppr.remove(numpr)
                self.note("gỡ đánh số trực tiếp trên gạch đầu dòng", text)

            for tag in PARA_DROP_ALWAYS:
                el = ppr.find(q(tag))
                if el is not None:
                    ppr.remove(el)
                    self.note(f"gỡ {tag} trên đoạn", text)

            if not self.keep_layout:
                for tag in PARA_DROP_LAYOUT:
                    el = ppr.find(q(tag))
                    if el is not None:
                        ppr.remove(el)
                        self.note(f"gỡ {tag} trên đoạn", text)

            # dinh dang dau ket doan
            prpr = ppr.find(q("rPr"))
            if prpr is not None:
                self.clean_rpr(prpr, text, mark=True)

        for r in p.findall(q("r")):
            rpr = r.find(q("rPr"))
            if rpr is not None:
                self.clean_rpr(rpr, text)
            for br in r.findall(q("br")):
                if br.get(q("type")) == "page":
                    r.remove(br)
                    self.note("gỡ ngắt trang thủ công", text)
            for junk in ("lastRenderedPageBreak",):
                for el in r.findall(q(junk)):
                    r.remove(el)

    def clean_rpr(self, rpr, text: str, mark: bool = False) -> None:
        rstyle = rpr.find(q("rStyle"))
        if rstyle is not None and rstyle.get(q("val")) not in ALLOWED_CHAR:
            self.note(f"gỡ style chữ lạ '{rstyle.get(q('val'))}'", text)
            rpr.remove(rstyle)
        for tag in RUN_DROP:
            el = rpr.find(q(tag))
            if el is not None:
                rpr.remove(el)
                if not mark:
                    self.note(f"gỡ {tag} trực tiếp trên chữ", text)

    # ---------------------------------------------------------------- table
    def clean_table(self, tbl) -> None:
        tblpr = tbl.find(q("tblPr"))
        if tblpr is not None:
            st = tblpr.find(q("tblStyle"))
            cur = st.get(q("val")) if st is not None else None
            if cur != TABLE_STYLE:
                if st is None:
                    st = etree.Element(q("tblStyle"))
                    tblpr.insert(0, st)
                st.set(q("val"), TABLE_STYLE)
                self.note(f"bảng: style {cur or '(không)'} → {TABLE_STYLE}")
            for tag in ("shd", "tblBorders"):
                el = tblpr.find(q(tag))
                if el is not None:
                    tblpr.remove(el)
                    self.note(f"bảng: gỡ {tag}")
        for tc in tbl.iter(q("tc")):
            tcpr = tc.find(q("tcPr"))
            if tcpr is not None:
                for tag in ("shd", "tcBorders"):
                    el = tcpr.find(q(tag))
                    if el is not None:
                        tcpr.remove(el)
                        self.note(f"ô bảng: gỡ {tag}")

    # ----------------------------------------------------------------- main
    def clean_document(self, root) -> None:
        body = root.find(q("body"))

        # ngat section giua chung
        for ppr in body.iter(q("pPr")):
            sect = ppr.find(q("sectPr"))
            if sect is not None:
                ppr.remove(sect)
                self.note("gỡ ngắt section giữa tài liệu")

        for tbl in body.iter(q("tbl")):
            self.clean_table(tbl)

        # lxml tao proxy moi moi lan duyet nen id() khong on dinh — phai
        # xac dinh doan nam trong bang bang cach di nguoc len cay cha.
        def inside_table(el) -> bool:
            return any(etree.QName(a).localname == "tbl" for a in el.iterancestors())

        for p in body.iter(q("p")):
            self.clean_paragraph(p, in_table=inside_table(p))

        # rac XML
        for tag in ("proofErr", "noProof"):
            for el in list(body.iter(q(tag))):
                el.getparent().remove(el)
                self.log[f"dọn {tag}"] += 1

        # pPr / rPr rong sau khi don
        for parent_tag in ("pPr", "rPr", "tblPr", "tcPr"):
            for el in list(body.iter(q(parent_tag))):
                if len(el) == 0 and not el.attrib:
                    el.getparent().remove(el)


def process(path: Path, apply: bool, shift: int, keep_layout: bool) -> int:
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        data = {n: z.read(n) for n in names}

    c = Cleaner(shift=shift, keep_layout=keep_layout)
    root = etree.fromstring(data["word/document.xml"])
    c.clean_document(root)

    total = sum(c.log.values())
    blockers = sum(v for k, v in c.log.items() if k.startswith("Heading lạ"))

    print(f"\n=== {path.name} ===")
    if not total:
        print("  Sạch — không có gì phải chuẩn hoá.")
        return 0

    for key, n in c.log.most_common():
        mark = "  ✗" if key.startswith("Heading lạ") else "   "
        print(f"{mark} {n:>4}  {key}")
    if c.detail:
        print("\n   Ví dụ:")
        for key, sample in c.detail[:6]:
            print(f'     · {key} — “{sample}”')

    if blockers:
        print(f"\n   {blockers} chỗ dùng Heading 1/2 hoặc heading lạ — công cụ KHÔNG tự đổi,")
        print("   vì không đoán được cấp đúng. Sửa tay, hoặc dùng --shift-headings 2")
        print("   nếu toàn bộ file lệch đúng 2 cấp (Heading 1 → Heading 3).")

    if not apply:
        print("\n   (Xem trước — thêm --apply để ghi thay đổi)")
        return blockers

    data["word/document.xml"] = etree.tostring(
        root, xml_declaration=True, encoding="UTF-8", standalone=True)
    backup = path.with_suffix(".docx.bak")
    shutil.copy(path, backup)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for n in names:
            z.writestr(n, data[n])
    print(f"\n   Đã ghi {path.name}  (bản cũ: {backup.name})")
    return blockers


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--shift-headings", type=int, default=0, metavar="N",
                    help="cộng N vào cấp mọi heading, ví dụ 2 để Heading 1 → Heading 3")
    ap.add_argument("--keep-layout", action="store_true",
                    help="giữ thụt lề / giãn dòng / căn lề tự đặt")
    args = ap.parse_args()

    files = [Path(f) for f in args.files] or sorted(Path("functions").glob("*.docx"))
    if not files:
        print("Không có file nào để xử lý.")
        return 0

    blockers = 0
    for f in files:
        blockers += process(f, args.apply, args.shift_headings, args.keep_layout)

    print(f"\n{len(files)} file · {blockers} chỗ phải sửa tay.")
    return 1 if blockers else 0


if __name__ == "__main__":
    sys.exit(main())
