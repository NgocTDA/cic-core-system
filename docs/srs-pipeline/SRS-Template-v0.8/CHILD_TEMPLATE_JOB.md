<!--
  MẪU ĐẶC TẢ CHỨC NĂNG — loại JOB: Job (xử lý theo lô / định kỳ)
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

> **Loại chức năng: `JOB` — Job (xử lý theo lô / định kỳ)**
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

> Job chạy tự động không cần phân quyền người dùng; bảng này khai báo ai được thực hiện thao tác THỦ CÔNG: chạy lại, dừng, xem nhật ký, tải báo cáo lỗi. Mỗi tính năng khai báo phía dưới phải có ít nhất một dòng ở bảng này.

| STT | Mã tính năng | Thao tác thủ công | Mã vai trò được phép | Phạm vi dữ liệu |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## Sơ đồ luồng dữ liệu

> Dữ liệu đi từ nguồn nào, qua các bước xử lý nào, ghi vào đâu. Kèm các nhánh loại bỏ bản ghi không hợp lệ.

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

> Job làm gì, chạy trên dữ liệu nào, kết quả dùng cho nghiệp vụ nào.

### Kích hoạt và lịch chạy

> Cơ chế kích hoạt: theo lịch / theo sự kiện / thủ công. Cửa sổ thời gian quan trọng khi job nặng, tránh giờ cao điểm.

| Hạng mục | Nội dung |
|---|---|
| Cơ chế kích hoạt |  |
| Biểu thức lịch (cron) |  |
| Cửa sổ thời gian được phép chạy |  |
| Job phụ thuộc chạy trước |  |
| Thời gian chạy dự kiến |  |
| Cho phép chạy song song |  |

### Nguồn dữ liệu vào

| STT | Loại nguồn | Tên đối tượng | Định dạng | Điều kiện lấy dữ liệu |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Quy tắc kiểm tra và loại bỏ

> Ba tầng theo thứ tự: đúng định dạng tệp → đúng cấu trúc dữ liệu → đúng quy tắc nghiệp vụ. Hành động khi sai: loại bỏ bản ghi / dừng cả lô / ghi nhận cảnh báo. Kèm cơ chế trả báo cáo lỗi về đơn vị gửi và quy trình gửi lại.

| Tầng kiểm tra | Mã quy tắc | Nội dung kiểm tra | Hành động khi sai | Mã thông báo |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Xử lý và ghi nhận

| Bước | Xử lý | Đối tượng ghi | Ghi nhận kết quả |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

### Sơ đồ trình tự

> Viết bằng PlantUML, lưu ở diagrams/«mã chức năng»_seq-«nn».puml. Ở đây chỉ để placeholder — script build tự render và chèn ảnh có caption. Tên participant phải là mã hệ thống đã đăng ký, không viết tên mô tả tự do.

```
[[DIAGRAM: MÃ_CHỨC_NĂNG_seq-01]]
```

### Chạy lại và bù trừ

> Nếu job không idempotent, phải nêu rõ hậu quả khi chạy lại và cách phòng tránh. Đây là câu hỏi vận hành sẽ hỏi đầu tiên khi job lỗi.

| Hạng mục | Nội dung |
|---|---|
| Job có idempotent không |  |
| Chạy lại từ đầu hay từ điểm dừng |  |
| Xử lý bản ghi đã ghi một phần |  |
| Thao tác bù trừ thủ công |  |
| Người được phép chạy lại |  |

### Giám sát và cảnh báo

| STT | Chỉ số giám sát | Ngưỡng cảnh báo | Kênh cảnh báo | Người nhận |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Mã lỗi và thông báo

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
