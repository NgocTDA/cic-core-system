# Chuẩn hóa tài liệu — Thiết kế (v2)

> Công cụ `/tools/doc-standardizer`: đọc một trang Confluence viết tự do, ánh xạ vào
> **đề cương đặc tả chức năng v3.0**, rồi ghi lại lên Confluence **và** xuất bản trung gian
> cho pipeline SRS (`docs/srs-pipeline/`) dựng ra `functions/*.docx` đạt `validate_child.py`.
>
> Trạng thái: **đang triển khai**. Cập nhật: 2026-07-30.
> Nguồn sự thật về đề cương là `srs/tools/outline.py` — tài liệu này KHÔNG mô tả lại đề cương.

---

## 1. Vai trò trong pipeline

Pipeline SRS hiện có một chỗ trống: README §8 mô tả việc chuẩn hóa nội dung Confluence là
**thủ công** (mở trang → dán `CHILD_TEMPLATE_<LOẠI>.md` → điền nội dung cũ vào đúng ô), và
sau đó **không có đường nào** đưa nội dung đó thành `functions/*.docx`. BA phải copy tay sang
Word rồi chạy `clean_child.py` để dọn style rác.

Công cụ này lấp đúng chỗ đó:

```
Trang Confluence cũ (viết tự do)
   └→ [Web tool] phân loại + ánh xạ vào đề cương + validate cấu trúc
        ├→ ghi lại trang Confluence theo đúng CHILD_TEMPLATE_<LOẠI>
        └→ xuất FUNC-XXX-000.zip
              └→ [tools/import_json.py] đổ vào CHILD_TEMPLATE_<LOẠI>.docx
                    → functions/FUNC-XXX-000.docx → validate_child.py → Git → merge.py
```

Làm được nhánh dưới thì `clean_child.py` gần như không còn cần dùng — file sinh ra từ
template nên không bao giờ mang style lạ.

---

## 2. Hai hợp đồng JSON

Toàn bộ thiết kế quy về việc chốt đúng 2 file JSON. Chốt đúng thì phần còn lại là việc
thẳng; chốt sai thì sửa rất đắt.

```
repo srs/                                    repo cic-core-system/
  outline.py ──export_outline_json.py──►  outline.json  ──► web tool
                                                              │
  import_json.py ◄──────── FUNC-XXX-000.zip ◄────────────────┘
```

### 2.1 `outline.json` — đề cương (srs → web)

**Sinh máy, không viết tay.** `outline.py` là nguồn sự thật duy nhất về đề cương; viết tay
một bản JSON song song là tạo nguồn thứ hai, và nó *sẽ* lệch — đúng vấn đề mà cả pipeline
này đang giải (README §7).

`tools/export_outline_json.py` là **consumer thứ tư** của `outline.py`:

```
tools/outline.py
   ├── make_child_template.py       → CHILD_TEMPLATE_<LOẠI>.docx
   ├── make_child_template_md.py    → CHILD_TEMPLATE_<LOẠI>.md
   ├── validate_child.py            → luật kiểm tra
   └── export_outline_json.py  ★    → outline.json → web tool
```

```jsonc
{
  "schema": "cic-srs-outline/1",
  "outlineVersion": "3.0",
  "generatedAt": "2026-07-30T00:00:00Z",
  "usable": 9355,
  "baseProfiles": ["UI", "TICHHOP", "JOB", "PHANTICH"],   // DANHMUC là biến thể của UI
  "codeRules": {
    "func": { "pattern": "^FUNC-[A-Z0-9]+-\\d{3}$", "form": "FUNC-«NHÓM»-«3 số»", "example": "FUNC-NSD-001" },
    "feat": { … }, "br": { … }, "msg": { … }, "seq": { … }
  },
  "featureTitle": "Tính năng [MÃ_TÍNH_NĂNG] «Tên tính năng»",
  "guidance": [ "…" ],
  "profiles": {
    "UI": {
      "ten": "Chức năng / Tính năng có giao diện",
      "requireDiagram": false,
      "variantOf": null,
      "before":   [ { "name": "Mô tả chung", "note": "…",
                      "tables": [ { "headers": ["Hạng mục","Nội dung"], "widths": [2400,6955],
                                    "labels": ["Loại chức năng", "…"] } ] } ],
      "features": [ { "name": "Luồng xử lý",
                      "tables": [ { "label": "Luồng chính", "headers": […], "widths": […], "rows": 4 } ] } ],
      "after":    [ … ]
    }
  }
}
```

