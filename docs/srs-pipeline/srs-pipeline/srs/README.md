# SRS CIC_CORE — Quy trình soạn thảo & ráp tài liệu

Tài liệu tổng thể là **sản phẩm build**, không phải file nguồn.
Không ai được mở `build/SRS_*.docx` ra sửa tay. Mọi thay đổi đều đi qua file nguồn.

---

## 1. Cấu trúc repo

```
00_master_head.docx        Bìa → hết mục "ĐẶC TẢ CHI TIẾT YÊU CẦU"   [Lead BA sở hữu]
90_master_tail.docx        Yêu cầu phi chức năng + Phụ lục            [Lead BA sở hữu]
manifest.csv               Danh mục chức năng: thứ tự, nhóm, owner, trạng thái
outline.json               Đề cương dạng JSON — SINH RA từ outline.py, không sửa tay
functions/                 Mỗi chức năng 1 file .docx, 1 chủ sở hữu duy nhất
systems.csv                Danh mục mã hệ thống / đơn vị — dùng kiểm tra participant sơ đồ
diagrams/                  Sơ đồ PlantUML dạng mã nguồn (*.puml)
templates/
  CHILD_TEMPLATE_UI.docx        Mẫu cho từng loại chức năng (5 file .docx)
  CHILD_TEMPLATE_TICHHOP.docx
  CHILD_TEMPLATE_JOB.docx
  CHILD_TEMPLATE_PHANTICH.docx
  CHILD_TEMPLATE_DANHMUC.docx
  CHILD_TEMPLATE_*.md           Cùng đề cương, bản Markdown cho Confluence
  _normalized.docx              Template gốc đã chuẩn hoá (sinh ra head/tail/child)
tools/
  outline.py               ★ NGUỒN SỰ THẬT DUY NHẤT về đề cương
  normalize_template.py    Sửa đánh số, cỡ chữ, font trên template gốc
  prune_styles.py          Xoá style rác, ẩn style không được phép
  split_master.py          Cắt master thành head + tail
  make_child_template.py   Sinh CHILD_TEMPLATE.docx
  make_child_template_md.py Sinh CHILD_TEMPLATE.md
  export_outline_json.py   Sinh outline.json cho công cụ web (xem mục 7)
  new_function.py          Tạo file chức năng mới đúng loại, đăng ký vào manifest
  render_diagrams.py       Render PlantUML → PNG (Docker hoặc jar)
  clean_child.py           Dọn file bị lẫn style khi copy từ nguồn khác
  validate_child.py        Kiểm tra file trước khi ghép, rẽ luật theo loại
  merge.py                 Ráp tài liệu tổng, chèn sơ đồ
build/                     Kết quả build — không commit
docs/STYLE_CONTRACT.md     Quy tắc soạn thảo + checklist nộp bài
```

> `functions/` hiện đang chứa 5 file **demo** — một file cho mỗi loại chức năng.
> Xoá hết trước khi dùng thật.

---

## 2. Quy trình cho BA soạn thảo

1. Nhận mã chức năng từ Lead BA. Mã đã có sẵn dòng trong `manifest.csv`.
2. `git checkout -b feat/FUNC-XXX-000`
3. Tạo file bằng công cụ, không copy tay:
   ```bash
   python tools/new_function.py --ma FUNC-XXX-000 --ten "Tên chức năng" \
       --loai TICHHOP --nhom GRP-XXX --ten-nhom "Tên nhóm" --owner <tài khoản>
   ```
   Công cụ chọn đúng mẫu theo loại, điền Loại/Mã/Tên, sinh mã tính năng đầu tiên,
   thêm dòng vào `manifest.csv`, và tạo khung `.puml` nếu loại đó bắt buộc sơ đồ.
4. Soạn nội dung. Đọc `docs/STYLE_CONTRACT.md` trước khi gõ dòng đầu tiên.
5. Tự kiểm tra:
   ```bash
   python tools/validate_child.py functions/FUNC-XXX-000_Ten-chuc-nang.docx
   ```
   Phải đạt `PASS` hoặc chỉ còn `WARN` đã giải trình.
