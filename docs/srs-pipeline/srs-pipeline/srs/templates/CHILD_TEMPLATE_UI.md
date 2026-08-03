<!--
  MẪU ĐẶC TẢ CHỨC NĂNG — loại UI: Chức năng / Tính năng có giao diện
  Đề cương v3.0. Sinh tự động từ tools/outline.py — không sửa file này bằng tay;
  sửa outline.py rồi chạy: python tools/make_child_template_md.py

  Ánh xạ cấp tiêu đề:
    Tiêu đề trang Confluence = Chức năng [MÃ] Tên chức năng   (Word Heading 3)
    ##  = Word Heading 4 — mục cấp chức năng
    ### = Word Heading 5 — mục trong khối Tính năng

  Khối “Tính năng” lặp lại cho mỗi tính năng. Chức năng chỉ có một
  tính năng vẫn phải giữ tầng này.
  Không xoá mục nào — mục không áp dụng thì ghi “Không áp dụng”.
-->

> **Tiêu đề trang:** `Chức năng [MÃ_CHỨC_NĂNG] «Tên chức năng»`

<!-- HƯỚNG DẪN — xoá khối này sau khi đã chuẩn hoá xong trang -->

> **Loại chức năng: `UI` — Chức năng / Tính năng có giao diện**
>
> **Quy ước bắt buộc**
>
> - Không gõ tay số thứ tự mục. Số do Word tự sinh; gõ tay sẽ sai sau khi ghép.
> - Không xoá mục Heading 4/Heading 5 nào. Mục không áp dụng thì ghi “Không áp dụng”.
> - Nhân bản khối “Tính năng” cho mỗi tính năng. Chức năng chỉ có 1 tính năng vẫn giữ tầng này.
> - Sơ đồ trình tự viết bằng PlantUML, lưu ở diagrams/. Trong file này chỉ để placeholder [[DIAGRAM: mã_seq-01]] — script build tự render và chèn ảnh có caption.
> - Tham chiếu sang chức năng khác: gõ theo mã. Không dùng Cross-reference sang file khác.
> - Vai trò, đơn vị/hệ thống, mã thông báo, mã trạng thái, component: chỉ tham chiếu theo mã đã đăng ký ở tài liệu tổng. Không định nghĩa lại trong file con.
> - Mục “Lịch sử thay đổi” do script build tự đổ từ Git log — không gõ tay.
> - Chức năng có tính toán phức tạp: KHÔNG đặc tả thuật toán ở đây. SRS khai báo quy tắc nào áp dụng ở đâu (mã BR); thuật toán định nghĩa trong thư viện đặc tả REL.
>
> **Quy ước mã**
>
> | Loại | Dạng | Ví dụ |
> |---|---|---|
> | Chức năng | `FUNC-«NHÓM»-«3 số»` | `FUNC-NSD-001` |
> | Tính năng | `FEAT-«mã chức năng bỏ tiền tố»-«2 số»` | `FEAT-NSD-001-02` |
> | Quy tắc nghiệp vụ | `BR-«mã chức năng»-«3 số»` | `BR-FUNC-NSD-001-001` |
> | Thông báo | `[LOẠI]_[NHÓM]_[3 số]` | `ERR_NGUOIDUNG_001` |
> | Sơ đồ | `«mã chức năng»_seq-«2 số»` | `FUNC-TCH-002_seq-01` |

---

## Mô tả chung

> Loại chức năng: điền đúng một trong UI / TICHHOP / JOB / PHANTICH. Vị trí chức năng: đường dẫn menu, hoặc endpoint, hoặc tên job. Hậu điều kiện: trạng thái hệ thống sau khi thực hiện thành công.

| Hạng mục | Nội dung |
|---|---|
| Loại chức năng |  |
| Mã chức năng |  |
| Tên chức năng |  |
| Mô tả chức năng |  |
| Tác nhân chính |  |
| Tác nhân phụ |  |
| Vị trí chức năng |  |
| Điều kiện tiên quyết |  |
| Hậu điều kiện |  |
| Chức năng tiền đề |  |
| Chức năng kế tiếp |  |
| Chức năng dùng chung |  |
| Mã yêu cầu BRD |  |
| Yêu cầu đặc thù |  |

