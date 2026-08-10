#!/usr/bin/env bash
# Kết xuất toàn bộ sơ đồ PlantUML trong thư mục này ra PNG và SVG.
#
# Yêu cầu: máy chủ PlantUML (Docker) đang chạy.
#   Mặc định: http://localhost:8787
#   Đổi bằng biến môi trường:  PLANTUML_URL=http://10.16.17.7:8787 ./render.sh
#
# LƯU Ý QUAN TRỌNG — bắt buộc gửi kèm "Content-Type: text/plain; charset=UTF-8".
# Thiếu tham số này thì máy chủ đọc thân yêu cầu bằng ISO-8859-1 và toàn bộ
# dấu tiếng Việt bị vỡ thành ký tự lạ (Quản lý → QuáºÊn lÃ½).

set -u
cd "$(dirname "$0")"

URL="${PLANTUML_URL:-http://localhost:8787}"
fail=0

if ! curl -s -o /dev/null --max-time 5 "$URL/"; then
  echo "Không kết nối được máy chủ PlantUML tại $URL"
  echo "Kiểm tra container Docker đã chạy chưa, hoặc đặt lại PLANTUML_URL."
  exit 1
fi

for f in *.puml; do
  base="${f%.puml}"

  for fmt in png svg; do
    err=$(curl -s -D - -o "$base.$fmt" \
            -H "Content-Type: text/plain; charset=UTF-8" \
            -X POST --data-binary @"$f" "$URL/$fmt" \
          | grep -i "X-PlantUML-Diagram-Error" || true)
    if [ -n "$err" ]; then
      echo "LỖI  $base.$fmt :: $err"
      fail=1
    fi
  done

  [ $fail -eq 0 ] && printf "  ok  %-32s png %7s B   svg %7s B\n" \
      "$base" "$(stat -c%s "$base.png")" "$(stat -c%s "$base.svg")"
done

echo "---"
if [ $fail -eq 0 ]; then
  echo "Kết xuất xong toàn bộ sơ đồ, không có lỗi cú pháp."
else
  echo "Có sơ đồ lỗi cú pháp — xem danh sách bên trên."
  exit 1
fi
