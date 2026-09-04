# Phân tích GAP và Bổ sung SRS - Phân hệ Quản lý Job (IV_2_5_3_Quan_ly_Job)

**Người đánh giá:** Antigravity Agent (Góc độ Kiến trúc sư Hệ thống Lớn)
**Mục đích:** Chỉ ra các điểm thiếu sót trong SRS hiện tại và cung cấp nội dung để BA copy/paste bổ sung trực tiếp vào tài liệu SRS.

---

## Phần 1: Phân tích 5 Điểm GAP (Chưa hợp lý / Còn thiếu)

1. **Thiếu Tham số động khi chạy thủ công (Execution Parameters):**
   - **Thực trạng SRS:** Chức năng "Chạy ngay" chỉ hiển thị popup xác nhận mà không cho phép nhập tham số.
   - **Đề xuất:** Trên UI Popup "Xác nhận thực hiện Job", bổ sung một trường nhập JSON/Text để người dùng truyền tham số ghi đè cho riêng lượt chạy đó (vd: `run_date=2023-10-01`).

2. **Chưa có UI cho "Cấu hình Phụ thuộc Job" (Job Dependency / DAG):**
   - **Thực trạng SRS:** Có phân quyền "Cấu hình phụ thuộc" nhưng UI Thiết lập Job hoàn toàn vắng bóng.
   - **Đề xuất:** Bổ sung danh sách "Job Phụ thuộc (Parent Job)" vào UI để một Job có thể chờ các Job khác chạy xong mới chạy. (Chi tiết xem Phần 2).

3. **Xử lý môi trường đa trạm (Clustered/Distributed Execution):**
   - **Thực trạng SRS:** Nhắc tới "Khóa chạy song song" nhưng chưa xử lý khi triển khai nhiều Server (Node) cùng lúc.
   - **Đề xuất:** Backend cần cơ chế khóa phân tán (Distributed Lock) và DB cần lưu vết `EXECUTED_BY_NODE`.

4. **Bỏ sót cảnh báo "Chậm trễ SLA" (SLA Breach Alert):**
   - **Thực trạng SRS:** Ma trận cảnh báo hỗ trợ: Bắt đầu, Thành công, Thất bại, Thử lại.
   - **Đề xuất:** Bổ sung loại sự kiện **SLA Breach (Quá hạn dự kiến)** vào ma trận cảnh báo. Điều này giúp báo động khi Job chạy quá lâu nhưng chưa tới mức bị ngắt (Timeout).

5. **Thiếu chính sách Dọn dẹp Dữ liệu (Retention Policy):**
   - **Thực trạng SRS:** Bảng Lịch sử lượt chạy sẽ phình to rất nhanh.
   - **Đề xuất:** Bổ sung cấu hình "Số ngày lưu log thành công" và "Số ngày lưu log lỗi" cho từng Job để hệ thống tự dọn dẹp.

---

## Phần 2: Nội dung sao chép (Copy-Paste) dành cho BA để bổ sung vào SRS

Dưới đây là đặc tả chi tiết để BA bổ sung vào tài liệu **`IV_2_5_3_2.md` (Thiết lập Job mới)**.

### 2.1. Bổ sung vào: Mô tả yêu cầu (Mục FEAT-HTVH-036-05)
> "Bổ sung khả năng thiết lập **Chuỗi công việc (Job Dependency)** để hệ thống tự động hóa các luồng xử lý phức tạp. Tại màn hình Thiết lập Job, người dùng có thể khai báo Job hiện tại sẽ bị phụ thuộc (chạy sau) những Job nào (Parent Jobs). Hệ thống phải đảm bảo kiểm soát tính toàn vẹn của chuỗi phụ thuộc, nghiêm cấm tạo ra vòng lặp vô tận (ví dụ: Job A đợi Job B, Job B lại đợi Job A)."

### 2.2. Bổ sung vào: Thiết kế giao diện (Bảng Mô tả các thành phần màn hình MH-HTVH-036-005)

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Mặc định | Giới hạn | Mô tả ràng buộc |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 23 | **Khối Cấu hình phụ thuộc (Job Dependency)** | Khối hiển thị (Container) | Không | | Khối mới nằm dưới khối "Lập lịch và xử lý lỗi". Bao gồm một Bảng danh sách các Job mà Job hiện tại phụ thuộc vào (Parent Jobs). |
| 24 | **Nút "Thêm Job phụ thuộc"** | Button | Không | | Mở Popup cho phép chọn nhiều Job đang có trạng thái ACTIVE/INACTIVE trên hệ thống. |
| 25 | **Bảng Job phụ thuộc** | Grid (Table) | Không | Tối đa 10 dòng | Gồm các cột: Mã Job (Parent), Tên Job, Điều kiện kích hoạt, Thao tác (Xóa). |
| 26 | **Cột Điều kiện kích hoạt (Trong Bảng Phụ thuộc)** | Danh sách chọn một (Dropdown) | Bắt buộc (nếu có dòng) / "Khi Job trước Thành công" | 3 Tùy chọn | "Khi Parent Thành công" / "Khi Parent Thất bại" / "Luôn luôn kích hoạt". |

### 2.3. Bổ sung vào: Quy tắc nghiệp vụ (Business Rules)

| Mã quy tắc | Nội dung quy tắc | Áp dụng cho | Mã thông báo khi vi phạm |
| :--- | :--- | :--- | :--- |
| **BR-HTVH-036-019** | **Logic rẽ nhánh (Trigger Override):** Khi một Job được khai báo có ít nhất 1 Job Parent (tức là nó bị phụ thuộc), hệ thống tự động khóa ô "Điều kiện kích hoạt" trên khối Thông tin chung về trạng thái **Theo sự kiện (EVENT)**. Mọi biểu thức Cron sẽ bị vô hiệu hóa vì lúc này Job phải chạy theo luồng của Parent thay vì chạy theo giờ. | FEAT-HTVH-036-05 | Không áp dụng (Tự động khóa UI) |
| **BR-HTVH-036-020** | **Điều kiện hội tụ (Join Condition):** Nếu Job hiện tại có cấu hình phụ thuộc vào N (nhiều hơn 1) Parent Jobs với điều kiện "Khi Parent Thành công", Job hiện tại chỉ được kích hoạt khởi chạy khi và chỉ khi TOÀN BỘ `N` Parent Jobs đều đã hoàn thành và đạt trạng thái SUCCESS. | Lõi hệ thống (Backend) | Không áp dụng |
| **BR-HTVH-036-021** | **Chống vòng lặp phụ thuộc (Circular Dependency):** Khi nhấp "Lưu", hệ thống phải quét cây phụ thuộc. Nếu phát hiện Job hiện tại tạo ra vòng lặp (Ví dụ: Job A -> Job B -> Job C -> Job A), hệ thống phải chặn lại không cho phép lưu cấu hình. | FEAT-HTVH-036-05 | **ERR_023:** Phát hiện vòng lặp phụ thuộc với Job {Mã Job gây lặp}. Vui lòng kiểm tra lại. |
| **BR-HTVH-036-022** | **Xóa Job có ràng buộc:** Không cho phép xóa (Thao tác Xóa Job) hoặc Vô hiệu hóa (Thao tác INACTIVE) một Job nếu nó đang đóng vai trò là Parent Job của một Job ACTIVE khác trên hệ thống. | FEAT-HTVH-036-06 | **ERR_024:** Không thể vô hiệu hóa/xóa vì Job này đang là điều kiện chạy của Job {Danh sách Child Job}. |
