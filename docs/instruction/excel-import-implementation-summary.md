# Tài liệu Nghiệp vụ & Kỹ thuật: Tính năng Nhập Excel (Web Portal)

Tài liệu này tổng hợp đặc tả nghiệp vụ, yêu cầu giao diện (UI/UX) và các thay đổi kỹ thuật của chức năng **Nhập Excel** tại màn hình khai báo báo cáo cân đối mới (`/web-portal/send-balance/new`) trên phân hệ **Web Portal** của hệ thống **CIC Core System**.

---

## 1. Yêu cầu Nghiệp vụ (Business Requirements)

Chức năng Nhập Excel hỗ trợ các Tổ chức Tín dụng (TCTD) nhanh chóng tải lên số liệu đối chiếu chi tiết từ tệp tin Excel có sẵn thay vì nhập thủ công từng dòng trên giao diện web.

### 1.1. Luồng xử lý chính (Main Flow)
1. Người dùng truy cập trang khai báo báo cáo cân đối mới.
2. Nhấp vào nút **"Nhập Excel"** ở thanh công cụ của khối chi tiết.
3. Popup modal hiển thị, cho phép kiểm tra thông tin chung (Mã đầu mối, Loại tệp, Ngày báo cáo, Tên tệp) và tải lên tệp Excel.
4. Sau khi tải tệp hợp lệ và nhấn **"Nhập dữ liệu"**:
   - Nếu bảng dữ liệu hiện tại có sẵn dòng (hoặc đã tải tệp trước đó), hệ thống hiển thị cảnh báo xác nhận ghi đè.
   - Nếu đồng ý, hệ thống tự động đồng bộ thông tin chung từ popup ra trang chính, đồng thời sinh dữ liệu đối soát chi tiết giả lập chất lượng cao vào bảng chính.

### 1.2. Ràng buộc & Kiểm duyệt (Validation Rules)
*   **Thông tin chung trong Popup:**
    *   *Mã đầu mối báo cáo*: Chỉ đọc (Read-only), lấy mặc định từ trang chính.
    *   *Loại tệp*: Cho phép chọn từ danh sách dropdown.
    *   *Ngày báo cáo*: Chọn qua DatePicker, chặn các ngày sau cuối tháng của tháng tiếp theo.
    *   *Tên tệp*: Sử dụng AutoComplete để chọn nhanh hoặc tự động nhập.
*   **Quy tắc sinh tên tệp tự động:** Khi thay đổi Loại tệp hoặc Ngày báo cáo trong popup, hệ thống tự động cập nhật Tên tệp theo cấu trúc: `[Loại tệp][Mã đầu mối][YYYYMMDD].[Số thứ tự zzz].[Đuôi tệp]` (đuôi tệp khớp với tệp tin đã tải lên: `.xlsx` hoặc `.xls`).
*   **Kiểm tra tệp tin tải lên:**
    *   Chỉ chấp nhận định dạng Excel (`.xlsx`, `.xls`).
    *   Dung lượng tối đa **10MB**.
    *   Thực hiện kiểm tra định dạng và dung lượng tức thì tại callback `beforeUpload`. Nếu không đạt yêu cầu, hiển thị thông báo lỗi và từ chối nhận file.
*   **Cảnh báo xác nhận ghi đè (Overwrite Confirmation):**
    *   Nếu bảng chi tiết ngoài trang chính đang có dữ liệu (`editDetails.length > 0` - do thêm tay hoặc do dữ liệu nháp của kỳ cũ được nạp sẵn), hệ thống bắt buộc hiển thị hộp thoại cảnh báo:
        > *"Kỳ báo cáo hiện tại hoặc bảng chi tiết đã có dữ liệu. Việc nhập tệp Excel mới sẽ xóa toàn bộ số liệu hiện tại và ghi đè bằng dữ liệu trong tệp Excel. Bạn có chắc chắn muốn tiếp tục?"*
    *   Chỉ khi người dùng chọn **"Tiếp tục"**, hệ thống mới thực hiện ghi đè và cập nhật dữ liệu. Nếu chọn **"Hủy"**, tiến trình bị ngắt để bảo vệ dữ liệu.

