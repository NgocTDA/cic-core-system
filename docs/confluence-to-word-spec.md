# Confluence → Word — Đặc tả chuẩn (final)

> Tài liệu mô tả chuẩn cuối của tool **Confluence → Word (nguyên bản)** tại `/tools/confluence-to-word`.
> Cập nhật: 2026-06-19. Nguồn sự thật là code; tài liệu này tổng hợp lại để tham chiếu nhanh.

Tool chuyển **một trang Confluence** thành file Word `.docx` theo template CIC, **giữ nguyên bản** (cấu trúc, ảnh đúng vị trí) — **không qua AI**, không ép nội dung.

---

## 1. Kiến trúc luồng (v7)

Mục tiêu cốt lõi: **preview = đúng file tải về** (cùng 1 binary DOCX).

```
Người dùng nhập link/pageId
  → POST /api/confluence/docx            → tạo DOCX 1 lần, lưu cache server → { fileId, title, filename }
  → GET  /api/confluence/docx?fileId=…   → trả đúng binary đó (cho docx-preview render)
  → GET  /api/confluence/docx?fileId=…&download=1  → trả binary (Content-Disposition attachment)
```

- **Engine DUY NHẤT:** Pandoc, chỉ sinh `--to docx` (KHÔNG dùng `--to html5` cho preview).
- **Cache:** in-memory `Map` (`docxStore`), TTL **30 phút**, dọn entry hết hạn mỗi lần POST.
- **Preview:** thư viện `docx-preview` render blob DOCX lấy từ GET → đảm bảo trùng khít file tải về.
- Trình duyệt không render trực tiếp `.docx`; muốn "preview = file" buộc phải render chính binary đã tạo.

> ⚠️ **Gotcha docx-preview:** render SAI table conditional formatting (`tblStylePr`/`firstRow`) — gắn
> class `first-row` ở cấp `<table>` nhưng CSS selector là `tr.first-row td` → format **leak ra cả bảng**.
> → **Nguyên tắc:** KHÔNG dùng conditional formatting; luôn **direct formatting** thẳng vào `document.xml`.

---

## 2. Pipeline xử lý HTML (thứ tự quan trọng)

Trong `POST` của [route.ts](../frontend/app/api/confluence/docx/route.ts):

| # | Bước | Hàm | Vai trò |
|---|------|-----|---------|
| 1 | Lấy HTML | `body.export_view` (fallback `body.view`) | HTML sạch nhất, ảnh full-res |
| 2 | `liftImageWrappers` | unwrap `<p><img></p>` để ảnh không bị bọc thừa |
| 3 | `ensureTableHead` | dòng đầu toàn `<th>` → bọc `<thead>` (Pandoc mới sinh `tblHeader` lặp header qua trang) |
| 4 | `normalizeHeadings` | chuẩn hoá cấp heading |
| 5 | `annotateTableImages` | đọc `<col>` width → gắn `data-maxw` cho ảnh trong ô (cap bề rộng ảnh theo cột) |
| 6 | `stripTableWidths` | xoá width của **`<td>/<th>`/`<col>`** (GIỮ `width` của `<table>`) → Pandoc autofit |
| 7 | `inlineImages` | tải ảnh về base64 nhúng thẳng (Bearer chỉ ở server) |
| 8 | `buildFullHtml` | thêm trang bìa (cover) + ngắt trang |
| 9 | `runPandoc` | Pandoc → DOCX |
| 10 | `patchDocxTableAutofit` | hậu xử lý OOXML (mục 4) |

**Lưu ý thứ tự:** `annotateTableImages` phải chạy **trước** `stripTableWidths` (nó cần `<col>` width để tính `data-maxw`). Sau khi strip, `inlineImages` đọc `data-maxw` (độc lập `<col>`) nên vẫn đúng.

Giới hạn ảnh: tối đa **50 ảnh** / **30 MB** tổng; cap bề rộng ảnh `CONTENT_PX = 605px`.

---

## 3. Lệnh Pandoc

```
pandoc --from=html --to=docx --standalone -o -
       --reference-doc=config/cic-reference.docx
       --lua-filter=config/pagebreak.lua
```

- `cic-reference.docx`: template style CIC (mục 5). Gitignored (live); bản committed = `cic-reference.example.docx`.
- `pagebreak.lua`: đổi `<div class="page-break">` → raw OOXML `<w:br w:type="page"/>` (Pandoc bỏ qua CSS page-break).

---

## 4. Hậu xử lý OOXML — `patchDocxTableAutofit`

Giải nén ZIP DOCX (thuần `node:zlib`, không thêm dependency), patch `word/document.xml`, đóng lại.

**4a. Mỗi bảng (cặp `tblPr` + `tblGrid`):**
- `tblW` → `pct 5000` (**100% bề rộng trang**).
- `tblLayout` → `autofit` (**override cả `fixed`** Pandoc sinh ra → Word tự co cột vừa trang, không tràn margin).
- `tblGrid`: nếu tổng > `TABLE_MAX_TWIPS = 9355` → **rescale** tỉ lệ cho vừa trang (giúp cả docx-preview).

**4b. Header row (mỗi `<w:tr>` có `<w:tblHeader>`):** direct formatting
- **Căn giữa ngang:** thêm/đổi `<w:jc w:val="center"/>` trong `pPr`.
- **Căn giữa dọc:** thêm `<w:vAlign w:val="center"/>` trong `tcPr`.
- **In đậm:** đã có sẵn từ Pandoc (header cell bold).
- Chỉ áp cho **bảng có dòng header thật**; bảng key-value (label ở cột đầu) không bị căn giữa lan.

