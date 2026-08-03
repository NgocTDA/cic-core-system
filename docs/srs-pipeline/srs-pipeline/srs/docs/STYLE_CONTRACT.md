# Hợp đồng soạn thảo (Style Contract) — bắt buộc

90% sự cố khi ghép Word đến từ định dạng, không phải nội dung. Các quy tắc dưới đây
không phải khuyến nghị — validator sẽ chặn merge nếu vi phạm nhóm ERROR.

---

## A. Style — chỉ được dùng đúng 6 style

| Dùng cho | Style |
|---|---|
| Tên chức năng | `Heading 3` |
| Mô tả chung / Luồng màn hình / Sơ đồ trạng thái / Tính năng | `Heading 4` |
| Các mục con trong một Tính năng | `Heading 5` |
| Đoạn văn thường | `T-NoiDung` |
| Gạch đầu dòng cấp 1 | `T-Gach -` |
| Gạch đầu dòng cấp 2 | `T-Gach +` |
| Bảng | `TableStyle3` |

Cỡ chữ do style quyết định, **không chỉnh tay**: thân bài 13pt · bảng 12pt ·
caption 11pt · Heading 1/2 là 16/14pt, Heading 3/4/5 đều 13pt phân biệt bằng
đậm → đậm nghiêng → nghiêng. Font Times New Roman toàn bộ.

**Cấm tạo style mới. Cấm định dạng trực tiếp** (bôi đen rồi đổi font, cỡ chữ, màu,
căn lề). Nếu thấy cần một style không có trong danh sách — đó là dấu hiệu nội dung
đang đặt sai chỗ, hoặc cần bổ sung vào template tổng. Báo Lead BA.

Lý do: khi ghép, style trùng tên nhưng khác định nghĩa sẽ bị master ghi đè.
File con nhìn đẹp lúc soạn, vào bản tổng thì biến dạng.

---

## B. Đánh số — tuyệt đối không gõ tay

- **Cấm** gõ `1.2.3`, `IV.1.`, `a)` ở đầu heading. Số do Word tự sinh từ multilevel
  list gắn vào style Heading. Gõ tay thì sau khi ghép sẽ sai toàn bộ.
- **Cấm** dùng `Heading 1`, `Heading 2`, `Title` trong file con — hai cấp đó thuộc
  về tài liệu tổng.
- **Cấm** dùng `Heading 6` trở xuống. Cần sâu hơn 5 cấp là dấu hiệu chia mục sai.
- Ảnh và bảng đánh số bằng `References > Insert Caption` (trường SEQ). **Cấm** gõ
  tay `Hình 3`, `Bảng 5` — trường SEQ tự đánh lại toàn cục sau khi ghép, chữ gõ tay
  thì không.

---

## C. Tham chiếu chéo

| Loại | Cách làm |
|---|---|
| Trong cùng file (hình, bảng, mục) | `References > Cross-reference` — được phép |
| Sang chức năng khác | Gõ theo **mã chức năng**: "xem `FUNC-NSD-001`" |
| Sang phần chung | Gõ theo tên mục: "theo mục *Quy tắc chung*" |

**Không** dùng Cross-reference trỏ sang file khác. Bookmark chỉ tồn tại trong file
gốc, sau khi ghép sẽ hiện `Error! Reference source not found`.

---

## D. Bố cục — không đụng vào

- Không chèn ngắt trang (`Ctrl+Enter`), đặc biệt ở cuối file.
- Không chèn Section Break.
- Không sửa header/footer, khổ giấy, lề, hướng trang.
- Không dùng Text Box. Ảnh chèn bằng `Insert > Pictures`, đặt `In line with text`.

---

## E. Nội dung tham chiếu phần chung

- **Thông báo**: khai báo bằng mã đã đăng ký ở mục *Danh sách thông báo trên hệ thống*
  (`ERR_/WAR_/INF_/SUC_/CONF_` + nhóm + 3 số). Không viết nội dung thông báo tự do
  trong file con.
- **Trạng thái**: dùng mã ở mục *Danh sách trạng thái trên hệ thống*.
- **Component dùng chung**: tham chiếu theo mã component, không mô tả lại quy tắc
  chung (phân trang, trim khoảng trắng, định dạng ngày…) — những thứ đó đã nằm ở
  mục *Quy tắc chung* và áp dụng cho toàn hệ thống.

---

## F. Sơ đồ trình tự

Viết bằng PlantUML, lưu ở `diagrams/«mã chức năng»_seq-«nn».puml`. Trong file .docx
**không dán ảnh**, chỉ để `[[DIAGRAM: «mã»_seq-01]]` — script build tự render và chèn.