6. Đổi `status` trong `manifest.csv` thành `peer-reviewed`, commit, tạo Merge Request.
7. Module Lead review → Lead BA duyệt → đổi `status` thành `approved` → merge.

**Một file chỉ có một chủ sở hữu.** Cần sửa file của người khác thì mở MR gán cho họ,
không tự sửa. Đây là điều kiện để Git hoạt động được với file Word.

---

## 3. Build tài liệu tổng

```bash
python tools/merge.py                    # chỉ ghép bản đã approved
python tools/merge.py --all              # ghép cả draft, để review nội bộ
python tools/merge.py --ngat-trang       # mỗi chức năng bắt đầu ở trang mới
python tools/merge.py --tag v1.0         # đặt nhãn vào tên file kết quả
python tools/merge.py --render           # render lại sơ đồ PlantUML trước khi ghép
```

Kết quả: `build/SRS_CIC_CORE_<tag>_<yyyymmdd>.docx`

**Sau khi build, mở file trong Word và bấm `Yes`** khi Word hỏi cập nhật trường.
Đó là lúc Mục lục, số mục, số hình và số bảng được đánh lại. Nếu lỡ bấm No:
`Ctrl+A` → `F9`.

---

## 4. Thiết lập lại từ đầu (khi template tổng đổi phiên bản)

```bash
python tools/normalize_template.py tools/_source_template.docx templates/_normalized.docx
python tools/prune_styles.py --apply
python tools/split_master.py
python tools/make_child_template.py
python tools/make_child_template_md.py
python tools/export_outline_json.py
```

`make_child_template*.py` sinh 5 file `.docx` và 5 file `.md` — một bộ cho mỗi loại
chức năng. `export_outline_json.py` sinh `outline.json` cho công cụ web (mục 7).

Thứ tự bắt buộc: `prune_styles.py` chạy **sau** `normalize_template.py` và **trước**
`split_master.py`, vì head/tail/child đều sinh ra từ `_normalized.docx`.

`normalize_template.py` sửa 2 lỗi có sẵn trong template gốc v1.2:

| Lỗi | Hậu quả nếu không sửa |
|---|---|
| `numbering.xml` — Heading 5 đánh số `(1)` thay vì `IV.1.1.4.1.` | Mọi mục cấp 5 mất số phân cấp, không tra cứu được |
| `styles.xml` — Heading 7/8 trỏ vào `numId=1` thay vì `numId=4` | Ai dùng Heading 7/8 sẽ phá vỡ toàn bộ cây đánh số |
| Thụt lề cấp 4 và cấp 5 lệch (851 và 4334 twips) | Mục cấp 5 thụt vào 7,6 cm, gần hết chiều ngang trang |
| Heading 4 nhạt hơn Heading 5 | Mục con nổi bật hơn mục cha |
| Theme majorFont = Calibri Light | Heading sans-serif, thân bài serif |

---

## 5. Cấu trúc chuẩn của một file chức năng (đề cương v3.0)

### 5.1. Bốn loại chức năng

| Mã loại | Tên | Số mục trong khối Tính năng | Bắt buộc sơ đồ trình tự |
|---|---|---|---|
| `UI` | Chức năng / Tính năng có giao diện | 6 | — |
| `TICHHOP` | Tích hợp hệ thống | 8 | có |
| `JOB` | Job (xử lý theo lô / định kỳ) | 9 | có |
| `PHANTICH` | Phân tích chỉ tiêu báo cáo thống kê | 8 | — |
| `DANHMUC` | Danh mục (biến thể rút gọn của UI) | 5 | — |

`DANHMUC` là **biến thể rút gọn của `UI`**, không phải loại thứ năm. Dùng cho các
chức năng quản lý danh mục thừa hưởng hành vi CRUD chuẩn đã đặc tả một lần ở
component `CMP-DANHMUC-001` trong `00_master_head.docx`.

