# Yêu cầu cập nhật giao diện: Quản lý Job (FUNC-HTVH-027)

| Hạng mục | Nội dung |
|---|---|
| Chức năng | FUNC-HTVH-027 Quản lý Job, menu *Hỗ trợ vận hành > Quản trị hệ thống > Quản lý job* |
| Căn cứ | Đặc tả `functions/htvh/FUNC-HTVH-027/FUNC-HTVH-027.md` v2.13 (bản nháp) |
| Ngày | 24/09/2026 |
| Ảnh hiện tại | `functions/htvh/FUNC-HTVH-027/assets/` |

**Cách đọc:**
- Mỗi yêu cầu có mã (G-xx cho quy ước chung, Mx-yy cho từng màn hình), kèm hiện trạng trên ảnh, yêu cầu mới và căn cứ trong đặc tả.
- Loại **Sửa** là chỗ ảnh đang khác đặc tả. Loại **Bổ sung** là trạng thái hoặc biến thể còn thiếu ảnh.
- Mã `BR-HTVH-027-xxx` là quy tắc nghiệp vụ trong đặc tả.

Khi xuất ảnh mới, giữ nguyên tên file để tài liệu tự dùng ảnh mới. Ảnh biến thể
mới đặt tên theo mẫu `FEAT-HTVH-027-«số tính năng»_«mô-tả».png`, ví dụ
`FEAT-HTVH-027-03_su-kien.png`.

## 1. Quy ước chung (áp dụng mọi màn hình)

| Mã | Loại | Yêu cầu | Căn cứ |
|---|---|---|---|
| G-01 | Sửa | Biểu thức Cron luôn có **6 trường** (Giây Phút Giờ Ngày Tháng Thứ). Đúng một trong hai trường Ngày và Thứ là `?`. Ví dụ: `0 0 2 * * ?`, `0 */30 * * * ?`, `0 0 17 ? * MON-FRI`. Không dùng dạng 5 trường như `0 2 * * *`. | BR-HTVH-027-014, Phụ lục Cron |
| G-02 | Sửa | Dòng diễn giải Cron dùng giờ 24h, không có "AM/PM". Ví dụ: "Chạy hằng ngày vào lúc 01:00:00". | BR-HTVH-027-014 |
| G-03 | Sửa | Trạng thái Job chỉ có 2 nhãn: **Hoạt động** và **Không hoạt động**. Màu thẻ theo danh mục Trạng thái (HT-02, loại `TT_JOB`). | Sơ đồ trạng thái JOB |
| G-04 | Sửa | Trạng thái lượt chạy có 4 nhãn: **Đang chạy**, **Thành công**, **Thất bại**, **Đã hủy**. Không dùng nhãn "Lỗi". | Sơ đồ trạng thái LUOTCHAY |
| G-05 | Sửa | Trường chọn có **≤ 6 lựa chọn** dùng **radio** (CMP-005), không dùng dropdown. Loại Job vẫn là dropdown vì lấy từ danh mục HT-73. | Sổ component CMP-002/CMP-005 |
| G-06 | Sửa | Dữ liệu mẫu Mã Job tối đa **20 ký tự**, chỉ gồm `A-Z`, `0-9`, `-`, `_`. | BR-HTVH-027-001 |
| G-07 | Sửa | Số có phân cách hàng nghìn bằng **dấu chấm** (`4.950`). Ngày giờ theo dạng `dd/MM/yyyy HH:mm:ss`. | BR-HTVH-027-019 |
| G-08 | Sửa | Chữ trên thông báo theo đúng mục 10 của file này. | Bảng Thông báo từng tính năng |

## 2. Danh sách Job (MH-HTVH-027-001)

Ảnh: [FEAT-HTVH-027-01_danh-sach-job.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-01_danh-sach-job.png)