- Tên participant phải là mã hệ thống đã đăng ký trong `systems.csv`. Không viết tên
  mô tả tự do như `"Hệ thống CIC"`.
- Bắt buộc với loại `TICHHOP` và `JOB`. Loại `UI` thuần nội bộ không cần.
- Chạy `python tools/render_diagrams.py --check` trước khi nộp.

---

## G. Ranh giới với đặc tả REL

Chức năng có tính toán hoặc quy tắc phức tạp **không** đặc tả thuật toán ở đây.
SRS khai báo quy tắc nào áp dụng ở đâu (mã `BR-...`); thuật toán định nghĩa trong
thư viện đặc tả REL.

Viết logic khớp mờ hay chuẩn hoá tên vào SRS là tạo ra nguồn sự thật thứ hai — và
hai nguồn sẽ lệch.

---

## H. Đề cương cố định

Không được xoá, thêm, hay đổi tên mục Heading 4/Heading 5 nào trong đề cương v3.0.
Mục không áp dụng thì ghi "Không áp dụng" — giữ nguyên mục.

Lý do: 15 người viết thì mỗi lần một người "gọn hoá" đề cương là một biến thể mới.
Sau ba tháng không ai còn tra cứu được theo cùng một cách, và không viết được script
nào để rút dữ liệu ra khỏi tài liệu.

Cần một mục mới cho toàn bộ tài liệu → đề xuất với Lead BA để bổ sung vào
`CHILD_TEMPLATE.docx`, không tự thêm vào file riêng.

---

## I. Copy nội dung từ nguồn khác

Dán bằng `Paste Special > Unformatted Text` (`Ctrl+Alt+V`), rồi gán style.
Dán trực tiếp sẽ kéo theo style rác từ tài liệu nguồn và lây sang bản tổng.

---

# Checklist nộp bài (Definition of Done)

Tick đủ trước khi mở Merge Request.

**Cấu trúc**
- [ ] Dùng đúng `CHILD_TEMPLATE_<LOẠI>.docx`, hoặc tạo bằng `tools/new_function.py`
- [ ] Dòng **Loại chức năng** trong bảng *Mô tả chung* đã điền đúng một trong
      `UI / TICHHOP / JOB / PHANTICH / DANHMUC`
- [ ] Đã xoá khối « HƯỚNG DẪN » ở đầu file
- [ ] Không còn placeholder `«…»`, `[MÃ_…]`
- [ ] Đúng 1 Heading 3, không có Heading 1/2, không có Heading 6 trở xuống
- [ ] Đủ 9 mục Heading 4 dùng một lần
- [ ] Có tối thiểu 1 khối "Tính năng", mỗi khối đủ số mục Heading 5 của loại đó
- [ ] Không lẫn mục của loại khác (dấu hiệu dùng sai mẫu)
- [ ] Loại `TICHHOP` / `JOB`: có placeholder `[[DIAGRAM: ...]]` và file `.puml` tương ứng
- [ ] Mục không áp dụng đã ghi "Không áp dụng", không xoá mục

**Nội dung**
- [ ] Bảng *Mô tả chung* đã điền đủ 14 dòng
- [ ] Mọi tính năng đều có ít nhất một dòng trong *Ma trận phân quyền*
- [ ] Cột vai trò đã thay bằng mã vai trò thật, không còn `«MÃ_VAI_TRÒ_n»`
- [ ] Mã quy tắc theo dạng `BR-«MÃ_CN»-nnn`; bảng thành phần giao diện tham chiếu
      theo mã, không chép lại nội dung quy tắc
- [ ] Mã thông báo theo quy ước `[LOẠI]_[NHÓM]_[3 số]` và đã đăng ký với Lead BA
- [ ] Danh sách trường chỉ khai báo ở *Mô tả các thành phần trên giao diện*, không lặp
- [ ] Mục *Vấn đề còn mở* đã rỗng (bắt buộc để chuyển `approved`)

**Định dạng**
- [ ] Không gõ tay số thứ tự mục, số hình, số bảng
- [ ] Không có ngắt trang / section break / text box
- [ ] Ảnh mockup đã có caption bằng Insert Caption
- [ ] Không có run bị định dạng trực tiếp

**Kiểm tra tự động**
- [ ] `python tools/validate_child.py <file>` → `PASS`
- [ ] `python tools/validate_child.py --approved <file>` → `PASS` (khi trình duyệt)
- [ ] Đã cập nhật `status` trong `manifest.csv`
- [ ] Thông điệp commit viết bằng tiếng Việt, mô tả thay đổi nghiệp vụ — vì nó sẽ được
      in vào bảng *Lịch sử thay đổi* của tài liệu bàn giao
