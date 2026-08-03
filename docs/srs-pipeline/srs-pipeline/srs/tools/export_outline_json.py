#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
export_outline_json.py — Xuat de cuong tu tools/outline.py ra outline.json.

Day la NOI TIEU THU THU TU cua outline.py, ben canh:
    make_child_template.py     -> CHILD_TEMPLATE_<LOAI>.docx
    make_child_template_md.py  -> CHILD_TEMPLATE_<LOAI>.md
    validate_child.py          -> luat kiem tra

outline.json la HOP DONG giua repo nay va cong cu web "Chuan hoa tai lieu"
(cic-core-system). Web tool doc file nay de:
  - dung cay muc Heading 4 / Heading 5 dung theo tung loai chuc nang
  - biet bo cot chuan cua tung bang
  - kiem tra dang ma (CODE_PATTERNS)
KHONG viet tay outline.json. Sua de cuong thi sua outline.py roi chay lai script.

Ket qua co tinh TAT DINH (khong nhung timestamp) de CI so sanh duoc bang --check.

Chay:
    python tools/export_outline_json.py                 # ghi outline.json
    python tools/export_outline_json.py -o /tmp/o.json  # ghi noi khac
    python tools/export_outline_json.py --check         # CI: fail neu file da commit bi lech
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import outline  # noqa: E402

SCHEMA = "cic-srs-outline/1"
DEFAULT_OUT = Path("outline.json")


def table(spec: dict) -> dict:
    """Mot bang trong de cuong -> JSON. Giu nguyen tieu de cot va chieu rong twips."""
    widths = spec["widths"]
    headers = spec["headers"]
    if sum(widths) != outline.USABLE:
        raise SystemExit(
            f"Bang {headers[:2]}: tong chieu rong {sum(widths)} != {outline.USABLE}")
    if len(headers) != len(widths):
        raise SystemExit(f"Bang {headers[:2]}: lech so cot ({len(headers)} vs {len(widths)})")

    labels = spec.get("labels")
    out: dict = {}
    if spec.get("label"):
        out["label"] = spec["label"]
    out["headers"] = headers
    out["widths"] = widths
    # rows = so hang goi y cua mau rong. Voi bang key-value thi bang so nhan.
    out["rows"] = len(labels) if labels else spec["rows"]
    if labels:
        # Cot dau co dinh -> web render thanh hang nhan chi doc.
        out["labels"] = labels
    return out


def section(spec: dict) -> dict:
    out: dict = {"name": spec["name"]}
    if spec.get("note"):
        out["note"] = spec["note"]
    if spec.get("note_md"):
        out["noteMd"] = spec["note_md"]
    if spec.get("diagram"):
        out["diagram"] = True
    if spec.get("tables"):
        out["tables"] = [table(t) for t in spec["tables"]]
    return out


def profile(name: str) -> dict:
    before, features, after = outline.sections(name)
    info = outline.PROFILES[name]
    return {
        "ten": info["ten"],
        "requireDiagram": bool(info["require_diagram"]),
        "variantOf": info.get("variant_of"),
        "before": [section(s) for s in before],
        "features": [section(s) for s in features],
        "after": [section(s) for s in after],
    }


def code_rules() -> dict:
    """Ghep CODE_RULES (nhan/dang/vi du) voi CODE_PATTERNS (bieu thuc chinh quy)."""
    if len(outline.CODE_KEYS) != len(outline.CODE_RULES):
        raise SystemExit("CODE_KEYS va CODE_RULES lech so phan tu — sua outline.py.")
    out = {}
    for key, (label, form, example) in zip(outline.CODE_KEYS, outline.CODE_RULES):
        out[key] = {
            "label": label,
            "form": form,
            "example": example,
            "pattern": outline.CODE_PATTERNS[key],
        }
    return out


def build() -> dict:
    src = (Path(__file__).parent / "outline.py").read_bytes()
    return {
        "schema": SCHEMA,
        "outlineVersion": outline.VERSION,
        # Van tay cua outline.py — doi la biet de cuong da bi sua.
        "sourceSha256": hashlib.sha256(src).hexdigest(),
        "usable": outline.USABLE,
        # 4 loai goc; DANHMUC la bien the rut gon cua UI nhung VAN la gia tri
        # hop le o dong "Loai chuc nang" — danh sach day du xem profiles.
        "baseProfiles": list(outline.PROFILE_ORDER),
        "title": outline.TITLE,
        "featureTitle": outline.FEATURE_TITLE,
        "featureNote": outline.FEATURE_NOTE,
        "diagramMark": outline.DIAGRAM_MARK,
        "codeRules": code_rules(),
        "guidance": list(outline.GUIDANCE),
        "profiles": {p: profile(p) for p in outline.ALL_PROFILES},
    }


def dumps(data: dict) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--out", default=str(DEFAULT_OUT))
    ap.add_argument("--check", action="store_true",
                    help="khong ghi; fail neu file hien tai lech voi de cuong")
    args = ap.parse_args()

    out_path = Path(args.out)
    text = dumps(build())

    if args.check:
        if not out_path.exists():
            print(f"[FAIL] Chua co {out_path}. Chay: python tools/export_outline_json.py")
            return 1
        if out_path.read_text(encoding="utf-8") != text:
            print(f"[FAIL] {out_path} lech voi tools/outline.py.")
            print("       Chay lai: python tools/export_outline_json.py")
            return 1
        print(f"[OK] {out_path} khop voi de cuong v{outline.VERSION}.")
        return 0

    out_path.write_text(text, encoding="utf-8")
    n_sec = sum(len(p["before"]) + len(p["features"]) + len(p["after"])
                for p in build()["profiles"].values())
    print(f"[OK] {out_path} — de cuong v{outline.VERSION}, "
          f"{len(outline.ALL_PROFILES)} loai, {n_sec} muc.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
