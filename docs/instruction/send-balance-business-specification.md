# Tài liệu Nghiệp vụ & Yêu cầu: Khai báo thông tin cân đối (Web Portal)

Tài liệu này tổng hợp toàn bộ đặc tả nghiệp vụ, quy định giao diện và yêu cầu chức năng của phân hệ **Khai báo thông tin cân đối** (`/web-portal/send-balance`) dành cho Tổ chức Tín dụng (TCTD) trên cổng thông tin **Web Portal**.

---

## 1. Mục đích nghiệp vụ (Business Purpose)

Phân hệ Gửi thông tin cân đối cho phép các TCTD lập báo cáo đối soát số liệu định kỳ theo các loại tệp (từ D10 đến DKQ), gửi lên hệ thống Core của CIC và theo dõi trạng thái tiếp nhận số liệu từ CIC, đảm bảo tính nhất quán của số liệu báo cáo tín dụng.

---

## 2. Màn hình Danh sách báo cáo (`/web-portal/send-balance`)

### 2.1. Thanh bộ lọc (Filter Bar)
Hỗ trợ tìm kiếm tệp báo cáo theo 5 tiêu chí:
1. **Tên tệp**: Nhập chuỗi tìm kiếm tự do.
2. **Loại tệp**: Cho phép chọn nhiều giá trị trong danh sách 15 loại tệp (từ D10 đến DKQ).
3. **Ngày báo cáo**: Chọn khoảng ngày (Từ ngày - Đến ngày).
4. **Ngày gửi**: Chọn khoảng ngày gửi lên hệ thống (Từ ngày - Đến ngày).
5. **Trạng thái**: Dropdown lọc theo 3 trạng thái của tệp.

### 2.2. Bảng danh sách phân cấp (Tree Table)
*   **Cấu trúc bảng**:
    *   **Dòng cha (Parent row)**: Đại diện cho tệp báo cáo tổng quát. Hiển thị: STT, Nguồn, Tên tệp, Mã đầu mối, Ngày báo cáo, Loại file, Trạng thái và Thao tác.
    *   **Dòng con (Child row)**: Hiển thị các dòng nghiệp vụ chi tiết đối soát bên trong tệp (Ví dụ: CHOVAY, CAMKETNB, v.v.). Các dòng con chỉ hiển thị khi bấm nút mở rộng ở đầu dòng cha.
*   **Trạng thái vòng đời tệp (Report Lifecycle Statuses)**:
    *   **Tạo mới (`TAO_MOI` / Nháp)**: TCTD đang soạn thảo báo cáo. Cho phép chỉnh sửa số liệu trực tiếp trên bảng, cập nhật thông tin tệp hoặc xóa tệp.
    *   **Đã gửi CIC (`DA_GUI_CIC` / Chờ tiếp nhận)**: Báo cáo đã gửi lên CIC để phê duyệt. Khóa tính năng chỉnh sửa số liệu, cho phép TCTD thực hiện hành động "Thu hồi" để chuyển về trạng thái nháp.
    *   **Đã tiếp nhận (`DA_TIEP_NHAN` / Đã duyệt)**: CIC đã tiếp nhận và ghi nhận số liệu. TCTD bị khóa hoàn toàn quyền chỉnh sửa và không được phép thu hồi báo cáo.
*   **Menu thao tác (Action Menu)**:
    *   *Xem chi tiết*: Mở popup modal hiển thị bảng chi tiết số liệu đối soát (chỉ đọc).
    *   *Chỉnh sửa*: Chuyển sang màn hình chỉnh sửa biểu mẫu (chỉ khả dụng khi trạng thái là `TAO_MOI`).
    *   *Thu hồi*: Thu hồi tệp đã gửi lên CIC về trạng thái nháp (chỉ khả dụng khi trạng thái là `DA_GUI_CIC`).
    *   *Xóa*: Xóa vĩnh viễn tệp báo cáo nháp (chỉ khả dụng khi trạng thái là `TAO_MOI`).
*   **Cài đặt hiển thị (Column Settings)**:
    *   Hỗ trợ popover bật/tắt hiển thị cột và kéo thả thay đổi thứ tự sắp xếp cột ngoài bảng chính.

### 2.3. Popup Xem chi tiết số liệu cân đối
*   **Giao diện**: Tiêu đề `"Chi tiết số liệu cân đối"`, hiển thị nhãn trạng thái và bảng thông tin tệp (Tên tệp, kỳ báo cáo, đơn vị gửi).
*   **Footer**: Chứa duy nhất nút **"Đóng"** được căn giữa (`justifyContent: 'center'`), bo góc `radius.md` theo quy chuẩn Design System.

---

## 3. Màn hình Khai báo mới & Chỉnh sửa (`/web-portal/send-balance/new`)

### 3.1. Khối thông tin chung (General Information)
*   **Mã đầu mối báo cáo**: Chỉ đọc, hiển thị mã định danh của TCTD đang đăng nhập (ví dụ: `31358001` - TPBank).
*   **Loại tệp**: Select dropdown chọn 1 trong 15 loại tệp báo cáo (D10, D11, D12, D20, D31, D32, D33, D34, D35, D36, D40, D50, D60, D70, DKQ).
*   **Ngày báo cáo**: DatePicker chọn ngày, chặn các ngày tương lai vượt quá cuối tháng của tháng tiếp theo.
*   **Tên tệp**: AutoComplete input, tự động sinh tên tệp theo quy tắc `[Loại tệp][Mã đầu mối][YYYYMMDD].[Số thứ tự zzz].[Định dạng]` khi thay đổi Loại tệp hoặc Ngày báo cáo.
*   *Lưu ý*: Khi thay đổi Loại tệp hoặc Ngày báo cáo, nếu hệ thống phát hiện kỳ báo cáo đã tồn tại bản ghi nháp hoặc bản ghi đã gửi, hệ thống sẽ hiển thị Alert cảnh báo và tự động nạp dữ liệu hiện tại lên để chỉnh sửa (hoặc khóa chức năng nếu đã gửi).

### 3.2. Khối chi tiết số liệu cân đối
*   **Bảng nhập liệu động (Editable Table)**:
    *   Các cột số liệu thay đổi linh hoạt theo Loại tệp đã chọn dựa trên bộ quy tắc nghiệp vụ (`RAW_FILE_RULES`).
    *   Hỗ trợ kéo thả đổi thứ tự cột số liệu.
*   **Hành động trên bảng**:
    *   *Thêm dòng / Xóa dòng*: Thêm mới hoặc loại bỏ dòng nghiệp vụ trong bảng.
    *   *Lấy dữ liệu gần nhất*: Tự động tìm kiếm báo cáo kỳ trước cùng loại tệp để sao chép nhanh số liệu sang kỳ hiện tại.
    *   *Nhập Excel*:
        - Cho phép người dùng tải tệp Excel lên (dung lượng tối đa **10MB**, chỉ hỗ trợ đuôi `.xlsx` và `.xls`).
        - Nếu bảng chi tiết đang có dữ liệu, hiển thị cảnh báo xác nhận ghi đè dữ liệu.
        - Đọc thông tin chung và tự động sinh dữ liệu đối soát giả lập chất lượng cao từ tệp vào bảng chính.
*   **Hành động cuối trang**:
    *   *Trở về danh sách*: Hủy thay đổi, quay lại màn hình danh sách.
    *   *Lưu nháp*: Lưu trữ báo cáo ở trạng thái `TAO_MOI`.
    *   *Lưu và Gửi CIC*: Lưu trữ báo cáo và gửi lên CIC (chuyển sang trạng thái `DA_GUI_CIC`).