| Mã | Loại | Hiện trạng | Yêu cầu | Căn cứ |
|---|---|---|---|---|
| M1-01 | Sửa | Cột Biểu thức Cron dạng 5 trường (`0 2 * * *`, `*/30 * * * *`) | Đổi sang 6 trường theo G-01 | G-01 |
| M1-02 | Sửa | Ô lọc *Trạng thái* là dropdown | Radio 2 lựa chọn: Hoạt động / Không hoạt động | G-05 |
| M1-03 | Sửa | Mã Job mẫu `BATCH_PROCESS_SETTLEMENT`, `EXPORT_MONTHLY_STATEMENT` dài quá 20 ký tự, bị tràn cột | Dùng mã ≤ 20 ký tự, ví dụ `BATCH_SETTLEMENT`, `EXPORT_MONTHLY_STMT` | G-06 |
| M1-04 | Sửa | Mã Job hiển thị dạng link màu xanh | Chữ dạng mã: **phông đơn cách, in đậm**, không phải link. Nhấp vào dòng thì mở popup Chi tiết. | Thành phần #11 |
| M1-05 | Bổ sung | Mọi dòng mẫu đều "Hoạt động" | Thêm ít nhất 1 dòng "Không hoạt động" | G-03 |
| M1-06 | Bổ sung | Chưa có ảnh khi đã chọn dòng | Khi chọn ≥ 1 dòng: nút **Chạy Job (N)** thành nút chính (N là tổng số dòng đã chọn trên mọi trang); *Thiết lập job mới* đổi sang kiểu nút thường. Chỉ có **một** nút chính tại mỗi thời điểm. | BR-HTVH-027-018, BR-HTVH-027-011 |
| M1-07 | Bổ sung | Chưa có tooltip Cron | Rê chuột vào ô Cron hiện tooltip "Diễn giải: Chạy hằng ngày vào lúc 02:00:00". Ô Cron trống (Job không phải `SCHEDULER`) hiển thị `-`. | BR-HTVH-027-014 |
| M1-08 | Bổ sung | Chưa có biến thể cho vai trò chỉ xem | Vai trò ROLE-CBNV (không có quyền chạy): ô chọn dòng bị vô hiệu hóa, không có nút *Chạy Job (N)* và *Thiết lập job mới* | BR-HTVH-027-012 |

Hai ảnh *Cài đặt hiển thị* và *Xuất Excel*
([FEAT-HTVH-027-01_cai-dat-hien-thi.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-01_cai-dat-hien-thi.png),
[FEAT-HTVH-027-01_xuat-excel.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-01_xuat-excel.png))
đã khớp đặc tả, **không cần sửa**.

## 3. Popup Chi tiết Job (MH-HTVH-027-002)

Ảnh: [FEAT-HTVH-027-02_chi-tiet-job.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-02_chi-tiet-job.png)

| Mã | Loại | Hiện trạng | Yêu cầu | Căn cứ |
|---|---|---|---|---|
| M2-01 | Sửa | Biểu thức Cron `0 2 * * *`; cột Giá trị cũ/mới trong Lịch sử thay đổi dùng Cron 5 trường | Đổi sang 6 trường (ví dụ `0 0 2 * * ?`) | G-01 |
| M2-02 | Bổ sung | Chưa có biến thể Job `EVENT` hoặc `MANUAL` | Biểu thức Cron và *Xử lý khi bỏ lỡ lượt chạy* hiển thị `-`. Job `EVENT` hiển thị thêm *Tên sự kiện kích hoạt*. | BR-HTVH-027-005 |
| M2-03 | Bổ sung | Chưa có biến thể ROLE-CBNV | Tham số bổ sung: giá trị các khóa chứa `password`, `secret`, `token`, `key` hiển thị `******`. Email (chung và riêng) che phần trước `@`, ví dụ `*****@cic.org.vn`. Cột Địa chỉ IP chỉ hiện dải cuối `***.***.***.105`. Không có nút *Chạy ngay*. | Phân loại dữ liệu, FEAT-02 |
| M2-04 | Bổ sung | Khối Cấu hình phụ thuộc chỉ có trạng thái rỗng | Thêm trạng thái có dữ liệu: bảng 3 cột *Mã Job phụ thuộc (xử lý trước)*, *Tên Job*, *Điều kiện kích hoạt*, chỉ đọc | Thành phần #17.2 |

