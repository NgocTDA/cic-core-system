#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_diagrams.py — Render so do PlantUML tu diagrams/*.puml ra build/diagrams/*.png.

So do la MA NGUON, khong phai anh dan vao Word:
  - anh nhung trong .docx khong diff duoc; reviewer khong biet so do doi gi
  - .puml diff duoc tung dong trong Merge Request
  - build lai la so do moi nhat, khong co chuyen file .docx con giu anh cu
  - ten participant kiem duoc tu dong

Uu tien Docker (khong can cai Java tren may BA):
    docker run --rm -v "$PWD:/work" -w /work plantuml/plantuml -tpng -o <out> <file>

Neu khong co Docker thi dung PLANTUML_JAR (bien moi truong hoac --jar).

Chay:
    python tools/render_diagrams.py                 # render file nao doi
    python tools/render_diagrams.py --force         # render lai tat ca
    python tools/render_diagrams.py --check         # chi kiem tra, khong render
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

SRC = Path("diagrams")
OUT = Path("build/diagrams")
CACHE = OUT / ".hashes.json"
DOCKER_IMAGE = os.environ.get("PLANTUML_IMAGE", "plantuml/plantuml:latest")

# Ten participant phai la ma he thong da dang ky, khong phai ten mo ta tu do.
SYSTEMS_FILE = Path("systems.csv")
PARTICIPANT_RE = re.compile(
    r'^\s*(?:participant|actor|boundary|control|entity|database|queue|collections)\s+'
    r'(?:"([^"]+)"\s+as\s+(\S+)|(\S+))', re.MULTILINE)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def load_cache() -> dict:
    if CACHE.exists():
        try:
            return json.loads(CACHE.read_text())
        except json.JSONDecodeError:
            pass
    return {}


def known_systems() -> set:
    if not SYSTEMS_FILE.exists():
        return set()
    import csv
    with SYSTEMS_FILE.open(encoding="utf-8-sig") as f:
        return {r["ma"].strip() for r in csv.DictReader(f) if r.get("ma", "").strip()}


def check_file(path: Path, systems: set) -> list:
    """Kiem tra noi dung .puml. Tra ve danh sach canh bao."""
    warns = []
    text = path.read_text(encoding="utf-8")

    if "@startuml" not in text:
        warns.append("thiếu @startuml")
    stem = path.stem
    if not re.match(r"^(FUNC|FEAT)-[A-Z0-9\-]+_seq-\d{2}$", stem):
        warns.append(f"tên file '{stem}' không theo dạng «mã»_seq-«nn»")

    aliases = []
    for m in PARTICIPANT_RE.finditer(text):
        aliases.append(m.group(2) or m.group(3))
    if not aliases:
        warns.append("không khai báo participant nào")
    if systems:
        for a in aliases:
            if a not in systems:
                warns.append(f"participant '{a}' chưa có trong systems.csv")
    return warns


def render_docker(files: list) -> bool:
    if shutil.which("docker") is None:
        return False
    cwd = Path.cwd()
    cmd = ["docker", "run", "--rm", "-v", f"{cwd}:/work", "-w", "/work",
           DOCKER_IMAGE, "-tpng", "-o", f"/work/{OUT}"] + [str(f) for f in files]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("   Docker lỗi:", (r.stderr or r.stdout).strip()[:300])
        return False
    return True


def render_jar(files: list, jar: str) -> bool:
    if not jar or not Path(jar).exists():
        return False
    cmd = ["java", "-Djava.awt.headless=true", "-jar", jar,
           "-tpng", "-charset", "UTF-8", "-o", str(OUT.resolve())] + [str(f) for f in files]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("   PlantUML lỗi:", (r.stderr or r.stdout).strip()[:300])
        return False
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="render lại tất cả")
    ap.add_argument("--check", action="store_true", help="chỉ kiểm tra, không render")
    ap.add_argument("--jar", default=os.environ.get("PLANTUML_JAR", ""))
    args = ap.parse_args()

    if not SRC.exists():
        print(f"Không có thư mục {SRC}/ — chưa có sơ đồ nào.")
        return 0

    files = sorted(SRC.glob("*.puml"))
    if not files:
        print(f"{SRC}/ rỗng.")
        return 0

    systems = known_systems()
    if not systems:
        print("(Chưa có systems.csv — bỏ qua kiểm tra tên participant)")

    problems = 0
    for f in files:
        warns = check_file(f, systems)
        if warns:
            problems += len(warns)
            print(f"[WARN] {f.name}")
            for w in warns:
                print(f"        {w}")

    if args.check:
        print(f"\n{len(files)} sơ đồ · {problems} cảnh báo.")
        return 0

    OUT.mkdir(parents=True, exist_ok=True)
    cache = load_cache()
    todo = [f for f in files if args.force or cache.get(f.name) != sha(f)
            or not (OUT / f"{f.stem}.png").exists()]

    if not todo:
        print(f"{len(files)} sơ đồ — không có gì thay đổi.")
        return 0

    print(f"Render {len(todo)}/{len(files)} sơ đồ...")
    ok = render_docker(todo)
    how = "Docker"
    if not ok:
        ok = render_jar(todo, args.jar)
        how = "plantuml.jar"
    if not ok:
        print("\nKhông render được. Cần một trong hai:")
        print("   · Docker:  docker pull plantuml/plantuml")
        print("   · Hoặc:    export PLANTUML_JAR=/duong/dan/plantuml.jar")
        return 1

    for f in todo:
        png = OUT / f"{f.stem}.png"
        if png.exists():
            cache[f.name] = sha(f)
            print(f"   OK  {png.name}  ({png.stat().st_size // 1024} KB)")
        else:
            print(f"   ✗   {f.name} — không sinh ra PNG")
    CACHE.write_text(json.dumps(cache, indent=1, ensure_ascii=False))
    print(f"\nXong bằng {how}. Kết quả ở {OUT}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