Loại được khai báo ở **dòng đầu bảng *Mô tả chung*** và ở cột `loai` trong
`manifest.csv`. Validator đọc dòng đó để chọn bộ luật — điền sai loại thì báo lỗi
ngay, và nếu file chứa mục của loại khác thì cảnh báo "có thể đã dùng sai mẫu".

### 5.2. Cấp Chức năng — giống nhau cho mọi loại

```
H3  Chức năng [MÃ] «Tên»
  H4  Mô tả chung              ← bảng 14 dòng, dòng đầu là Loại chức năng
  H4  Ma trận phân quyền        ← cột thay đổi theo loại (xem 5.4)
  H4  Luồng màn hình            ← TICHHOP: "Sơ đồ kiến trúc tích hợp"
                                  JOB: "Sơ đồ luồng dữ liệu"
  H4  Sơ đồ trạng thái
  H4  Luồng nghiệp vụ
  H4  Quy tắc nghiệp vụ         ← mã BR-«MÃ_CN»-nnn
  H4  Tính năng [MÃ] «Tên»      ← lặp n lần; các mục con THAY ĐỔI theo loại
  H4  Dữ liệu và tích hợp
  H4  Vấn đề còn mở             ← phải rỗng trước khi approved
  H4  Lịch sử thay đổi          ← merge.py tự đổ từ Git log
```

Giữ xương sống chung để ma trận phân quyền, quy tắc nghiệp vụ và dữ liệu tác động
vẫn tra cứu được xuyên loại, và tài liệu tổng vẫn là một cây thống nhất. Thay vì
để mục không liên quan trở thành "Không áp dụng", mục thứ ba **đổi tên** theo loại.

### 5.3. Khối Tính năng — thay thế hoàn toàn theo loại

| # | `UI` | `TICHHOP` | `JOB` | `PHANTICH` | `DANHMUC` |
|---|---|---|---|---|---|
| 1 | Mô tả yêu cầu | Mô tả yêu cầu | Mô tả yêu cầu | Mô tả yêu cầu | Mô tả yêu cầu |
| 2 | Luồng xử lý | Hợp đồng giao tiếp | Kích hoạt và lịch chạy | Định nghĩa chỉ tiêu | Danh sách trường |
| 3 | Thiết kế giao diện | Dữ liệu vào | Nguồn dữ liệu vào | Nguồn dữ liệu và phạm vi | Khoá duy nhất và quy tắc trùng lặp |
| 4 | Mô tả các thành phần trên giao diện | Dữ liệu ra | Quy tắc kiểm tra và loại bỏ | Quy tắc tính toán và tổng hợp | Điểm khác biệt so với mẫu chuẩn |
| 5 | Xử lý sự kiện và thao tác | Sơ đồ trình tự | Xử lý và ghi nhận | Bố cục kết xuất | Mã lỗi và thông báo |
| 6 | Thông báo | Chính sách lỗi và bù trừ | Sơ đồ trình tự | Đối chiếu và kiểm chứng | — |
| 7 | — | Yêu cầu phi chức năng | Chạy lại và bù trừ | Xử lý khối lượng lớn | — |
| 8 | — | Mã lỗi và thông báo | Giám sát và cảnh báo | Mã lỗi và thông báo | — |
| 9 | — | — | Mã lỗi và thông báo | — | — |

Mục *Mô tả yêu cầu* bất biến ở đầu, mục mã lỗi/thông báo bất biến ở cuối. Phần giữa
là phần đặc thù của từng loại.

### 5.4. Ma trận phân quyền theo loại

| Loại | Dòng là gì | Cột đặc thù |
|---|---|---|
| `UI`, `PHANTICH`, `DANHMUC` | tính năng / thao tác | 3 cột mã vai trò + Phạm vi dữ liệu |
| `TICHHOP` | endpoint / thao tác | **Mã đơn vị / hệ thống được phép** + Phạm vi dữ liệu + Quota |
| `JOB` | thao tác **thủ công** (chạy lại, dừng, xem log) | Mã vai trò + Phạm vi dữ liệu |

Với `TICHHOP`, mã đơn vị lấy theo mã định danh nội bộ 19 ký tự đã thiết kế. Job chạy
tự động nên không có phân quyền người dùng — bảng khai báo ai được thao tác thủ công,
đây là câu hỏi vận hành sẽ hỏi đầu tiên khi job lỗi.