## 4. Thiết lập Job mới (MH-HTVH-027-004, chế độ tạo mới)

Ảnh: [FEAT-HTVH-027-03_them-moi.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-03_them-moi.png)

| Mã | Loại | Hiện trạng | Yêu cầu | Căn cứ |
|---|---|---|---|---|
| M3-01 | Sửa | *Điều kiện kích hoạt* là dropdown | Radio 3 lựa chọn: Bộ lập lịch (Scheduler) / Theo sự kiện (Event-driven) / Thủ công (Manual) | G-05 |
| M3-02 | Sửa | *Chạy song song* là dropdown | Radio: Khóa chạy song song / Cho phép chạy song song | G-05 |
| M3-03 | Sửa | *Xử lý khi bỏ lỡ lượt chạy* là dropdown | Radio, mặc định chọn "Chạy bù ngay khi đủ điều kiện"; lựa chọn thứ hai ghi đúng "Bỏ qua lượt lỡ, chờ lịch tiếp theo". **Chỉ hiển thị khi Điều kiện kích hoạt = Scheduler.** | BR-HTVH-027-005, G-05 |
| M3-04 | Sửa | Thiếu dấu `*` bắt buộc | Thêm `*` cho: Số lần thử lại tối đa, Chạy song song, Xử lý khi bỏ lỡ lượt chạy, Lưu log thành công, Lưu log lỗi. Chờ ban đầu bắt buộc khi Số lần thử lại > 0. | BR-HTVH-027-005/007/008, thành phần #10–16.2 |
| M3-05 | Sửa | Lưu log thành công = 7, Lưu log lỗi = 30 | Giá trị mặc định **3650** cho cả hai | Thành phần #16.1, #16.2 |
| M3-06 | Sửa | Cron `0 0 1 * * *`; diễn giải "…01:00:00 AM" | `0 0 1 * * ?`; diễn giải "Chạy hằng ngày vào lúc 01:00:00" | G-01, G-02 |
| M3-07 | Sửa | Nhãn "Email nhận cảnh báo chung (Phân cách bằng dấu chấm phẩy ; hoặc Enter)" | "(Phân cách bằng dấu phẩy, dấu chấm phẩy, Enter hoặc xuống dòng)" | BR-HTVH-027-028 |
| M3-08 | Sửa | Bảng Job phụ thuộc có cột "Mã Job phụ thuộc" | Đổi tên cột thành **"Mã Job phụ thuộc (xử lý trước)"**. Bảng 4 cột: Mã Job phụ thuộc (xử lý trước), Tên Job, Điều kiện kích hoạt, Thao tác. | Thành phần #16.4 |
| M3-09 | Sửa | Chưa có dòng mẫu phụ thuộc | Ở dòng có dữ liệu, cột *Điều kiện kích hoạt* là radio: Khi thành công / Khi thất bại / Luôn luôn, mặc định "Khi thành công" | Thành phần #16.5, G-05 |
| M3-10 | Sửa | Ma trận cảnh báo ghi "Khi gặp sự cố / Thất bại", "Khi thử lại (Retry)" | Ghi đúng 5 sự kiện: Khi bắt đầu chạy / Khi hoàn tất thành công / Khi chạy chậm quá SLA / **Khi gặp sự cố** / **Khi thử lại** | Thành phần #19 (FEAT-02) |
| M3-11 | Bổ sung | Chỉ có ảnh Scheduler | Biến thể **Theo sự kiện**: hiện *Tên sự kiện kích hoạt* (bắt buộc, tối đa 255 ký tự, không có dấu cách); ẩn Biểu thức Cron và Xử lý khi bỏ lỡ lượt chạy | BR-HTVH-027-005, BR-HTVH-027-036 |
| M3-12 | Bổ sung | | Biến thể **Thủ công**: ẩn cả Biểu thức Cron, Tên sự kiện kích hoạt, Xử lý khi bỏ lỡ lượt chạy | BR-HTVH-027-005 |
| M3-13 | Bổ sung | | Biến thể **ROLE-QLVH**: khối Cấu hình phụ thuộc chỉ đọc, bảng rỗng, nút *Thêm Job phụ thuộc* bị vô hiệu hóa | BR-HTVH-027-012 |
| M3-14 | Bổ sung | | Biến thể **thiếu quyền `manage_param`**: ô Tham số bổ sung chỉ đọc | BR-HTVH-027-041 |
| M3-15 | Bổ sung | | Bảng phụ thuộc đủ **10 dòng**: nút *Thêm Job phụ thuộc* bị vô hiệu hóa, kèm tooltip giới hạn | BR-HTVH-027-027 |
| M3-16 | Bổ sung | | Trạng thái lỗi: thông báo inline dưới từng ô sai (ERR_001, ERR_002, ERR_004); lỗi vòng tròn phụ thuộc (ERR_021) đánh dấu cả khối Cấu hình phụ thuộc; kênh cảnh báo không có người nhận hợp lệ thì đánh dấu dòng và cột kênh | BR-HTVH-027-022, BR-HTVH-027-034, mục 10 |
| M3-17 | Bổ sung | | Ô *Người dùng / Email nhận riêng*: kết quả tìm hiển thị `Username - Họ tên - Email`. Tag người dùng nội bộ khác màu tag email ngoài (theo design token). | Thành phần #20 |