- `labels` có nghĩa: bảng key-value, cột đầu cố định — web render thành hàng nhãn chỉ đọc.
- `rows` là số hàng gợi ý của template rỗng, không phải ràng buộc.
- `note_md` (nếu có) ghi đè `note` khi hiển thị cho luồng Confluence.

**Chống drift:** CI của repo srs chạy lại `export_outline_json.py` và **fail nếu kết quả khác
file đã commit**. Đây là cơ chế duy nhất đảm bảo web tool không dùng đề cương cũ.
Web tool hiển thị `outlineVersion` trên UI để lệch là thấy ngay.

### 2.2 `FUNC-XXX-000.zip` — nội dung 1 chức năng (web → srs)

```
FUNC-XTH-001.zip
├── func.json
├── images/FEAT-XTH-001-01_man-hinh-dang-nhap.png
└── diagrams/FUNC-XTH-001_seq-01.puml        (nếu có nháp)
```

```jsonc
// func.json
{
  "schema": "cic-srs-func/1",
  "outlineVersion": "3.0",
  "profile": "UI",
  "ma": "FUNC-XTH-001", "ten": "Đăng nhập",
  "nhom": "GRP-XTH", "tenNhom": "Đăng nhập, đăng xuất", "owner": "ngoc.tda",
  "source": { "pageId": "12345", "url": "…", "version": 7, "fetchedAt": "…" },
  "before":  [ { "name": "Mô tả chung",
                 "blocks": [ { "type": "table", "headers": [ … ], "rows": [ [ … ] ] } ] } ],
  "features": [ { "ma": "FEAT-XTH-001-01", "ten": "Đăng nhập bằng tài khoản nội bộ",
                  "sections": [ { "name": "Mô tả yêu cầu",
                                  "blocks": [ { "type": "para", "text": "…" } ] } ] } ],
  "after":   [ … ]
}
```

`block.type` ∈ `para | bullet | table | image | diagram`. Ánh xạ 1-1 sang 6 style được phép
của Style Contract — không block nào cần style ngoài danh sách:

| block | style Word |
|---|---|
| `para` | `T-NoiDung` |
| `bullet` level 1 / 2 | `T-Gach -` / `T-Gach +` |
| `table` | `TableStyle3` |
| `image` | inline picture + caption trường SEQ |
| `diagram` | giữ nguyên `[[DIAGRAM: mã_seq-nn]]`, `merge.py` xử lý |

---

## 3. Mô hình dữ liệu phía web

Đề cương có khối "Tính năng" **nhân bản n lần**, mỗi khối 5–9 mục H5 tùy loại — nên mô hình
phẳng không dùng được:

```ts
interface FuncDoc {
  profile: 'UI' | 'TICHHOP' | 'JOB' | 'PHANTICH' | 'DANHMUC';
  ma: string; ten: string;
  before:   Section[];                                          // 6 mục H4
  features: { ma: string; ten: string; sections: Section[] }[]; // lặp n lần
  after:    Section[];                                          // 3 mục H4
}
```

---

## 4. Giới hạn vai trò của AI

Pipeline này cố ý deterministic. AI chỉ làm 3 việc:

1. **Đoán `profile`** từ nội dung trang cũ — gợi ý, BA xác nhận, không tự quyết.
2. **Ánh xạ** đoạn/bảng cũ vào đúng mục đề cương — việc tay tốn thời gian nhất ở §8 README.
3. **Tách/gộp bảng cũ** về đúng bộ cột chuẩn của đề cương.

AI **không** được: sinh mã `FUNC/FEAT/BR/thông báo` (sinh bằng code, như `new_function.py`),
viết nội dung mới cho mục trống (Style Contract §H bắt ghi "Không áp dụng"), đặt tên
participant sơ đồ (phải lấy từ `systems.csv`).

### Chống mất nội dung — `sourceRefs`

Mỗi block markdown nguồn được gán id; AI bắt buộc trả `sourceRefs: [id]` cho mỗi block đích.
Block nguồn nào không được ai tham chiếu → nổi lên panel **"Đoạn nguồn chưa dùng"** để BA
kéo vào. Rẻ hơn và bắt lỗi thật tốt hơn một tab diff thô.

---

## 5. Ảnh và sơ đồ — hai đường khác nhau

| Loại | Xử lý |
|---|---|
| **Ảnh mockup** (mục *Thiết kế giao diện*) | Marker `[[IMG: tên]]` giữ đúng vị trí. Tool tự đổi tên attachment theo mã tính năng (`FEAT-…png`) theo `note_md`, cảnh báo nếu tên cũ sai quy ước. Ghi lên Confluence: `<ac:image><ri:attachment/></ac:image>` |
| **Sơ đồ trình tự** | **Không nhúng lại ảnh.** Phải thành `[[DIAGRAM: mã_seq-nn]]` + file `.puml`. Tool phát hiện "ảnh trông như sơ đồ" và cảnh báo, không tự nhúng. TICHHOP/JOB thiếu placeholder → ERROR. |