Mọi biến thể đều giữ cột **Mã tính năng** để validator kiểm được độ phủ một cách
thống nhất: mỗi tính năng khai báo ở khối Tính năng phải có ít nhất một dòng ở bảng
này, nếu không thì chặn merge.

### 5.5. Ba quy ước mã

| Loại | Dạng | Ví dụ |
|---|---|---|
| Chức năng | `FUNC-«NHÓM»-«3 số»` | `FUNC-NSD-001` |
| Tính năng | `FEAT-«mã chức năng bỏ tiền tố»-«2 số»` | `FEAT-NSD-001-02` |
| Quy tắc nghiệp vụ | `BR-«mã chức năng»-«3 số»` | `BR-FUNC-NSD-001-001` |
| Sơ đồ | `«mã chức năng»_seq-«2 số»` | `FUNC-TCH-002_seq-01` |

### 5.6. Ranh giới với đặc tả REL

Chức năng có tính toán hoặc quy tắc phức tạp **không** đặc tả thuật toán trong SRS.
SRS khai báo *quy tắc nào áp dụng ở đâu* (mã `BR-...`); thư viện đặc tả REL định
nghĩa *quy tắc được tính thế nào*.

Nếu để BA mô tả logic khớp mờ hay chuẩn hoá tên ngay trong SRS thì sẽ có hai nguồn
sự thật cho cùng một thuật toán, và chúng sẽ lệch.

### 5.7. Mẫu chuẩn danh mục

Với 246 chỉ tiêu dữ liệu, hệ thống sẽ có vài chục chức năng danh mục gần như giống
hệt nhau. Nếu mỗi BA viết đầy đủ cho từng danh mục thì sẽ có 40 file trùng lặp —
nghĩa là 40 chỗ phải sửa khi quy tắc phân trang đổi.

Cách làm: đặc tả **một lần** hành vi CRUD chuẩn ở `00_master_head.docx` như component
`CMP-DANHMUC-001` (tra cứu, thêm, sửa, hết hiệu lực, phân trang, xuất Excel), rồi mỗi
chức năng danh mục dùng mẫu `DANHMUC` chỉ khai báo: danh sách trường, khoá duy nhất,
và **điểm khác biệt so với mẫu chuẩn** — mục này rỗng là bình thường và tốt.

Một chức năng danh mục từ 6–8 trang xuống còn 1–2 trang.

Rủi ro phải chấp nhận: mẫu chuẩn viết chưa chặt thì mọi danh mục thừa hưởng chỗ mơ
hồ đó. Vì vậy toàn bộ phần danh mục giao **một người phụ trách**, và `CMP-DANHMUC-001`
phải được Lead BA review kỹ trước khi mở cho team dùng.

> **Việc còn phải làm:** thêm `CMP-DANHMUC-001` vào mục *Quy tắc component* của
> `00_master_head.docx`. Chưa có nó thì mẫu `DANHMUC` không có gì để tham chiếu.

## 6. Hệ thống chữ (v2.1)

| Đối tượng | Cỡ | Kiểu | Ghi chú |
|---|---|---|---|
| Title (bìa) | 24pt | đậm, HOA | |
| Heading 1 | 16pt | đậm, HOA | |
| Heading 2 | 14pt | đậm | Nhóm chức năng |
| Heading 3 | 13pt | đậm | Chức năng |
| Heading 4 | 13pt | đậm nghiêng | Mục cấp chức năng |
| Heading 5 | 13pt | nghiêng | Mục trong khối Tính năng |
| Thân bài | 13pt | thường | |
| Nội dung bảng | 12pt | thường | Tiêu đề bảng và cột đầu in đậm |
| Caption hình/bảng | 11pt | nghiêng | |
| Header/footer | 10pt | thường | giữ nguyên |