---

## 2. Đặc tả Giao diện (UI/UX) & Design System

Trang đăng ký và popup modal tuân thủ nghiêm ngặt các quy tắc thiết kế hệ thống của dự án:

### 2.1. Nút "Nhập Excel" ngoài trang chính
*   **Vị trí**: Đặt bên trái nút **"Thêm dòng"** trong thanh công cụ của khối chi tiết.
*   **Kích thước**: Sử dụng `size="small"` (tương ứng chiều cao **`24px`** theo token `size.sm`) để đồng bộ chiều cao gọn gàng với các nút bấm công cụ khác trên header của card.
*   **Màu sắc**: Màu viền và chữ mang tông xanh lá của Excel (`color: '#16a34a'`, `borderColor: '#16a34a'`) để tạo điểm nhấn UX và phân biệt với các nút chức năng khác.

### 2.2. Popup Modal Nhập dữ liệu
*   **Tiêu đề Modal**: Thiết kế tinh gọn, sử dụng chữ thường viết hoa chữ đầu: `"Nhập dữ liệu từ tệp Excel"` (lược bỏ icon tiêu đề và tránh viết IN HOA toàn bộ để thống nhất với quy tắc thiết kế Modal).
*   **Footer Modal**:
    *   Các nút bấm được căn giữa (`justifyContent: 'center'`, `gap: 12`).
    *   Nút hủy tác vụ sử dụng nhãn **"Hủy"** thay vì "Đóng", bo góc `radius.md` và chiều rộng tối thiểu `minWidth: 100`.
    *   Nút xác nhận sử dụng nhãn **"Nhập dữ liệu"**, kiểu nút primary với màu nền Web Portal (`colors.subsystem.portal`).
*   **Thẻ thông tin tệp đã tải**: Khi tệp tin được tải lên thành công, vùng kéo thả ẩn đi và hiển thị thẻ thông tin tệp gọn gàng nền xanh lá nhạt (`background: '#f0fdf4'`, bo góc `radius.md`) gồm: Tên tệp, dung lượng và nút xóa (thùng rác) màu đỏ để hủy chọn tệp.

### 2.3. Hộp thoại cảnh báo ghi đè (Confirm Dialog)
*   Sử dụng `Modal.confirm` imperative API nhưng được tùy biến phần `footer` để **căn giữa** hai nút bấm **"Hủy"** và **"Tiếp tục"** (`justifyContent: 'center'`, `gap: 12`) và áp dụng bo góc `radius.md` đúng chuẩn Design System (khác với giao diện mặc định nút lệch phải của AntD).

---

## 3. Cấu trúc Tệp tin & Các thay đổi kỹ thuật

Tính năng được hiện thực hóa qua các thay đổi tại các tệp tin sau:

*   **[SendBalanceFormPage.tsx](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/frontend/src/modules/web-portal/SendBalance/SendBalanceFormPage.tsx)**:
    *   Tích hợp nút bấm và component Modal.
    *   Khai báo state quản lý popup (`importModalVisible`, `importMaDauMoi`, `importPhanLoai`, `importNgayBaoCao`, `importTenTep`, `importFile`, `importLoading`).
    *   Xây dựng hook `useEffect` tự động cập nhật tên tệp trong popup khi đổi Loại tệp / Ngày báo cáo.
    *   Triển khai callback `beforeUploadExcel` kiểm duyệt tệp và `handleConfirmImport` xử lý ghi đè dữ liệu.
*   **[CLAUDE.md](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/CLAUDE.md)**:
    *   Bổ sung Quy tắc bắt buộc số 7 (**Kiểm tra sự tuân thủ thiết kế — Design Compliance Check**) nhằm hướng dẫn mọi lập trình viên/AI đối chiếu giao diện Modal, Form và căn giữa footer trước khi tiến hành code.