## 5. Cập nhật thông tin Job (MH-HTVH-027-004, chế độ cập nhật)

Ảnh: [FEAT-HTVH-027-04_chinh-sua.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-04_chinh-sua.png)

| Mã | Loại | Hiện trạng | Yêu cầu | Căn cứ |
|---|---|---|---|---|
| M4-01 | Sửa | Ô *Điều kiện kích hoạt* bị khóa (xám) khi Job có phụ thuộc | **Không khóa.** Quan hệ phụ thuộc không khóa trường này. Đổi sang radio như M3-01. | BR-HTVH-027-025 |
| M4-02 | Sửa | Bảng Job phụ thuộc có 3 cột, Mã và Tên gộp trong một dropdown | Thống nhất 4 cột như M3-08. Cột *Tên Job* tự điền sau khi chọn mã. | Thành phần #16.4 |
| M4-03 | Sửa | Ô Chờ tối đa tô đỏ `2400000` nhưng không có thông báo | Thêm dòng lỗi inline: "Chờ tối đa (giây) phải từ 1 đến 86400 giây." | BR-HTVH-027-006, ERR_004 |
| M4-04 | Sửa | | Áp dụng các yêu cầu M3-02, M3-04, M3-07, M3-08, M3-09, M3-10 | Như trên |
| M4-05 | Giữ | Job Theo sự kiện đang ẩn *Xử lý khi bỏ lỡ lượt chạy* | **Đúng đặc tả**, giữ nguyên | BR-HTVH-027-005 |
| M4-06 | Bổ sung | | Biến thể **ROLE-QLVH**: các dòng phụ thuộc hiện có chỉ đọc, không có nút *Xóa*, nút *Thêm Job phụ thuộc* bị vô hiệu hóa | BR-HTVH-027-012 |
| M4-07 | Bổ sung | | Biến thể **thiếu quyền `manage_param`**: ô Tham số bổ sung hiển thị đầy đủ nhưng chỉ đọc | BR-HTVH-027-041 |
| M4-08 | Bổ sung | | Xung đột dữ liệu: toast WAR_003, giữ nguyên dữ liệu đang nhập | BR-HTVH-027-033 |

## 6. Menu thao tác trên dòng

Ảnh: [FEAT-HTVH-027-05_menu-thao-tac.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-05_menu-thao-tac.png).
Ảnh hiện tại là menu của Job **Không hoạt động** và đã khớp đặc tả.

