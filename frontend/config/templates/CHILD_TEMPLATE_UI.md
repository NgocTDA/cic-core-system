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
> - MỌI mã tham chiếu (UC, thông báo, trạng thái, vai trò, tác nhân, component) phải có trong sổ đăng ký tương ứng. Cần mã mới thì thêm vào sổ trong cùng Merge Request, không tự đặt trong file chức năng.
> - Mã thông báo dùng chung toàn hệ thống — tra messages.csv trước khi tạo mã mới. Cùng một nội dung thông báo thì dùng lại mã cũ, không tạo mã song song.
> - Hai mục “Tác nhân” và “Lịch sử thay đổi” do script build tự đổ — không gõ tay.
> - Chức năng có tính toán phức tạp: KHÔNG đặc tả thuật toán ở đây. SRS khai báo quy tắc nào áp dụng ở đâu (mã BR); thuật toán định nghĩa trong thư viện đặc tả REL.
>
> **Quy ước mã**
>
> | Loại | Dạng | Ví dụ | Nguồn |
> |---|---|---|---|
> | Use case | `UC-«4 số»` | `UC-0787` | BRD — cố định, không đổi khi sắp xếp lại |
> | Phân hệ | `«3–6 chữ»` | `QLSP` | 8 mã cố định |
> | Nhóm chức năng | `GRP-«phân hệ»-«2 số»` | `GRP-HTVH-01` | groups.csv, khớp cây menu |
> | Chức năng | `FUNC-«phân hệ»-«3 số»` | `FUNC-QLSP-047` | manifest, đánh liên tiếp |
> | Tính năng | `FEAT-«phân hệ»-«số CN»-«2 số»` | `FEAT-QLSP-047-01` | trong file chức năng |
> | Quy tắc nghiệp vụ | `BR-«phân hệ»-«số CN»-«3 số»` | `BR-QLSP-047-001` | trong file chức năng |
> | Đối tượng nghiệp vụ | `«CHỮ HOA»` | `SANPHAM` | objects.csv |
> | Thông báo | `«LOẠI»_«3 số»` | `ERR_014` | messages.csv — dùng chung toàn hệ thống, không theo đối tượng/phân hệ |
> | Trạng thái | `ST-«đối tượng»-«2 số»` | `ST-SANPHAM-01` | states.csv |
> | Vai trò | `ROLE-«mã»` | `ROLE-QTHT` | roles.csv |
> | Tác nhân / hệ thống | `«mã viết tắt»` | `CB-KSDL, HT-M5` | participants.csv |
> | Component | `CMP-«tên»-«3 số»` | `CMP-GRID-001` | components.csv |
> | Sơ đồ | `«mã chức năng»_seq-«2 số»` | `FUNC-QLSP-047_seq-01` | diagrams/ |

---

## Mô tả chung

> Loại chức năng: điền đúng một trong UI / TICHHOP / JOB / PHANTICH / DANHMUC. Nhóm chức năng: mã từ groups.csv. Vị trí chức năng: đường dẫn menu, hoặc endpoint, hoặc tên job. Hai dòng Tác nhân do script build tự đổ từ các UC đã khai ở mục Truy vết yêu cầu.

| Hạng mục | Nội dung |
|---|---|
| Loại chức năng |  |
| Mã chức năng |  |
| Tên chức năng |  |
| Nhóm chức năng |  |
| Mô tả chức năng |  |
| Tác nhân chính |  |
| Tác nhân phụ |  |
| Vị trí chức năng |  |
| Điều kiện tiên quyết |  |
| Hậu điều kiện |  |
| Chức năng tiền đề |  |
| Chức năng kế tiếp |  |
| Chức năng dùng chung |  |
| Yêu cầu đặc thù |  |

## Truy vết yêu cầu

> Mỗi UC phải có ĐÚNG MỘT chức năng khai vai trò “Chính”; các chức năng khác chỉ khai “Dùng chung” và không đặc tả lại. Cột “Tên UC” do script build tự đổ từ usecases.csv — không gõ tay. Mức đáp ứng: Đầy đủ / Một phần (một phần thì ghi rõ chức năng nào bù ở cột Ghi chú). Tính năng kỹ thuật không thuộc UC nào thì ghi “Không thuộc UC” và nêu căn cứ ở Ghi chú.

| Mã UC | Tên UC | Tính năng đáp ứng | Vai trò | Mức đáp ứng | Ghi chú |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## Ma trận phân quyền

