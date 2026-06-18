# Confluence Importer — Thiết kế đợt 2 (deferred)

> Trạng thái: **đã chốt thiết kế, chưa triển khai.** Tool đợt 1 (`/tools/confluence-importer`) đã chạy:
> kéo page → markdown + ảnh attachment → AI (prompt `confluence` trung thực) → DocData → fill template Word.
> Hạn chế hiện tại: chỉ nhúng **1 ảnh** (ô mockup); ảnh khác bị bỏ; mỗi lần Confluence sửa phải kéo + sinh lại từ đầu.

---

## 1. Ảnh ngoài + marker vị trí

**Mục tiêu:** giữ được **vị trí** từng ảnh trong nội dung, theo **tên ảnh**, cho cả ảnh attachment lẫn ảnh ngoài.

- Trong `app/api/confluence/page/route.ts`, đổi rule `<img>` của turndown: thay vì xoá → chèn marker `[[IMG: <tên>]]` ngay vị trí ảnh.
- Lấy tên: ưu tiên `data-linked-resource-default-alias`, fallback basename của `src`/`data-image-src`. Tên này **khớp `title`** của attachment → map 1-1 tin cậy.
- **Ảnh ngoài** (`src` http(s) không phải `/download/...`): server `fetch` về, đặt tên (basename URL hoặc `ext-img-N.ext`), thêm vào `images[]` và đánh dấu như ảnh thường.
- Caveat: **thumbnail** (`/download/thumbnails/...`) → lấy bản full từ attachment; **tên trùng** → thêm chỉ số `[[IMG: a.png#2]]`; ảnh ngoài lỗi mạng → bỏ tải nhưng vẫn giữ marker; cap số ảnh + dung lượng.

## 2. Cache + version + diff (đồng bộ lại nhanh)

**Mục tiêu:** Confluence sửa → cập nhật Word dễ, không làm lại từ đầu, thấy rõ điểm khác.

- **Phát hiện thay đổi:** dùng `version.number` (+ `version.when`) của page (Confluence tự tăng mỗi lần sửa). Chỉ cần `GET content/{id}?expand=version` để so, không kéo full.
- **Snapshot per-page:** lưu `{ pageId, title, version, fetchedAt, markdown, doc }`.
- **Luồng đồng bộ:** nhập pageId → thấy cache ("đã kéo version X") → "Kiểm tra cập nhật": bằng → *Không đổi*; mới hơn → kéo full → **diff markdown** (lib `diff`/jsdiff, thêm/bớt) → user xem → "Sinh lại" → Word mới → lưu snapshot mới.
- **Lưu ở đâu:** chưa có DB → file JSON server-side. **Lưu ý:** `config/` đang mount `:ro` trong Docker → cần **volume ghi được riêng** (vd `cache/` mount `rw`), hoặc chuyển sang DB khi có.
- **Caveat:** nếu user đã **sửa tay markdown** rồi page đổi → kéo lại sẽ đè → bản đầu chỉ **cảnh báo ghi đè**; merge 3-way để sau.
- Thư viện: `diff` (jsdiff, MIT).

## 3. Confluence → Word "trung thực" (✅ ĐÃ TRIỂN KHAI — tool riêng `/tools/confluence-to-word`)

> Triển khai 2026-06-18: tool **riêng** (song song, không thay luồng template). Engine **html-to-docx** (thuần JS, không sửa Docker).
> Ảnh: thay vì marker `[[IMG:]]` (mục 1), **nhúng base64 thẳng vào HTML tại đúng vị trí `<img>`** trước khi convert → ảnh đúng chỗ tự nhiên.
> File: `app/api/confluence/docx/route.ts` + helper dùng chung `app/api/confluence/confluenceClient.ts` + module `modules/tools/ConfluenceToWord`.
> Phạm vi đợt này: one-shot (chưa cache/version/diff — vẫn để mục 2 cho sau).

**Mục tiêu:** tái tạo trang gần nguyên bản, **ảnh đúng vị trí**, không ép vào template SRS cứng.