Font: **Times New Roman toàn bộ**. `normalize_template.py` ép font ở cả 3 nơi —
theme (2 chỗ), styles.xml (36 chỗ), thân bài + header/footer (58 chỗ). Riêng
`numbering.xml` giữ nguyên Symbol/Wingdings/Courier New vì đó là font glyph của
dấu gạch đầu dòng; đổi sang Times New Roman sẽ biến bullet thành ký tự rác.

**Nguyên tắc thang độ:** ba cấp trên phân biệt bằng *kích thước* (16/14/13), ba
cấp dưới cùng 13pt nên phân biệt bằng *kiểu chữ* (đậm → đậm nghiêng → nghiêng).
Độ nổi bật giảm dần đơn điệu từ Heading 1 xuống Heading 5.

Template gốc v1.2 vi phạm nguyên tắc này: Heading 4 chỉ nghiêng trong khi
Heading 5 nằm dưới nó lại đậm + nghiêng — mục con nổi bật hơn mục cha; Heading 3
và Heading 5 thì trùng hệt kiểu chữ, chỉ khác màu. Đồng thời theme đặt
majorFont = Calibri Light nên toàn bộ heading ra sans-serif trong khi thân bài là
Times New Roman. Cả ba đã được sửa.

Muốn đổi thang độ: sửa `FONT_SCALE` và `DOC_FONT` trong `tools/normalize_template.py`
rồi chạy lại chuỗi thiết lập ở mục 4.

## 7. Đề cương chỉ khai báo ở một nơi

`tools/outline.py` là nguồn sự thật duy nhất. Bốn script đọc từ đó:

```
tools/outline.py
   ├── make_child_template.py      → templates/CHILD_TEMPLATE.docx
   ├── make_child_template_md.py   → templates/CHILD_TEMPLATE.md
   ├── validate_child.py           → luật kiểm tra file BA nộp
   └── export_outline_json.py      → outline.json (hợp đồng với công cụ web)
```

Sửa đề cương thì **chỉ sửa `outline.py`** rồi chạy lại cả bốn. Nếu để đề cương nằm
rời trong từng script, chúng sẽ lệch nhau sau vài lần sửa — đúng vấn đề mà cả quy
trình này đang giải.

Vì lý do đó, dạng chuẩn của các mã (`FUNC-`, `FEAT-`, `BR-`, thông báo, sơ đồ) cũng
khai báo một chỗ ở `outline.CODE_PATTERNS`; `validate_child.py` đọc từ đó thay vì tự
viết lại biểu thức chính quy.

### outline.json — hợp đồng với công cụ web

Công cụ **Chuẩn hóa tài liệu** (hệ thống CIC Core, `/tools/doc-standardizer`) đọc
`outline.json` để dựng đúng cây mục Heading 4/Heading 5 theo loại, biết bộ cột chuẩn
của từng bảng, và kiểm tra dạng mã.

```bash
python tools/export_outline_json.py            # sinh outline.json
python tools/export_outline_json.py --check    # CI: fail nếu file đã commit bị lệch
```

**Không sửa `outline.json` bằng tay.** Kết quả có tính tất định (không nhúng thời
điểm sinh) nên job CI `outline_json` so sánh được — sửa đề cương mà quên xuất lại thì
pipeline chặn ngay, tránh việc web tool âm thầm dùng đề cương cũ.

## 8. Chuẩn hoá nội dung trên Confluence

`templates/CHILD_TEMPLATE.md` là cùng đề cương, dạng Markdown. Ánh xạ cấp tiêu đề:

| Confluence / Markdown | Word |
|---|---|
| Tiêu đề trang | Heading 3 — Chức năng |
| `##` | Heading 4 — mục cấp chức năng |
| `###` | Heading 5 — mục trong khối Tính năng |

Cách dùng: mở trang Confluence → `/` → Markdown → dán nội dung file .md → điền
nội dung cũ vào đúng ô. Mục nào trang cũ không có thì ghi "Không áp dụng", **không
xoá mục** — có xoá thì sau này chuyển sang Word sẽ trượt validator.

Hai chỗ hướng dẫn khác nhau giữa hai bản (khai báo bằng `note_md` trong `outline.py`):

