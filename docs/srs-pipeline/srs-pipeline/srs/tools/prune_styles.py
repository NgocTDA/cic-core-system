#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
prune_styles.py — Xoa style rac va giau bot style khoi thu vien Style cua Word.

Template goc co 97 style, thuc dung 26. Phan con lai la rac tich tu tu copy-paste
(a0..af8 la 26 table style tu sinh). Style rac khong chi lam nang file — no lam
thu vien Style trong Word day dac lua chon sai, va BA se chon nham.

Cach lam:
  1. Quet toan bo tham chieu pStyle / rStyle / tblStyle trong document, header,
     footer, footnotes, endnotes VA numbering.xml.
  2. Cong them cac style mac dinh bat buoc va danh sach trang.
  3. Dong bao (transitive closure) theo basedOn / link / next — xoa style cha ma
     giu style con se lam Word hong dinh dang.
  4. Xoa phan con lai.
  5. Style duoc giu nhung khong nam trong VISIBLE thi danh dau semiHidden,
     de thu vien Style chi con dung nhung style BA duoc phep dung.

Chay:
    python tools/prune_styles.py                    # xem truoc, khong sua
    python tools/prune_styles.py --apply            # sua templates/_normalized.docx
    python tools/prune_styles.py --apply -f a.docx  # sua file khac
"""
import argparse
import shutil
import zipfile
from pathlib import Path

from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


def q(t: str) -> str:
    return f"{{{W}}}{t}"


# Style Word luon can, du khong tham chieu tuong minh o dau
BUILTIN_KEEP = {"Normal", "DefaultParagraphFont", "TableNormal", "NoList"}

# Style giu lai vi quy trinh can, du hien chua dung
EXTRA_KEEP = {"Caption", "Header", "Footer", "TableGrid"}

# Style hien trong thu vien Style cua Word — dung bo nay va chi bo nay
VISIBLE = {
    "Heading1", "Heading2", "Heading3", "Heading4", "Heading5",
    "T-NoiDung", "T-Gach-", "T-Gach", "TableStyle3", "Caption", "Normal",
}


def scan_refs(data: dict) -> set:
    refs = set()
    for name, blob in data.items():
        if not name.startswith("word/") or not name.endswith(".xml"):
            continue
        if name.endswith("styles.xml"):
            continue
        try:
            root = etree.fromstring(blob)
        except etree.XMLSyntaxError:
            continue
        for tag in ("pStyle", "rStyle", "tblStyle"):
            for el in root.iter(q(tag)):
                v = el.get(q("val"))
                if v:
                    refs.add(v)
    return refs


def close_over(styles: dict, seed: set) -> set:
    """Them cac style ma style duoc giu dang phu thuoc vao (basedOn / link / next)."""
    keep = set(seed)
    changed = True
    while changed:
        changed = False
        for sid in list(keep):
            st = styles.get(sid)
            if st is None:
                continue
            for tag in ("basedOn", "link", "next"):
                el = st.find(q(tag))
                if el is not None:
                    v = el.get(q("val"))
                    if v and v in styles and v not in keep:
                        keep.add(v)
                        changed = True
    return keep


# Thu tu phan tu trong <w:style> do schema quy dinh (CT_Style).
STYLE_ORDER = [
    "name", "aliases", "basedOn", "next", "link", "autoRedefine", "hidden",
    "uiPriority", "semiHidden", "unhideWhenUsed", "qFormat", "locked",
    "personal", "personalCompose", "personalReply", "rsid",
    "pPr", "rPr", "tblPr", "trPr", "tcPr", "tblStylePr",
]


def set_flag(style, tag: str, present: bool) -> None:
    el = style.find(q(tag))
    if present and el is None:
        el = etree.Element(q(tag))
        rank = STYLE_ORDER.index(tag)
        pos = len(style)
        for i, ch in enumerate(style):
            name = etree.QName(ch).localname
            r = STYLE_ORDER.index(name) if name in STYLE_ORDER else len(STYLE_ORDER)
            if r > rank:
                pos = i
                break
        style.insert(pos, el)
    elif not present and el is not None:
        style.remove(el)


def run(path: Path, apply: bool) -> None:
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        data = {n: z.read(n) for n in names}

    root = etree.fromstring(data["word/styles.xml"])
    styles = {}
    for st in root.findall(q("style")):
        styles[st.get(q("styleId"))] = st

    refs = scan_refs(data)
    seed = (refs & set(styles)) | (BUILTIN_KEEP & set(styles)) | (EXTRA_KEEP & set(styles))
    keep = close_over(styles, seed)
    drop = sorted(set(styles) - keep)

    print(f"Tổng: {len(styles)} style · giữ {len(keep)} · xoá {len(drop)}")
    if drop:
        print("\nXoá:")
        for i in range(0, len(drop), 6):
            print("   " + ", ".join(drop[i:i + 6]))

    hidden = sorted(s for s in keep if s not in VISIBLE)
    print(f"\nHiện trong thư viện Style ({len(keep & VISIBLE)}):")
    print("   " + ", ".join(sorted(keep & VISIBLE)))
    print(f"Giữ nhưng ẩn khỏi thư viện ({len(hidden)}):")
    for i in range(0, len(hidden), 6):
        print("   " + ", ".join(hidden[i:i + 6]))

    if not apply:
        print("\n(Xem trước — thêm --apply để ghi thay đổi)")
        return

    for sid in drop:
        st = styles[sid]
        st.getparent().remove(st)

    for sid in keep:
        st = styles[sid]
        visible = sid in VISIBLE
        set_flag(st, "qFormat", visible)
        set_flag(st, "semiHidden", not visible)
        set_flag(st, "unhideWhenUsed", False)

    # Style tiem an cua Word cung khong hien trong thu vien
    latent = root.find(q("latentStyles"))
    if latent is not None:
        latent.set(q("defSemiHidden"), "1")
        latent.set(q("defUnhideWhenUsed"), "1")
        latent.set(q("defQFormat"), "0")

    data["word/styles.xml"] = etree.tostring(
        root, xml_declaration=True, encoding="UTF-8", standalone=True)

    backup = path.with_suffix(".docx.bak")
    shutil.copy(path, backup)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for n in names:
            z.writestr(n, data[n])
    print(f"\nOK  đã ghi {path}  (bản cũ: {backup.name})")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-f", "--file", default="templates/_normalized.docx")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    run(Path(args.file), args.apply)


if __name__ == "__main__":
    main()
