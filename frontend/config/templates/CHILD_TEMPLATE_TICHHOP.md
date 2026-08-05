<!--
  MẪU ĐẶC TẢ CHỨC NĂNG — loại TICHHOP: Tích hợp hệ thống
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

> **Loại chức năng: `TICHHOP` — Tích hợp hệ thống**
>
> Loại này **bắt buộc** có sơ đồ trình tự — luồng có từ 2 hệ thống trở lên.
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

> Dòng là mã đơn vị / hệ thống được phép gọi, lấy từ participants.csv (theo mã định danh nội bộ 19 ký tự). Quota ghi theo số lời gọi trên đơn vị trên ngày. Mỗi tính năng phải có ít nhất một dòng ở bảng này.

| STT | Mã tính năng | Endpoint / Thao tác | Mã đơn vị / hệ thống được phép | Phạm vi dữ liệu | Quota / Giới hạn |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## Sơ đồ kiến trúc tích hợp

> Sơ đồ khối thể hiện hệ thống nào gọi hệ thống nào, qua giao thức gì, đồng bộ hay bất đồng bộ. Trình tự nằm ở mục Sơ đồ trình tự trong tính năng.

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

> Tích hợp để làm gì, bên nào chủ động gọi, nghiệp vụ nào phụ thuộc vào nó.

### Hợp đồng giao tiếp

> Chiều tích hợp: CIC cung cấp (inbound) / CIC gọi ra (outbound). Phiên bản theo URL-path versioning, là bắt buộc chứ không tuỳ chọn.

| Hạng mục | Nội dung |
|---|---|
| Chiều tích hợp |  |
| Giao thức |  |
| Endpoint / Địa chỉ |  |
| Method |  |
| Phiên bản |  |
| Cơ chế xác thực |  |
| Content-Type |  |
| Đơn vị / hệ thống được phép gọi |  |
| Môi trường áp dụng |  |

### Dữ liệu vào

> Khai báo cả trường trong header (xác thực, truy vết) nếu là bắt buộc.

| STT | Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc (mã BR) | Ví dụ |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

### Dữ liệu ra

> Ghi rõ cấu trúc bọc ngoài (mã kết quả, thông điệp, dữ liệu) nếu có.

| STT | Trường | Kiểu dữ liệu | Luôn có | Ý nghĩa | Ví dụ |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

### Sơ đồ trình tự

> Viết bằng PlantUML, lưu ở diagrams/«mã chức năng»_seq-«nn».puml. Ở đây chỉ để placeholder — script build tự render và chèn ảnh có caption. Tên participant phải là mã trong participants.csv, không viết tên mô tả tự do.

```
[[DIAGRAM: MÃ_CHỨC_NĂNG_seq-01]]
```

### Chính sách lỗi và bù trừ

> Đây là mục chức năng có giao diện không có tương đương, và là chỗ đặc tả hay thiếu nhất. Không khai báo thì mỗi API sẽ do dev tự quyết một kiểu.

| Hạng mục | Nội dung |
|---|---|
| Timeout |  |
| Số lần thử lại |  |
| Khoảng chờ giữa các lần thử |  |
| Idempotency key |  |
| Hành vi khi gọi lại cùng key |  |
| Hành động bù trừ khi thất bại một phần |  |

### Yêu cầu phi chức năng

| Hạng mục | Nội dung |
|---|---|
| SLA thời gian đáp ứng |  |
| Quota theo đơn vị theo ngày |  |
| Kích thước payload tối đa |  |
| Số lời gọi đồng thời |  |
| Lưu vết và nhật ký |  |

### Mã lỗi và thông báo

> Mã dùng chung TOÀN HỆ THỐNG, dạng «LOẠI»_«3 số» — ví dụ ERR_014. Số thứ tự chạy chung cho cả hệ thống theo từng loại (ERR/WAR/INF/SUC/CONF), không theo đối tượng hay phân hệ. Tra messages.csv trước: cùng nội dung thì dùng lại mã cũ, kể cả khi mã đó đang được phân hệ khác dùng. Mã mới thì thêm vào messages.csv trong cùng Merge Request — lấy số tiếp theo của đúng loại đó. Cột “Nội dung” ở đây chỉ để đọc — nội dung chuẩn nằm ở sổ.

| STT | Mã lỗi | HTTP status | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
|  |  |  |  |  |
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