## Ma trận phân quyền

> Mã vai trò lấy từ Danh mục vai trò ở tài liệu tổng, không đặt tên tự do. Ô đánh “X” = được phép. Phạm vi dữ liệu: Toàn hệ thống / Theo đơn vị / Theo vùng / Bản ghi của mình. Mỗi tính năng khai báo phía dưới phải có ít nhất một dòng ở bảng này.

| STT | Mã tính năng | Tính năng / Thao tác | «MÃ_VAI_TRÒ_1» | «MÃ_VAI_TRÒ_2» | «MÃ_VAI_TRÒ_3» | Phạm vi dữ liệu |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

## Luồng màn hình

> Sơ đồ điều hướng giữa các màn hình. Chức năng chỉ có một màn hình thì ghi “Không áp dụng”.

## Sơ đồ trạng thái

> Chỉ lập khi đối tượng nghiệp vụ có vòng đời trạng thái. Mã trạng thái phải khớp mục “Danh sách trạng thái trên hệ thống”. Không có thì ghi “Không áp dụng”.

## Luồng nghiệp vụ

> Luồng nghiệp vụ tổng thể của chức năng, xuyên qua nhiều tính năng. Chi tiết từng bước mô tả ở mục Tính năng tương ứng.

## Quy tắc nghiệp vụ

> Mã theo dạng BR-«MÃ_CHỨC_NĂNG»-001. Bảng thành phần và bộ test case tham chiếu theo mã này, không chép lại nội dung quy tắc.

| Mã quy tắc | Nội dung quy tắc | Áp dụng cho | Mã thông báo khi vi phạm |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

## Tính năng [MÃ_TÍNH_NĂNG] «Tên tính năng»

> Nhân bản toàn bộ khối này (gồm các mục con bên dưới) cho mỗi tính năng.

### Mô tả yêu cầu

> Người dùng làm gì, hệ thống trả về gì, ràng buộc và trường hợp ngoại lệ.

### Luồng xử lý

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

### Thiết kế giao diện

> Đính kèm ảnh mockup vào trang, đặt tên file theo mã tính năng (vd FEAT-NSD-001-02_tra-cuu.png).

### Mô tả các thành phần trên giao diện

> Đây là nơi duy nhất khai báo danh sách trường. Không lặp lại ở mục khác.

| STT | Tên thành phần | Loại control | Bắt buộc | Giá trị mặc định / Nguồn dữ liệu | Ràng buộc (mã BR) | Mã thông báo |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Thông báo

> Mã theo quy ước [LOẠI]_[NHÓM]_[SỐ] đã đăng ký ở mục “Danh sách thông báo trên hệ thống”. Mã mới phải đăng ký với Lead BA trước khi dùng.

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

<!-- ↑ Hết một khối Tính năng. Nhân bản từ “## Tính năng [MÃ_TÍNH_NĂNG] «Tên tính năng»” xuống đến đây cho tính năng tiếp theo. -->

## Dữ liệu và tích hợp

> Loại: Bảng CSDL / API / File / Hàng đợi. Chiều: Đọc / Ghi / Vào / Ra. Dùng để dựng ma trận CRUD và xác định phạm vi tác động khi đổi dữ liệu.

| STT | Loại | Tên đối tượng | Chiều | Mô tả / Ghi chú |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## Vấn đề còn mở

> Mục này PHẢI rỗng thì chức năng mới được chuyển sang status = approved.

| STT | Nội dung vấn đề | Người quyết định | Hạn chốt | Trạng thái |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## Lịch sử thay đổi

> Script build tự đổ nội dung từ Git log của chính file này. Không gõ tay.

| Phiên bản | Ngày | Người thực hiện | Mô tả thay đổi |
|---|---|---|---|
|  |  |  |  |