| Mã | Loại | Yêu cầu | Căn cứ |
|---|---|---|---|
| M5-01 | Bổ sung | Menu của Job **Hoạt động**: Xem chi tiết, Chỉnh sửa, Chạy ngay, **Ngừng hoạt động**, Lịch sử chạy Job. Không có *Xóa* và không có đường phân cách. | Ma trận thao tác theo trạng thái |
| M5-02 | Bổ sung | Menu của **ROLE-CBNV**: chỉ Xem chi tiết và Lịch sử chạy Job | BR-HTVH-027-012 |

## 7. Popup Xác nhận thực hiện Job (MH-HTVH-027-005)

Ảnh: [FEAT-HTVH-027-06_xac-nhan-chay-job.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-06_xac-nhan-chay-job.png)

| Mã | Loại | Hiện trạng | Yêu cầu | Căn cứ |
|---|---|---|---|---|
| M6-01 | Sửa | "Bạn có chắc chắn muốn kích hoạt chạy Job này ngay bây giờ không?" | "Bạn có chắc chắn muốn kích hoạt chạy job không?" | CONF_001 |
| M6-02 | Bổ sung | | Chạy **hàng loạt** (N > 1): không có khối Mã Job / Tên Job; câu hỏi kèm tổng số Job sẽ chạy | FEAT-06 bước 3 |
| M6-03 | Bổ sung | | Kết quả chạy hàng loạt: hiển thị `X/Y` Job được tiếp nhận, liệt kê từng Job bị từ chối (Mã Job + lý do) | BR-HTVH-027-030 |
| M6-04 | Bổ sung | | Đang gửi yêu cầu: nút *Chạy ngay* ở trạng thái xử lý (loading) và bị vô hiệu hóa | BR-HTVH-027-031 |
| M6-05 | Bổ sung | | Tham số sai định dạng: lỗi inline "Tham số không hợp lệ hoặc sai định dạng." dưới ô tham số | BR-HTVH-027-039, ERR_002 |
| M6-06 | Bổ sung | | Biến thể **thiếu quyền `manage_param`**: ô Tham số chạy bổ sung chỉ đọc | BR-HTVH-027-041 |

## 8. Popup Lịch sử chạy Job (MH-HTVH-027-003)

Ảnh: [FEAT-HTVH-027-07_lich-su-chay-job.png](../functions/htvh/FUNC-HTVH-027/assets/FEAT-HTVH-027-07_lich-su-chay-job.png)

| Mã | Loại | Hiện trạng | Yêu cầu | Căn cứ |
|---|---|---|---|---|
| M7-01 | Sửa | Có ô lọc và cột **Node thực thi** | **Bỏ** cả ô lọc và cột. Bảng còn 8 cột: STT, Mã lượt chạy, Thời gian bắt đầu, Thời gian kết thúc, Thời lượng, Bản ghi xử lý, Số lần thử lại, Trạng thái. | FEAT-07 |
| M7-02 | Sửa | Thẻ trạng thái "Lỗi" | "Thất bại" | G-04 |
| M7-03 | Sửa | Ô lọc *Trạng thái chạy* là dropdown | Radio 4 lựa chọn: Đang chạy / Thành công / Thất bại / Đã hủy | G-05 |
| M7-04 | Sửa | Bản ghi xử lý dạng "4,950 / 5 lỗi" | `✓ 4.950` màu xanh; `✕ 5` màu đỏ, chỉ hiện khi số lỗi > 0 | FEAT-07 thành phần #9, G-07 |
| M7-05 | Sửa | Mã lượt chạy là link | Chữ thường, không phải link (không có thao tác khi nhấp) | FEAT-07 thành phần #5 |
| M7-06 | Giữ | Có nút *Làm mới* và *Tìm kiếm* | **Giữ nguyên.** Điều kiện lọc chỉ áp dụng khi nhấp *Tìm kiếm*. | FEAT-07 (đã chốt) |
| M7-07 | Bổ sung | | Lượt chạy đang chạy: Thời gian kết thúc và Thời lượng hiển thị `-` | ALT-07-03 |