- *Thiết kế giao diện* — Confluence đính kèm ảnh và đặt tên file theo mã tính năng,
  thay vì Insert Caption của Word.
- *Lịch sử thay đổi* — Confluence dùng Page History, để bảng trống; khi chuyển sang
  Word script build sẽ tự đổ từ Git log.

Dùng `--h1` nếu muốn cấp Chức năng thành `# ...` trong thân trang (khi gộp nhiều
chức năng vào một trang):

```bash
python tools/make_child_template_md.py --h1 -o /tmp/mau.md
```

## 9. Khi copy nội dung từ nguồn khác

Word kéo theo style lạ, font lạ, cỡ chữ, tô nền, viền, đánh số trực tiếp. Nhìn
trên file con thì vẫn ổn; ghép vào tài liệu tổng mới biến dạng.

```bash
python tools/clean_child.py functions/FUNC-XXX-000.docx            # xem trước
python tools/clean_child.py functions/FUNC-XXX-000.docx --apply    # dọn
python tools/clean_child.py functions/*.docx --apply               # dọn cả loạt
```

Công cụ làm 6 việc:

| # | Việc | Chi tiết |
|---|---|---|
| 1 | Ánh xạ style lạ | `ListParagraph`/`BodyText`/`NormalWeb`… → `T-Gach -` / `T-NoiDung` |
| 2 | Gỡ định dạng chữ | font, cỡ, màu, tô nền, viền, giãn chữ — **giữ** đậm/nghiêng/gạch chân |
| 3 | Gỡ định dạng đoạn | tô nền, viền, thụt lề, giãn dòng, căn lề |
| 4 | Ép bảng | mọi bảng → `TableStyle3`, gỡ tô nền ô |
| 5 | Gỡ cấu trúc lạ | ngắt trang thủ công, ngắt section, đánh số trực tiếp trên bullet |
| 6 | Dọn rác XML | `proofErr`, `noProof`, `lastRenderedPageBreak`, thẻ rỗng |

**Mặc định chỉ báo cáo, không sửa.** Phải thêm `--apply` mới ghi, và luôn tạo bản
`.bak` trước khi ghi.

Hai tuỳ chọn:

- `--shift-headings N` — cộng N vào cấp mọi heading. Dùng khi dán từ tài liệu mà
  toàn bộ lệch đều, ví dụ `--shift-headings 2` để Heading 1 → Heading 3.
- `--keep-layout` — giữ thụt lề / giãn dòng / căn lề tự đặt (mặc định gỡ, vì style
  đã quy định sẵn).

**Điều công cụ cố tình KHÔNG làm:** tự đổi Heading 1/Heading 2 sang cấp khác. Nó
không đoán được cấp đúng, và đoán sai thì hỏng cây mục lục mà không ai phát hiện.
Những chỗ này được liệt kê riêng, đánh dấu ✗, để người sửa tay.

Quy trình khuyến nghị sau khi dán nội dung:

```bash
python tools/clean_child.py <file>            # đọc báo cáo trước
python tools/clean_child.py <file> --apply    # dọn
python tools/validate_child.py <file>         # kiểm tra lại
```

## 10. Sơ đồ trình tự — là mã nguồn, không phải ảnh

Sơ đồ viết bằng PlantUML, lưu ở `diagrams/«mã chức năng»_seq-«nn».puml`. Trong file
`.docx` BA **không dán ảnh**, chỉ để placeholder:

```
[[DIAGRAM: FUNC-TCH-002_seq-01]]
```

`merge.py` render `.puml` → PNG rồi thay placeholder bằng ảnh kèm caption dùng trường
SEQ, nên số hình tự đánh lại đúng sau khi ghép.

### Vì sao không dán ảnh

- Ảnh nhúng trong Word **không diff được** — reviewer không có cách nào biết sơ đồ đổi
  gì giữa hai phiên bản. Với `.puml` thì Merge Request hiện ra từng dòng.
- Sơ đồ và đặc tả **không bao giờ lệch**: build lại là sơ đồ mới nhất, không có chuyện
  file `.docx` còn giữ ảnh cũ.