- Convert `body.view` HTML (ảnh inline dạng base64) → DOCX trực tiếp (lib `html-to-docx`, hoặc LibreOffice convert). Ảnh đặt đúng marker `[[IMG: tên]]` ở mục 1.
- Bỏ schema SRS cố định; có thể bọc header/footer CIC tối thiểu.
- Đây là **chế độ khác** với luồng "fill template" hiện tại (không thay thế — bổ sung). Quyết định lúc build: thay thế hay song song; mức độ giữ định dạng CIC.

### Phương án ảnh nhiều vị trí (đã cân nhắc)
- **Gallery** (gom tất cả ảnh vào 1 phụ lục) — giữ template, nhanh, nhưng mất vị trí. *(Có thể làm interim.)*
- **AI gán ảnh vào section** — phức tạp, dễ sai. *(Không ưu tiên.)*
- **Faithful conversion** (mục 3) — ảnh đúng vị trí. *(Hướng chính cho tương lai.)*

---

## 4. Luồng UI (v2)

Bố cục: trái = nguồn & điều khiển, phải = `DocResultPanel` (3 tab + tải) như v1.

**A. Nhập mới**
1. Ô "Link/Page ID" + nút "Kéo dữ liệu".
2. Khi gõ pageId đã nhập trước → badge "Đã nhập: version X · <thời điểm>" (từ cache).

**B. Sau khi kéo (có dữ liệu)**
- Header: tiêu đề page · version · thời điểm kéo.
- Markdown sửa được, có marker `[[IMG: tên]]` đúng vị trí.
- Khu ảnh: thumbnail + tên; (tùy chọn) click marker ↔ sáng ảnh.
- Toggle **Chế độ xuất**: ⦿ Điền template SRS (qua AI) / ○ Bản trung thực (Confluence→Word).
- Chọn AI Provider (chỉ cho chế độ template) + tag nhãn prompt.
- Nút "Sinh tài liệu" → kết quả ở `DocResultPanel`.

**C. Đồng bộ lại (page đã nhập trước)**
1. "Kiểm tra cập nhật" → so `version`: không đổi → toast "Không thay đổi"; có đổi → mở panel **diff markdown** (cũ ↔ mới, +/−, tóm tắt).
2. Nếu đã sửa tay markdown → cảnh báo "sẽ ghi đè" + chọn Giữ bản sửa / Lấy bản mới.
3. "Cập nhật & sinh lại" → markdown mới → sinh lại Word.

**D. Lịch sử (tùy chọn, từ cache)**
- Drawer/list page đã nhập: tên · version · lần đồng bộ cuối · nút Mở lại / Đồng bộ.

**Khác cốt lõi so với v1:** nhận diện page+version, diff khi đổi, toggle chế độ xuất, cảnh báo ghi đè bản sửa tay, lịch sử tài liệu.

## File dự kiến chạm khi build
- `app/api/confluence/page/route.ts` — marker `[[IMG:]]` + tải ảnh ngoài + trả `version`.
- Module cache mới + volume `cache/` (docker-compose) hoặc DB.
- `package.json` — `diff` (jsdiff), `html-to-docx` (nếu làm mục 3).
- `ConfluenceImporter/index.tsx` — UI: nút "Kiểm tra cập nhật" + xem diff + cảnh báo ghi đè.
- (Mục 3) route mới `app/api/confluence/to-docx` + lib convert.

## Lưu trữ: KHÔNG bắt buộc DB
v2 dùng **file-based cache** là đủ: `cache/confluence/{pageId}.json` ({version,title,fetchedAt,markdown,doc}) + ảnh lưu file nhị phân (không nhét base64 vào JSON). Cần **volume ghi được** (config đang `:ro`):
`- ./frontend/cache:/app/cache` (rw). Bọc sau interface `getSnapshot/saveSnapshot/listSnapshots` để sau đổi sang DB dễ.
**Chỉ cần DB** khi: nhiều người dùng đồng thời (tránh race ghi file), audit/lịch sử per-user gắn auth thật, tra cứu/lọc nhiều tài liệu, số lượng lớn.

## Quyết định còn mở (chốt lúc build)
1. Lưu cache: file JSON (+volume rw) — mặc định; nâng lên DB khi đa người dùng/audit.
2. Xử lý markdown user đã sửa khi re-sync: cảnh báo đè / giữ bản sửa / merge.
3. Confluence→Word trung thực: thay thế hay chạy song song luồng template?
