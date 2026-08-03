#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_child_template_md.py — Sinh templates/CHILD_TEMPLATE.md tu tools/outline.py.

Dung de chuan hoa noi dung dang co tren Confluence theo dung de cuong v3.0.
Cung nguon voi CHILD_TEMPLATE.docx nen hai ban khong bao gio lech nhau.

Anh xa cap tieu de:
    Word Heading 3  ->  tieu de trang Confluence (khong viet trong than trang)
    Word Heading 4  ->  ## trong Markdown
    Word Heading 5  ->  ### trong Markdown

Chay: python tools/make_child_template_md.py [--h1] [-o duong/dan.md]
      --h1  giu ca cap chuc nang thanh "# ..." (khi dan vao 1 trang gop nhieu chuc nang)
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import outline  # noqa: E402

DSTDIR = Path("templates")


def md_table(spec) -> list:
    """Bang Markdown rong, giu nguyen tieu de cot va nhan cot dau (neu co)."""
    out = []
    if spec.get("label"):
        out += [f"**{spec['label']}**", ""]
    headers = spec["headers"]
    out.append("| " + " | ".join(headers) + " |")
    out.append("|" + "|".join(["---"] * len(headers)) + "|")
    labels = spec.get("labels")
    n = len(labels) if labels else spec["rows"]
    for i in range(n):
        first = labels[i] if labels else ""
        cells = [first] + [""] * (len(headers) - 1)
        out.append("| " + " | ".join(cells) + " |")
    out.append("")
    return out


def render_section(sec, hashes: str) -> list:
    out = [f"{hashes} {sec['name']}", ""]
    txt = sec.get("note_md") or sec.get("note")
    if txt:
        out += [f"> {txt}", ""]
    if sec.get("diagram"):
        out += ["```", outline.DIAGRAM_MARK.format(ma="MÃ_CHỨC_NĂNG"), "```", ""]
    for tspec in sec.get("tables", []):
        out += md_table(tspec)
    if not sec.get("tables"):
        out += ["", ""]
    return out


def build(profile: str, top_level: bool) -> str:
    h_func = "#" if top_level else None
    h4, h5 = "##", "###"
    info = outline.PROFILES[profile]
    before, feats, after = outline.sections(profile)

    L = [
        "<!--",
        f"  MẪU ĐẶC TẢ CHỨC NĂNG — loại {profile}: {info['ten']}",
        "  Đề cương v3.0. Sinh tự động từ tools/outline.py — không sửa file này bằng tay;",
        "  sửa outline.py rồi chạy: python tools/make_child_template_md.py",
        "",
        "  Ánh xạ cấp tiêu đề:",
        "    Tiêu đề trang Confluence = Chức năng [MÃ] Tên chức năng   (Word Heading 3)",
        "    ##  = Word Heading 4 — mục cấp chức năng",
        "    ### = Word Heading 5 — mục trong khối Tính năng",
        "",
        "  Khối “Tính năng” lặp lại cho mỗi tính năng. Chức năng chỉ có một",
        "  tính năng vẫn phải giữ tầng này.",
        "  Không xoá mục nào — mục không áp dụng thì ghi “Không áp dụng”.",
        "-->",
        "",
    ]

    if h_func:
        L += [f"{h_func} {outline.TITLE}", ""]
    else:
        L += [f"> **Tiêu đề trang:** `{outline.TITLE}`", ""]

    L += ["<!-- HƯỚNG DẪN — xoá khối này sau khi đã chuẩn hoá xong trang -->", "",
          f"> **Loại chức năng: `{profile}` — {info['ten']}**", ">"]
    if info.get("variant_of"):
        L.append(f"> Biến thể rút gọn của `{info['variant_of']}`, không phải một loại riêng. "
                 "Hành vi CRUD chuẩn đã đặc tả một lần ở component `CMP-DANHMUC-001`.")
        L.append(">")
    if info["require_diagram"]:
        L.append("> Loại này **bắt buộc** có sơ đồ trình tự — luồng có từ 2 hệ thống trở lên.")
        L.append(">")
    L.append("> **Quy ước bắt buộc**")
    L.append(">")
    for line in outline.GUIDANCE:
        if "style" in line or "Insert Caption" in line or "Heading 1/Heading 2" in line:
            continue
        L.append(f"> - {line}")
    L += [">", "> **Quy ước mã**", ">",
          "> | Loại | Dạng | Ví dụ |", "> |---|---|---|"]
    for loai, dang, vd in outline.CODE_RULES:
        L.append(f"> | {loai} | `{dang}` | `{vd}` |")
    L += ["", "---", ""]

    for sec in before:
        L += render_section(sec, h4)

    L += [f"{h4} {outline.FEATURE_TITLE}", "", f"> {outline.FEATURE_NOTE}", ""]
    for sec in feats:
        L += render_section(sec, h5)
    L += ["<!-- ↑ Hết một khối Tính năng. Nhân bản từ “"
          f"{h4} {outline.FEATURE_TITLE}” xuống đến đây cho tính năng tiếp theo. -->", ""]

    for sec in after:
        L += render_section(sec, h4)

    out, blank = [], 0
    for line in L:
        if line.strip() == "":
            blank += 1
            if blank > 1:
                continue
        else:
            blank = 0
        out.append(line)
    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--h1", action="store_true",
                    help="đưa cấp Chức năng thành '# ...' thay vì tiêu đề trang")
    ap.add_argument("-p", "--profile", choices=outline.ALL_PROFILES,
                    help="chỉ sinh 1 loại; bỏ trống thì sinh tất cả")
    ap.add_argument("-o", "--out", help="đường dẫn khi chỉ sinh 1 loại")
    args = ap.parse_args()

    profiles = [args.profile] if args.profile else outline.ALL_PROFILES
    DSTDIR.mkdir(parents=True, exist_ok=True)
    for profile in profiles:
        text = build(profile, top_level=args.h1)
        p = Path(args.out) if (args.out and args.profile) \
            else DSTDIR / f"CHILD_TEMPLATE_{profile}.md"
        p.write_text(text, encoding="utf-8")
        print(f"OK  {p.name:<32} {len(text.splitlines()):>4} dòng, "
              f"{text.count(chr(10) + '|---'):>2} bảng")


if __name__ == "__main__":
    main()