⚠️ Trang **con** không thấy attachment của trang cha → dùng tham chiếu chéo
`<ri:attachment ri:filename="x.png"><ri:page ri:content-title="…" ri:space-key="…"/></ri:attachment>`
thay vì upload lại; chỉ fallback sang copy attachment (multipart) nếu tham chiếu chéo lỗi.

---

## 6. Validate — chia đôi theo năng lực

**Chạy được ở web** (luật sinh từ `outline.json`, ~70% của `validate_child.py`): đủ mục H4/H5
theo loại · không lẫn mục loại khác · mỗi khối Tính năng đủ mục con · ma trận phân quyền phủ
hết mã tính năng · regex `BR-…`/`ERR_…` · còn placeholder `«…»` · *Vấn đề còn mở* phải rỗng ·
TICHHOP/JOB phải có `[[DIAGRAM:]]`.

**Không chạy được và không cần** (chỉ phát sinh khi đã ở Word — để `validate_child.py` giữ):
tên style · định dạng trực tiếp · `sectPr` · trường SEQ · ngắt trang thủ công.

Không viết lại luật bằng tay ở TS: regex lấy từ `outline.json.codeRules`, danh sách mục lấy
từ `outline.json.profiles`.

---

## 7. Luồng UI — wizard 4 bước

| Bước | Nội dung |
|---|---|
| **1 · Nguồn** | PAT + link → kéo trang. Trả markdown (có marker `[[IMG:]]`), ảnh, `version`, `spaceKey`. |
| **2 · Nhận diện** | AI đoán profile + mã/tên chức năng + danh sách tính năng → BA xác nhận. Đối chiếu `manifest.csv`: mã đã tồn tại? chưa đăng ký? `loai` có khớp profile AI đoán? |
| **3 · Ánh xạ** | Trái: cây H4/H5 đúng đề cương, mỗi mục sửa tại chỗ (bảng = Table editable đúng bộ cột chuẩn). Phải: panel "Đoạn nguồn chưa dùng". |
| **4 · Kiểm & Xuất** | Bảng ERROR/WARN. Ba lối ra: `Ghi lên Confluence` (trang con / ghi đè) · `Tải .zip cho pipeline` · `Copy markdown`. |

Ghi đè trang gốc: mặc định **tắt**; phải qua modal xác nhận, và server kiểm `version.number`
khớp `baseVersion` — lệch thì trả **409** ("trang đã đổi từ lúc bạn kéo").

---

## 8. Phase

| Phase | Nội dung | Repo |
|---|---|---|
| **A1** | `tools/export_outline_json.py` → `outline.json` + CI job chống drift | srs |
| **B3** | `frontend/config/outline.json` + loader + `GET /api/srs/outline` | web |
| **A2** | Tách `tools/childdoc.py` từ `new_function.py` (dùng chung) | srs |
| **A3** | `tools/import_json.py <zip>` → docx + validate + manifest | srs |
| **A4** | Dọn lệch tài liệu pipeline (mục 10) | srs |
| **B1** | Tách `app/api/ai/callProvider.ts` từ `generate/route.ts` | web |
| **B2** | `/api/confluence/page`: cờ `imageMarkers`, trả `version`/`spaceKey`/`attachments` | web |
| **C** | Prompt `standardize` sinh động từ `outline.json` · `/api/srs/classify` · `/api/srs/map` · `validateFuncDoc.ts` | web |
| **D** | Wizard 4 bước, `modules/tools/DocStandardizer/` | web |
| **E** | `renderStorage.ts` + `/api/confluence/publish` · `/api/srs/export` (.zip) | web |
| **F** | `docs/doc-standardizer-spec.md`, menu, navigation | web |

**A1 + B3 chốt hợp đồng 1; A2 + A3 chốt hợp đồng 2.** Làm xong hai cái đó mới nên đụng UI.

**A3 là phần khó nhất**, hai chỗ cụ thể:
- *Nhân bản khối Tính năng*: phải `deepcopy` cụm XML (H4 + các H5 + bảng) rồi thay mã/tên —
  `python-docx` không có API.
- *Caption trường SEQ*: cũng không có API, phải dựng `OxmlElement` field code — nhưng
  `merge.py` **đã làm** khi chèn ảnh sơ đồ; tái dùng, đừng viết lại.

→ Prototype A3 trên 1 file demo **trước khi** động vào UI web. Nếu A3 không chạy được thì cả
nhánh "xuất sang Git" vô nghĩa, và tốt hơn là biết sớm.

