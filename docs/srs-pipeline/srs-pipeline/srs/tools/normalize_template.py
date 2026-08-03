#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
normalize_template.py — Chuan hoa template goc truoc khi tach master head/tail.

A. Sua danh so
   1. Heading 5 dang danh so "(1)" thay vi "I.1.1.1.1." (numbering.xml, abstract 3, ilvl 4).
   2. Heading 7 / Heading 8 tro sai vao numId=1 thay vi numId=4.
   3. Thut le cap 4 (851) va cap 5 (4334) lech nhau -> dong bo ve 284.

B. Sua he thong chu (thang do v2.1)
   Than bai 13pt; bang 12pt; caption 11pt.
   Heading giam dan don dieu: 16pt HOA đậm > 14pt đậm > 13pt đậm
                              > 13pt đậm nghiêng > 13pt nghiêng
   Template goc dang loi: Heading 4 chi nghieng, yeu hon Heading 5 (dam + nghieng).

Chay:  python tools/normalize_template.py [nguon] [dich]
"""
import shutil
import sys
import zipfile
from pathlib import Path

from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}


def q(tag: str) -> str:
    return f"{{{W}}}{tag}"


# Thu tu phan tu trong <w:rPr> do schema quy dinh, chen sai cho la file hong.
RPR_ORDER = [
    "rStyle", "rFonts", "b", "bCs", "i", "iCs", "caps", "smallCaps", "strike",
    "dstrike", "outline", "shadow", "emboss", "imprint", "noProof", "snapToGrid",
    "vanish", "webHidden", "color", "spacing", "w", "kern", "position", "sz",
    "szCs", "highlight", "u", "effect", "bdr", "shd", "fitText", "vertAlign",
    "rtl", "cs", "em", "lang", "eastAsianLayout", "specVanish", "oMath",
]

# ----------------------------------------------------------------------------
# Thang do chu — sua o day neu muon doi
#   size: nua diem (26 = 13pt).  b/i/caps: True bat, False tat, None giu nguyen.
# ----------------------------------------------------------------------------
FONT_SCALE = {
    "Title":     dict(size=48, b=True,  i=False, caps=True),   # 24pt — bìa
    "Heading1":  dict(size=32, b=True,  i=False, caps=True),   # 16pt
    "Heading2":  dict(size=28, b=True,  i=False, caps=False),  # 14pt
    "Heading3":  dict(size=26, b=True,  i=False, caps=False),  # 13pt đậm
    "Heading4":  dict(size=26, b=True,  i=True,  caps=False),  # 13pt đậm nghiêng
    "Heading5":  dict(size=26, b=False, i=True,  caps=False),  # 13pt nghiêng
    "Caption":   dict(size=22, b=False, i=True,  caps=False),  # 11pt
    "TableStyle3": dict(size=24),                              # 12pt — nội dung bảng
}

DEFAULT_SIZE = 26        # 13pt cho toàn bộ thân bài

# Theme cua template dat majorFont = "Calibri Light" -> Heading 1..5 se ra
# Calibri Light trong khi than bai la Times New Roman. Dat lai cho dong bo.
# Muon giu heading sans-serif thi doi thanh None de bo qua buoc nay.
DOC_FONT = "Times New Roman"
HEADING_FONT = DOC_FONT
HEADING_STYLES = ("Heading1", "Heading2", "Heading3", "Heading4", "Heading5",
                  "Heading6", "Heading7", "Heading8", "Heading9", "Title", "Caption")


def set_in_rpr(rpr, tag: str, value=None, present: bool = True):
    """Dat/xoa 1 phan tu trong rPr, chen dung vi tri theo RPR_ORDER."""
    el = rpr.find(q(tag))
    if not present:
        if el is not None:
            rpr.remove(el)
        return
    if el is None:
        el = etree.SubElement(rpr, q(tag))
        rpr.remove(el)
        idx = RPR_ORDER.index(tag) if tag in RPR_ORDER else len(RPR_ORDER)
        pos = len(rpr)
        for i, child in enumerate(rpr):
            name = etree.QName(child).localname
            rank = RPR_ORDER.index(name) if name in RPR_ORDER else len(RPR_ORDER)
            if rank > idx:
                pos = i
                break
        rpr.insert(pos, el)
    if value is not None:
        el.set(q("val"), str(value))


def get_or_make(parent, tag: str, before=()):
    el = parent.find(q(tag))
    if el is not None:
        return el
    el = etree.SubElement(parent, q(tag))
    parent.remove(el)
    pos = len(parent)
    for i, child in enumerate(parent):
        if etree.QName(child).localname in before:
            pos = i
            break
    parent.insert(pos, el)
    return el


# ------------------------------------------------------------------ numbering


def fix_numbering(tree) -> None:
    root = tree.getroot()
    abs3 = None
    for a in root.findall(q("abstractNum"), NS):
        if a.get(q("abstractNumId")) == "3":
            abs3 = a
            break
    if abs3 is None:
        raise SystemExit("Không tìm thấy abstractNum id=3 — template đã đổi cấu trúc.")

    for lvl in abs3.findall(q("lvl"), NS):
        ilvl = lvl.get(q("ilvl"))
        if ilvl == "4":
            lvl.find(q("numFmt")).set(q("val"), "decimal")
            lvl.find(q("lvlText")).set(q("val"), "%1.%2.%3.%4.%5.")
        if ilvl in ("3", "4"):
            ind = lvl.find(f'{q("pPr")}/{q("ind")}')
            if ind is not None:
                ind.set(q("left"), "284")
                ind.set(q("hanging"), "284")


# --------------------------------------------------------------------- styles


def fix_styles(tree) -> None:
    root = tree.getroot()

    # 1. Co chu mac dinh toan tai lieu
    rpr_def = root.find(f'{q("docDefaults")}/{q("rPrDefault")}/{q("rPr")}')
    if rpr_def is not None:
        set_in_rpr(rpr_def, "sz", DEFAULT_SIZE)
        set_in_rpr(rpr_def, "szCs", DEFAULT_SIZE)

    styles = {s.get(q("styleId")): s for s in root.findall(q("style"), NS)}

    # 2. Heading 7/8 tro ve numId=4
    for sid in ("Heading7", "Heading8"):
        st = styles.get(sid)
        if st is None:
            continue
        num_id = st.find(f'{q("pPr")}/{q("numPr")}/{q("numId")}')
        if num_id is not None:
            num_id.set(q("val"), "4")

    # 3. Thang do chu
    for sid, spec in FONT_SCALE.items():
        st = styles.get(sid)
        if st is None:
            continue
        rpr = get_or_make(st, "rPr", before=("tblPr", "trPr", "tcPr", "tblStylePr"))
        if "size" in spec:
            set_in_rpr(rpr, "sz", spec["size"])
            set_in_rpr(rpr, "szCs", spec["size"])
        for tag in ("b", "i", "caps"):
            if spec.get(tag) is not None:
                set_in_rpr(rpr, tag, present=spec[tag])
                if tag in ("b", "i"):
                    set_in_rpr(rpr, tag + "Cs", present=spec[tag])

    # 4. Font heading — bo lien ket theme majorHAnsi (Calibri Light)
    if HEADING_FONT:
        for sid in HEADING_STYLES:
            st = styles.get(sid)
            if st is None:
                continue
            rpr = get_or_make(st, "rPr", before=("tblPr", "trPr", "tcPr", "tblStylePr"))
            fonts = get_or_make(rpr, "rFonts", before=RPR_ORDER[2:])
            for attr in ("asciiTheme", "hAnsiTheme", "cstheme", "eastAsiaTheme"):
                if fonts.get(q(attr)) is not None:
                    del fonts.attrib[q(attr)]
            for attr in ("ascii", "hAnsi", "cs"):
                fonts.set(q(attr), HEADING_FONT)


# ----------------------------------------------------------------------- main


def force_font_everywhere(data: dict, font: str) -> dict:
    """Ep font cho toan bo goi: theme, styles, than bai, header/footer.

    KHONG dung den word/numbering.xml: cac rFonts o do la font glyph cua dau
    gach dau dong (Symbol, Wingdings, Courier New). Doi thanh Times New Roman
    se bien bullet thanh ky tu rac.

    Bo qua ca cac run co <w:sym> vi ly do tuong tu.
    """
    counts = {"theme": 0, "styles": 0, "noi_dung": 0}

    # 1. Theme — goc cua moi tham chieu majorHAnsi / minorHAnsi
    if "word/theme/theme1.xml" in data:
        A = "http://schemas.openxmlformats.org/drawingml/2006/main"
        root = etree.fromstring(data["word/theme/theme1.xml"])
        for grp in ("majorFont", "minorFont"):
            for el in root.iter(f"{{{A}}}{grp}"):
                latin = el.find(f"{{{A}}}latin")
                if latin is not None:
                    latin.set("typeface", font)
                    counts["theme"] += 1
        data["word/theme/theme1.xml"] = etree.tostring(
            root, xml_declaration=True, encoding="UTF-8", standalone=True)

    # 2. styles.xml + noi dung
    parts = ["word/styles.xml"] + [
        n for n in data
        if n.startswith("word/") and (
            n == "word/document.xml"
            or n.startswith("word/header")
            or n.startswith("word/footer")
            or n.startswith("word/footnotes")
            or n.startswith("word/endnotes"))
        and n.endswith(".xml")
    ]

    for part in parts:
        if part not in data:
            continue
        root = etree.fromstring(data[part])
        n = 0
        for rpr in root.iter(q("rPr")):
            if rpr.find(q("sym")) is not None:
                continue
            fonts = rpr.find(q("rFonts"))
            if fonts is None:
                continue
            # Giu nguyen font glyph cua bullet neu lot vao day
            if fonts.get(q("ascii")) in ("Symbol", "Wingdings", "Wingdings 2",
                                         "Wingdings 3", "Webdings"):
                continue
            for attr in ("asciiTheme", "hAnsiTheme", "cstheme", "eastAsiaTheme"):
                if fonts.get(q(attr)) is not None:
                    del fonts.attrib[q(attr)]
            for attr in ("ascii", "hAnsi", "cs"):
                fonts.set(q(attr), font)
            n += 1
        data[part] = etree.tostring(
            root, xml_declaration=True, encoding="UTF-8", standalone=True)
        counts["styles" if part.endswith("styles.xml") else "noi_dung"] += n

    return counts


def main(src: str, dst: str) -> None:
    src_p, dst_p = Path(src), Path(dst)
    dst_p.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(src_p) as zin:
        names = zin.namelist()
        data = {n: zin.read(n) for n in names}

    num = etree.fromstring(data["word/numbering.xml"])
    fix_numbering(num.getroottree())
    data["word/numbering.xml"] = etree.tostring(
        num, xml_declaration=True, encoding="UTF-8", standalone=True)

    sty = etree.fromstring(data["word/styles.xml"])
    fix_styles(sty.getroottree())
    data["word/styles.xml"] = etree.tostring(
        sty, xml_declaration=True, encoding="UTF-8", standalone=True)

    counts = force_font_everywhere(data, HEADING_FONT) if HEADING_FONT else {}

    with zipfile.ZipFile(dst_p, "w", zipfile.ZIP_DEFLATED) as zout:
        for n in names:
            zout.writestr(n, data[n])

    print(f"OK  {dst_p}")
    print("    Đánh số : Heading 5 → %1.%2.%3.%4.%5. ; Heading 7/8 → numId=4 ; thụt lề 4/5 = 284")
    print("    Cỡ chữ  : thân bài 13pt · bảng 12pt · caption 11pt")
    print("    Heading : 16 HOA đậm / 14 đậm / 13 đậm / 13 đậm nghiêng / 13 nghiêng")
    print(f"    Font    : ép {HEADING_FONT} toàn bộ — theme {counts.get('theme',0)} chỗ, "
          f"styles {counts.get('styles',0)} chỗ, nội dung/header {counts.get('noi_dung',0)} chỗ")
    print("              (numbering.xml giữ nguyên Symbol/Wingdings cho bullet)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "tools/_source_template.docx",
         sys.argv[2] if len(sys.argv) > 2 else "templates/_normalized.docx")