`TABLE_MAX_TWIPS = 9355` = A4 (11906) − lề trái (1417) − lề phải (1134).

---

## 5. Template `cic-reference.docx` — [build_cic_reference.py](../frontend/build_cic_reference.py)

Sinh từ Pandoc default reference + ghép visual CIC. Chạy lại: `cd frontend && python build_cic_reference.py`
→ ghi `config/cic-reference.docx` + `config/cic-reference.example.docx`.

### 5.1 Trang
- Khổ **A4** dọc (11906 × 16838 twips).
- Lề: trên/phải/dưới **2cm** (1134), trái **2.5cm** (1417); header/footer 708.
- Header/Footer CIC: copy nguyên từ `srs-template.docx`.

### 5.2 Font — **Times New Roman toàn bộ**
Đặt **explicit** ở `docDefaults`, `Normal`, Heading 1/2/3, Cover styles, **và `theme1.xml`** (major/minor latin + script `Viet`) — để Word lẫn docx-preview hiển thị đồng nhất, không phụ thuộc theme font Aptos (docx-preview resolve sai → preview lộn xộn).
- Code block (`VerbatimChar`) giữ **Consolas** (monospace, render giống nhau mọi nơi).

### 5.3 Cỡ & màu chữ
| Style | Cỡ | Màu | Đậm |
|-------|----|-----|-----|
| Body (Normal) | 11pt (sz 22) | `#1A1A1A` | — |
| Heading 1 | 16pt (32) | `#2E74B5` | ✓ |
| Heading 2 | 13pt (26) | `#2E74B5` | ✓ |
| Heading 3 | 12pt (24) | `#1F4D78` | ✓ |

### 5.4 Giãn dòng & spacing
- **Tất cả style text:** line spacing **Single** (`line=240`, `lineRule=auto`), **Before = After = 6pt** (120 twips).
- Áp cho `docDefaults` (pPrDefault) + Heading 1/2/3.
- **Ngoại lệ:** Cover styles giữ spacing lớn (`before` 2000–2400) vì là định vị layout trang bìa, không phải text thường.

### 5.5 Trang bìa (cover)
3 custom-style (chỉ áp khi `--to docx`): `Cover Org` (14pt `#1F4D78`), `Cover Title` (26pt `#2E74B5`), `Cover Meta` (12pt `#595959`) — đều căn giữa.

### 5.6 Bảng (style "Table", default)
- **Border:** đủ 6 cạnh, single, sz=4 (≈0.5pt), màu **`#83CAEB`** (`TABLE_BORDER_COLOR`).
- **Layout:** autofit (chốt lại ở mục 4 qua post-process).
- **KHÔNG** dùng conditional `firstRow` (đã gỡ) — header format bằng direct formatting ở route.ts.

---

## 6. Tên file tải về
- Dạng: `{pageId} - {title}.docx`.
- Tiếng Việt → **không dấu** (`removeVietnameseDiacritics`: NFD + bỏ dấu tổ hợp + đ/Đ→d/D).
- `Content-Disposition` theo RFC 5987: `filename="<ascii>"; filename*=UTF-8''<encoded>`.

---

## 7. Bảo mật
- **PAT (Bearer token) chỉ ở server** — không bao giờ lộ ra browser.
- `config/confluence.json` (baseUrl + PAT) **gitignored**.
- `config/cic-reference.docx` (live template) **gitignored**; bản committed = `.example.docx`.
- PAT cá nhân của user lưu ở `localStorage` trình duyệt (gửi kèm POST, server dùng rồi thôi).

---

## 8. Bản đồ file
| File | Vai trò |
|------|---------|
| [app/api/confluence/docx/route.ts](../frontend/app/api/confluence/docx/route.ts) | API POST/GET, pipeline, Pandoc, post-process, cache |
| [build_cic_reference.py](../frontend/build_cic_reference.py) | Sinh template `cic-reference.docx` |
| [config/pagebreak.lua](../frontend/config/pagebreak.lua) | Lua filter ngắt trang |
| [src/modules/tools/ConfluenceToWord/index.tsx](../frontend/src/modules/tools/ConfluenceToWord/index.tsx) | UI: nhập link/PAT, nút tải |
| [src/modules/tools/ConfluenceToWord/DocxBlobPreview.tsx](../frontend/src/modules/tools/ConfluenceToWord/DocxBlobPreview.tsx) | Preview qua `docx-preview` |
| [src/services/aiService.ts](../frontend/src/services/aiService.ts) | `fetchConfluenceDocx`, `fetchCachedDocxBlob` |

> Đừng nhầm: UIDocGenerator dùng `/api/ai/docx` + `fetchDocxBlob(doc,…)` — luồng riêng, khác tool này.

---

## 9. Nguyên tắc bảo trì
1. **Direct formatting > conditional formatting** (docx-preview render sai conditional).
2. Mọi giá trị visual của template chỉ sửa trong `build_cic_reference.py`, rồi rebuild — không hardcode rải rác.
3. Sửa xong: `npx tsc --noEmit` (0 lỗi) + convert thử 1 trang có bảng/heading/ảnh, đối chiếu preview với file tải về.
4. Bảng: luôn kiểm tra không tràn margin (grid ≤ 9355 twips, layout autofit, tblW pct 100%).