---

## 9. Quyết định đã loại bỏ

| Bỏ | Thay bằng | Lý do |
|---|---|---|
| `config/doc-templates/*.json` viết tay | `outline.json` sinh máy | Tránh nguồn sự thật thứ hai về đề cương |
| `StdDoc` phẳng | `FuncDoc` có `features[]` lặp | Đề cương có khối Tính năng nhân bản |
| Web sinh `.docx` bằng Pandoc | `import_json.py` phía Python | Pandoc không tạo được `Heading 3/4/5` + `T-NoiDung` + `TableStyle3` + cột 9355 twips |
| Tab "Đối chiếu nguồn ↔ kết quả" | Panel "Đoạn nguồn chưa dùng" (`sourceRefs`) | Bắt được nội dung bị bỏ rơi, không chỉ hiển thị cạnh nhau |

**Ranh giới:** TS lo AI + Confluence; Python lo Word.

---

## 10. Lệch trong bộ tài liệu pipeline — cần chốt (A4)

| Chỗ | Vấn đề |
|---|---|
| `outline.py` `PROFILE_ORDER` | Note của *Mô tả chung* ghi "điền đúng một trong UI / TICHHOP / JOB / PHANTICH" — **thiếu `DANHMUC`**, trong khi `profile_of_name()` chấp nhận nó và `manifest.csv` đang dùng. Validator lại báo lỗi theo `ALL_PROFILES` (5 giá trị) → hai thông điệp đá nhau. **Ưu tiên cao nhất** vì nó chui thẳng vào `outline.json` rồi vào prompt AI. |
| `STYLE_CONTRACT.md` checklist | "Bảng *Mô tả chung* đã điền đủ **13** dòng" — `MO_TA_CHUNG_LABELS` có **14** nhãn. |
| `STYLE_CONTRACT.md` §H | Nói "đề cương v2.0"; `make_child_template_md.py` nói v2.1; README/`outline.py` nói **v3.0**. |
| `README.md` §1 | Nói "`functions/` hiện đang chứa 4 file demo" và nhắc `FUNC-NSD-002_Phan-quyen.docx` là file cố tình sai — thực tế có **5** file và không có file NSD-002 nào. |

---

## 11. Bản đồ file (cập nhật dần khi triển khai)

| File | Vai trò | Trạng thái |
|---|---|---|
| `srs/tools/export_outline_json.py` | Sinh `outline.json` từ `outline.py` | ✅ |
| `srs/outline.json` | Hợp đồng 1 (bản gốc trong repo srs) | ✅ |
| `srs/.gitlab-ci.yml` job `outline_json` | Chặn drift giữa `outline.py` và `outline.json` | ✅ |
| `frontend/config/outline.json` | Bản web tool đọc lúc chạy (commit, không sửa tay) | ✅ |
| `frontend/src/types/srs.ts` | Types dùng chung server + client | ✅ |
| `frontend/app/api/srs/outlineConfig.ts` | Loader (cache mtime, kiểm schema + danh sách loại) | ✅ |
| `frontend/app/api/srs/outline/route.ts` | `GET` — `?meta=1` / `?profile=` / đầy đủ | ✅ |
| `frontend/src/services/srsService.ts` | Client fetch | ✅ |
| `frontend/src/modules/tools/SrsOutline/` | Trang chỉ đọc xem đề cương (`/tools/srs-outline`) | ✅ |
| `srs/tools/childdoc.py` | Hàm dùng chung tách từ `new_function.py` | ⬜ |
| `srs/tools/import_json.py` | Hợp đồng 2 → `functions/*.docx` | ⬜ |
| `frontend/src/modules/tools/DocStandardizer/` | UI wizard 4 bước | ⬜ |

---

## 12. Chạy thử cục bộ — cạm bẫy `npm start`

`next.config` dùng `output: 'standalone'`, nên **`npm run start` KHÔNG phục vụ đúng**: phần
lớn trang trả 404 (Next chỉ in một dòng cảnh báo rồi vẫn chạy). Cách đúng:

```bash
cd frontend && npm run build
cp -r .next/static .next/standalone/.next/static     # standalone không tự copy
cp -r public       .next/standalone/public           # nếu có
node .next/standalone/server.js
```

`config/` đã được đóng gói sẵn vào `.next/standalone/config/` nên `outline.json` có mặt.
Trong Docker thì `docker-compose` mount `./frontend/config:/app/config:ro`, và
`process.cwd()` của standalone = `/app` → đường dẫn khớp.

Dev thường (`npm run dev`) không có vấn đề này.