## 9. Không cần sửa

- `FEAT-HTVH-027-01_cai-dat-hien-thi.png`
- `FEAT-HTVH-027-01_xuat-excel.png`
- `FEAT-HTVH-027-05_menu-thao-tac.png`: chỉ cần bổ sung biến thể ở mục 6.

## 10. Chữ hiển thị trên thông báo

Chữ dưới đây đã được thế tham số từ sổ thông báo dùng chung. Cột *Hình thức* lấy theo sổ.

| Mã | Tình huống | Chữ hiển thị | Hình thức |
|---|---|---|---|
| SUC_002 | Lưu cấu hình (tạo mới, cập nhật) | Lưu cấu hình job thành công. | Toast, tự tắt 3–5 giây |
| SUC_002 | Đổi trạng thái | Cập nhật trạng thái job thành công. | Toast |
| SUC_002 | Xóa | Xóa job thành công. | Toast |
| SUC_004 | Chạy Job thành công | Hệ thống đã kích hoạt chạy job thành công. Vui lòng vào Lịch sử chạy Job để xem kết quả | Popup hoặc Toast |
| SUC_001 | Xuất Excel | Xuất Excel trang hiện tại thành công. / Xuất Excel theo bộ lọc thành công. | Toast |
| CONF_001 | Xác nhận chạy | Bạn có chắc chắn muốn kích hoạt chạy job không? | Popup 2 nút |
| CONF_001 | Xác nhận đổi trạng thái | Bạn có chắc chắn muốn thay đổi trạng thái job không? | Popup 2 nút |
| CONF_002 | Xác nhận xóa | Bạn có chắc chắn muốn xóa job không? Dữ liệu sau khi xóa sẽ không thể phục hồi. | Popup 2 nút: Tiếp tục / Hủy |
| CONF_002 | Rời biểu mẫu chưa lưu | Bạn có chắc chắn muốn hủy thay đổi cấu hình job không? Dữ liệu sau khi hủy thay đổi cấu hình sẽ không thể phục hồi. | Popup 2 nút: Tiếp tục / Hủy |
| ERR_001 | Bỏ trống trường bắt buộc | «Tên trường» không được để trống. | Inline, chữ đỏ dưới ô |
| ERR_002 | Sai định dạng | «Tên trường» không hợp lệ hoặc sai định dạng. | Inline |
| ERR_004 | Ngoài khoảng | «Tên trường» phải từ «min» đến «max» «đơn vị». | Inline |
| ERR_005 | Trùng Mã Job | job «Mã Job» đã tồn tại. Vui lòng kiểm tra lại. | Inline |
| ERR_021 | Phụ thuộc vòng tròn | Phát hiện phụ thuộc vòng tròn giữa các job. Vui lòng kiểm tra lại quan hệ phụ thuộc. | Chưa chốt (BA đang xác định) |
| ERR_022 | Không thể ngừng hoạt động | Không thể ngừng hoạt động job do có job khác đang phụ thuộc vào kết quả xử lý. | Chưa chốt (BA đang xác định) |
| WAR_002 | Xóa Job đang Hoạt động | Không thể xóa. Bản ghi đang ở trạng thái Hoạt động. | Popup có nút Đóng |
| WAR_003 | Dữ liệu đã bị người khác sửa | Dữ liệu đã bị thay đổi bởi người khác. Vui lòng làm mới trang. | Toast |
| WAR_005 | Đạt giới hạn | Số lượng Job phụ thuộc đã đạt giới hạn 10. / Số lượng email nhận cảnh báo đã đạt giới hạn 20. | Popup có nút Đóng |
| INF_003 | Không có dữ liệu | Không tìm thấy bản ghi phù hợp. | Toast, hoặc trạng thái rỗng trong bảng |

Chữ viết hoa đầu câu (ví dụ "job" đứng đầu câu ở ERR_005) BA sẽ chốt riêng.
Designer tạm viết hoa chữ đầu câu khi dựng ảnh.