> Mã vai trò lấy từ roles.csv, không đặt tên tự do. Ô đánh “X” = được phép. Phạm vi dữ liệu: Toàn hệ thống / Theo đơn vị / Theo vùng / Bản ghi của mình. Mỗi tính năng khai báo phía dưới phải có ít nhất một dòng ở bảng này.

| STT | Mã tính năng | Tính năng / Thao tác | «ROLE_1» | «ROLE_2» | «ROLE_3» | Phạm vi dữ liệu |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

## Luồng màn hình

> Sơ đồ điều hướng giữa các màn hình. Chức năng chỉ có một màn hình thì ghi “Không áp dụng”.

## Sơ đồ trạng thái

> Chỉ lập khi đối tượng nghiệp vụ có vòng đời trạng thái. Mã trạng thái lấy từ states.csv (dạng ST-«đối tượng»-«2 số»). Không có thì ghi “Không áp dụng”.

## Luồng nghiệp vụ

> Luồng nghiệp vụ tổng thể của chức năng, xuyên qua nhiều tính năng. Chi tiết từng bước mô tả ở mục Tính năng tương ứng.

## Quy tắc nghiệp vụ

> Mã theo dạng BR-«phân hệ»-«số chức năng»-«3 số», ví dụ BR-QLSP-047-001. Bảng thành phần và bộ test case tham chiếu theo mã này, không chép lại nội dung quy tắc.

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

> Đính kèm ảnh mockup vào trang, đặt tên file theo mã tính năng (vd FEAT-HTVH-005-02_tra-cuu.png).

### Mô tả các thành phần trên giao diện

> Đây là nơi duy nhất khai báo danh sách trường. Không lặp lại ở mục khác. Giới hạn: độ dài, độ lớn tối đa, khoảng giá trị — ví dụ “tối đa 1000 ký tự”, “0–999.999.999”. Mô tả ràng buộc: gộp chung nguồn dữ liệu, mã quy tắc (BR-…), mã thông báo khi vi phạm, và các diễn giải khác.

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Thông báo

> Mã dùng chung TOÀN HỆ THỐNG, dạng «LOẠI»_«3 số» — ví dụ ERR_014. Số thứ tự chạy chung cho cả hệ thống theo từng loại (ERR/WAR/INF/SUC/CONF), không theo đối tượng hay phân hệ. Tra messages.csv trước: cùng nội dung thì dùng lại mã cũ, kể cả khi mã đó đang được phân hệ khác dùng. Mã mới thì thêm vào messages.csv trong cùng Merge Request — lấy số tiếp theo của đúng loại đó. Cột “Nội dung” ở đây chỉ để đọc — nội dung chuẩn nằm ở sổ.

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Tiêu chí chấp nhận

> 3–6 câu khẳng định KIỂM ĐƯỢC cho mỗi tính năng, không phải kịch bản kiểm thử đầy đủ. Mỗi câu phải quan sát được kết quả đúng/sai, tránh câu định tính kiểu “giao diện thân thiện”. Kịch bản chi tiết thuộc tài liệu kiểm thử.

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

<!-- ↑ Hết một khối Tính năng. Nhân bản từ “## Tính năng [MÃ_TÍNH_NĂNG] «Tên tính năng»” xuống đến đây cho tính năng tiếp theo. -->

## Dữ liệu và tích hợp

> Loại: Bảng CSDL / API / File / Hàng đợi. Chiều: Đọc / Ghi / Vào / Ra. Dùng để dựng ma trận CRUD và xác định phạm vi tác động khi đổi dữ liệu.

| STT | Loại | Tên đối tượng | Chiều | Mô tả / Ghi chú |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## Phân loại dữ liệu

> Phân loại: Công khai / Nội bộ / Nhạy cảm / Định danh cá nhân. Bắt buộc khai với mọi trường là dữ liệu cá nhân (CCCD, số điện thoại, địa chỉ, thông tin tín dụng của cá nhân). Quy tắc che: hiển thị đầy đủ / che một phần / chỉ vai trò nào được xem bản đầy đủ. Ghi nhật ký: thao tác nào phải vào nhật ký truy cập. Không có dữ liệu nhạy cảm thì ghi “Không áp dụng”.

| STT | Trường / Nhóm dữ liệu | Phân loại | Quy tắc che | Ghi nhật ký | Thời hạn lưu |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

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
