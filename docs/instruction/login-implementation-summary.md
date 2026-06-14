# Tài liệu Nghiệp vụ: Trang Đăng nhập (CIC Core System)

Tài liệu này lưu trữ đặc tả nghiệp vụ, yêu cầu thiết kế và cấu trúc tệp tin của trang Đăng nhập độc lập (`/auth/login`) trên hệ thống **CIC Core System**.

---

## 1. Yêu cầu Nghiệp vụ (Business Logic)

### 1.1. Giao thức Xác thực & Tài khoản
*   **Đăng nhập Nội bộ**: Chỉ hỗ trợ xác thực bằng tài khoản nội bộ của CIC. Không sử dụng các phương thức đăng nhập SSO qua Google, Microsoft, hoặc tích hợp SAML/OIDC bên thứ ba.
*   **Thông tin Nhập liệu**:
    *   Trường định danh: Nhãn **"Tài khoản hoặc Email"** (placeholder: `username hoặc username@cic.org.vn`).
    *   Trường mật khẩu: Nhãn **"Mật khẩu"** hỗ trợ tính năng ẩn/hiện mật khẩu và liên kết **"Quên?"** cùng dòng với nhãn.
*   **Tài khoản Mock phục vụ Kiểm thử**:
    *   Tài khoản: `admin` hoặc `admin@cic.org.vn`
    *   Mật khẩu: `admin`
*   **Chuyển hướng (Redirection)**: Khi đăng nhập thành công, hệ thống thông báo thành công và chuyển hướng người dùng về trang chủ của hệ thống (`/`) - màn hình hiển thị danh sách các phân hệ nghiệp vụ chính.

### 1.2. Cơ chế Mã xác thực (Captcha) chống Brute-Force
*   **Điều kiện Kích hoạt**: Nhằm tối ưu trải nghiệm người dùng, mã Captcha chỉ xuất hiện sau khi người dùng **nhập sai tài khoản hoặc mật khẩu liên tiếp từ 5 lần trở lên**.
*   **Đặc điểm Kỹ thuật Captcha**:
    *   Mã xác thực gồm 5 ký tự ngẫu nhiên (chữ in hoa và số, loại bỏ ký tự dễ nhầm lẫn như `O, 0, I, 1`).
    *   Có nút refresh để đổi mã xác thực mới.
    *   Yêu cầu khớp chính xác mã hiển thị (không phân biệt chữ hoa, chữ thường) để phê duyệt đăng nhập.

---

## 2. Đặc tả Giao diện (UI/UX) & Design System

Trang đăng nhập tuân thủ **tuyệt đối 100%** các quy tắc thiết kế hệ thống được quy định tại [docs/design-system](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/docs/design-system), sử dụng hoàn toàn các tokens từ [tokens.ts](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/frontend/src/design-system/tokens.ts):

*   **Thẻ Đăng nhập (Card)**:
    *   Cấu trúc tối giản, **loại bỏ hoàn toàn chân thẻ (Card footer)** chứa liên kết đăng ký hay SAML/OIDC.
    *   Bo góc: 16px (`radius.xl`).
    *   Đổ bóng: Bóng mờ rộng cao cấp (`shadows.lg`).
    *   Header chứa logo chiếc khiên bảo mật màu xanh thương hiệu (`colors.primary[500]`) và nhãn text đậm **CIC Core**.
    *   Nút bấm chính "Tiếp tục" là nút Primary của Ant Design, sử dụng màu thương hiệu `colors.primary[500]` (hover: `colors.primary[600]`).
*   **Bản đồ nền & Múi giờ**:
    *   **Bản đồ thế giới dạng dot**: Sử dụng tệp vector [world-map-dots.svg](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/frontend/public/world-map-dots.svg) với độ mờ chìm `opacity: 0.55` làm nền.
    *   **Đường lưới dọc**: 9 đường lưới dọc dashed mảnh, tương ứng với vị trí 9 múi giờ trên bản đồ.
    *   **Thanh múi giờ ở chân trang**: Hiển thị động thời gian thực tế (cập nhật theo từng giây) của 9 múi giờ (UTC-8, -6, -4, -2, 0, +2, +4, +6, +8) thẳng hàng dưới các đường lưới dọc. Thời gian hiển thị sử dụng màu cam nổi bật (`colors.subsystem.kkn`).
    *   **Responsive**: Trên di động, bản đồ, đường lưới dọc và thanh múi giờ chân trang được ẩn đi (`hidden md:block`) để giữ form đăng nhập ở trung tâm luôn gọn gàng.

---

## 3. Cấu trúc Tệp tin & Định tuyến Layout

Trang đăng nhập được triển khai độc lập ngoài các phân hệ nghiệp vụ chính:

```
frontend/
├── app/
│   ├── ClientLayout.tsx          # Cấu hình bỏ qua Sidebar & Header Dashboard cho các route bắt đầu bằng "/auth"
│   └── auth/
│       └── login/
│           ├── page.tsx          # Server Component (Khai báo SEO Metadata cho trang)
│           └── LoginClient.tsx   # Client Component (Giao diện chính, Form, Captcha, Live Clock)
└── public/
    └── world-map-dots.svg        # Tệp hình nền thế giới dạng dot
```