- Tên participant **kiểm được tự động** (xem dưới).

Đánh đổi: BA phải học cú pháp sequence của PlantUML. Thực tế chỉ cần 5 lệnh —
`participant`, `->`, `-->`, `alt/else`, `note` — một buổi 30 phút là đủ.

### Khi nào bắt buộc

> Bắt buộc sơ đồ trình tự khi luồng có **từ 2 hệ thống trở lên** tham gia.

Nghĩa là `TICHHOP` và `JOB` luôn bắt buộc (validator chặn nếu thiếu placeholder).
`UI` thuần nội bộ thì không cần — bảng *Luồng xử lý* diễn đạt tốt hơn; sơ đồ một hệ
thống chỉ là bảng bước vẽ dọc, tốn công mà không thêm thông tin, và sẽ là thứ đầu tiên
bị bỏ cập nhật.

### Render

```bash
python tools/render_diagrams.py            # chỉ render file nào đổi
python tools/render_diagrams.py --force    # render lại tất cả
python tools/render_diagrams.py --check    # chỉ kiểm tra, không render
python tools/merge.py --render             # render rồi ghép luôn
```

Ưu tiên Docker, không cần cài Java trên máy BA:

```
docker run --rm -v "$PWD:/work" -w /work plantuml/plantuml -tpng -o /work/build/diagrams diagrams/x.puml
```

Không có Docker thì đặt `PLANTUML_JAR=/đường/dẫn/plantuml.jar`. Trên GitLab CI, job
`render_diagrams` tải jar theo phiên bản ghim trong `.gitlab-ci.yml` và xuất
`build/diagrams/` làm artifact cho các stage sau.

`build/diagrams/.hashes.json` lưu vân tay từng file nên chỉ sơ đồ đổi mới được render lại.

### systems.csv — kiểm tra tên participant

```csv
ma,ten,loai,ghi_chu
CIC_CORE,Hệ thống lõi CIC,Nội bộ,
CIC_SSO,Hệ thống xác thực tập trung,Nội bộ,
TCTD,Tổ chức tín dụng gửi dữ liệu,Bên ngoài,Đại diện chung cho 1.200+ TCTD
```

`render_diagrams.py --check` đối chiếu mọi `participant` với file này:

```
[WARN] FUNC-XXX-999_seq-99.puml
        participant 'HeThongCIC' chưa có trong systems.csv
        tên file không theo dạng «mã»_seq-«nn»
```

Đây là chỗ 15 người sẽ phân kỳ mạnh nhất nếu không kiểm — mỗi người gọi cùng một hệ
thống bằng một tên khác nhau, và sau ba tháng không ai dựng được bức tranh tích hợp
tổng thể. Chưa có `systems.csv` thì bước kiểm này bị bỏ qua, build vẫn chạy.

## 11. Vai trò

| Vai trò | Sở hữu | Trách nhiệm |
|---|---|---|
| Lead BA | `00_master_head.docx`, `90_master_tail.docx`, `manifest.csv` | Duyệt vòng 2, giữ nhất quán xuyên module, chạy build & phát hành |
| Module Lead (3–4 người) | — | Review vòng 1 cho 4–5 BA trong module |
| BA | 1 file trong `functions/` | Soạn thảo, tự validate, mở MR |

Không để Lead BA review trực tiếp 15 người — đó là nút cổ chai chắc chắn xảy ra.

---

## 12. Quy tắc về phần dùng chung

Bất cứ thứ gì được từ 2 chức năng trở lên tham chiếu đều thuộc `00_master_head.docx`:
quy tắc chung, quy tắc component, danh sách thông báo, danh sách trạng thái.

BA **không** tự định nghĩa lại trong file con. Cần thêm component/thông báo/trạng
thái mới → mở issue gán cho Lead BA, Lead BA thêm vào master, BA tham chiếu theo mã.

Nếu bỏ qua quy tắc này, sau 3 tuần sẽ có 6 biến thể của cùng một lưới dữ liệu và
40 câu thông báo lỗi viết khác nhau cho cùng một tình huống.
