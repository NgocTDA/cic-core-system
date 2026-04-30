# Cấu trúc Menu Dự án CIC Core System

Cấu trúc menu của hệ thống được quản lý thông qua cấu hình tập trung tại `frontend/src/config/navigation.tsx`. Hệ thống được chia thành nhiều phân hệ (Subsystems) độc lập, mỗi phân hệ có một menu riêng biệt.

## 1. Kênh kết nối (KKN)
- **Dashboard**: Màn hình tổng quan (`/kkn-dashboard`)
- **Quản lý kênh trao đổi dữ liệu**
  - Thiết lập kênh (`/kkn/channel-setup`)
  - Cấu hình kết nối (`/kkn/connection-config`)
  - Thông báo kết quả đăng ký kết nối (`/kkn/registration-notify`)
- **Nhật ký trao đổi dữ liệu** (`/kkn/data-log`)
- **Thiết lập tần suất tổng hợp dữ liệu** (`/kkn/sync-frequency`)
- **Quản lý dữ liệu trao đổi** (`/kkn/data-management`)
- **Báo cáo khai thác kênh** (`/kkn/reports`)
- **Tổng hợp dữ liệu**
  - Dữ liệu cho M5 (`/kkn/aggregation/m5`)
  - Dữ liệu cho XHTD (`/kkn/aggregation/xhtd`)
  - Dữ liệu cho CĐTD (`/kkn/aggregation/cdtd`)

## 2. Thu thập, xử lý dữ liệu
- **Dashboard Thu thập**: Quản lý hiện trạng thu thập (`/data-collection/dashboard`)
- **Thu thập dữ liệu**
  - Tiếp nhận dữ liệu (`/data-collection/receive`)
  - Đối chiếu file gửi đủ định kỳ (`/data-collection/compare`)
- **Xử lý dữ liệu**
  - XLDL định kỳ có cấu trúc xác định (`/data-collection/process/fixed`)
  - XLDL định kỳ có cấu trúc chưa xác định (`/data-collection/process/unknown`)
  - XLDL phi cấu trúc (`/data-collection/process/unstructured`)
  - XLDL thu thập thủ công (`/data-collection/process/manual`)
  - XLDL hồ sơ pháp lý (`/data-collection/process/legal`)
  - XLDL hồ sơ lỗi, chờ xem xét (`/data-collection/process/error`)
  - XLDL tệp báo cáo điều chỉnh (tệp C, tệp E) (`/data-collection/process/adjust-files`)
- **Quản lý mã CIC**
  - Tra cứu mã CIC (`/data-collection/cic/search`)
  - Điều chỉnh mã CIC (`/data-collection/cic/adjust`)
- **Quản lý điều chỉnh dữ liệu**
  - Nhận diện hồ sơ tất toán, đóng thẻ (`/data-collection/adjust/detect`)
  - Xử lý dữ liệu nghi ngờ sai lệch (`/data-collection/adjust/suspect`)
  - Yêu cầu điều chỉnh dữ liệu (`/data-collection/adjust/request`)
  - Phương án điều chỉnh dữ liệu (`/data-collection/adjust/plan`)
- **Kho dữ liệu**
  - Tra cứu dữ liệu (`/data-collection/warehouse/search`)
  - Kiểm soát dữ liệu (`/data-collection/warehouse/control`)
- **Tổng hợp dữ liệu**
  - Job tổng hợp dữ liệu (`/data-collection/aggregation/jobs`)
  - Tra cứu dữ liệu sau tổng hợp (`/data-collection/aggregation/search`)
- **Tra soát, Đối soát**
  - Đối soát dữ liệu (`/data-collection/reconciliation/data`)
  - Yêu cầu tra soát (`/data-collection/reconciliation/request`)
- **Quản lý chỉ tiêu, mẫu tệp**
  - Quản lý chỉ tiêu (`/data-collection/indicators`)
  - Quản lý mẫu tệp (`/data-collection/templates`)
  - Quy tắc kiểm tra chỉ tiêu (`/data-collection/rules/indicators`)
  - Quy tắc kiểm tra tệp (`/data-collection/rules/files`)
  - Quản lý loại quy tắc (`/data-collection/rules/types`)
- **Quản lý tỷ giá tiền tệ**
  - Tra cứu tỷ giá (`/data-collection/exchange-rate/search`)
  - Cấu hình nguồn đồng bộ tỷ giá (`/data-collection/exchange-rate/config`)
- **Xác thực thông tin pháp lý với C06** (`/data-collection/legal-verify`)
- **Quản lý thẩm quyền ký** (`/data-collection/signing-authority`)
- **Kiểm tra dữ liệu phục vụ tạo lập sản phẩm TTTD** (`/data-collection/product-check`)
- **Quản lý đối chiếu thông tin cân đối** (`/data-collection/balance-verify`)

## 3. Quản lý, tạo lập sản phẩm
- **Dashboard Sản phẩm**: Trực quan hóa dữ liệu tạo lập sản phẩm (`/product-mgmt/dashboard`)
- **Quản lý danh mục**
  - Danh mục chỉ tiêu sản phẩm (`/product-mgmt/catalog/indicators`)
  - Danh mục mẫu sản phẩm (mẫu báo cáo đầu ra) (`/product-mgmt/catalog/templates`)
  - Danh mục sản phẩm (`/product-mgmt/catalog/products`)
  - Danh mục Loại sản phẩm (`/product-mgmt/catalog/types`)
- **Cấu hình các quy tắc**
  - Quy tắc xác định mã CIC (`/product-mgmt/rules/cic-code`)
  - Quy tắc YCHT cần xác nhận của chủ thể thông tin (`/product-mgmt/rules/owner-confirm`)
  - Quy tắc kiểm tra khách hàng cần đổi mã sản phẩm (`/product-mgmt/rules/product-change`)
  - Quy tắc kiểm tra tạo lập sản phẩm (`/product-mgmt/rules/creation`)
  - Chặn cung cấp thông tin (`/product-mgmt/rules/blocking`)
- **Tổng hợp dữ liệu phục vụ tạo lập sản phẩm**
  - Thiết lập Job tổng hợp dữ liệu định kỳ phục vụ tạo lập sản phẩm (`/product-mgmt/aggregation/jobs`)
  - Quy tắc kiểm tra dữ liệu tổng hợp phục vụ tạo lập sản phẩm (`/product-mgmt/aggregation/rules`)
  - Tra cứu dữ liệu tổng hợp phục vụ tạo lập sản phẩm (`/product-mgmt/aggregation/search`)
- **Các chức năng hệ thống chạy ngầm** (`/product-mgmt/background-jobs`)
- **Sản phẩm định kỳ**
  - Đăng ký khai thác báo cáo định kỳ (`/product-mgmt/periodic/register`)
  - Danh sách sản phẩm định kỳ (`/product-mgmt/periodic/list`)
  - Nhật ký tra cứu sản phẩm định kỳ (`/product-mgmt/periodic/log`)
  - Tích hợp hệ thống khác (`/product-mgmt/periodic/integration`)
  - Thu hồi sản phẩm định kỳ (`/product-mgmt/periodic/revoke`)
- **Hỏi và trả lời tin khách hàng**
  - Quản lý yêu cầu đăng ký khai thác sản phẩm của TCTD (`/product-mgmt/inquiry/register`)
  - Danh sách đối tượng gán tạm mã CIC (mã CIC có nghi ngờ) (`/product-mgmt/inquiry/suspect-cic`)
  - Danh sách yêu cầu hỏi tin sản phẩm truyền thống (`/product-mgmt/inquiry/list`)
  - Hỏi tin sản phẩm theo lô (`/product-mgmt/inquiry/batch`)
- **Quản lý yêu cầu xác nhận của chủ thể thông tin (đối với SP XHTD)**
  - Danh sách yêu cầu hỏi tin cần xác nhận của chủ thể thông tin (`/product-mgmt/confirmation/list`)
  - Khai báo xác nhận của chủ thể thông tin (`/product-mgmt/confirmation/declare`)
- **Kiểm soát và tạo lập lại sản phẩm (sau cung cấp)**
  - Quản lý dữ liệu nghi ngờ sai sót (sau cung cấp) (`/product-mgmt/rework/suspect`)
  - Tra cứu dữ liệu cần tạo lập lại sản phẩm (`/product-mgmt/rework/search`)
  - Tổng hợp nội dung sản phẩm định đã bị thu hồi (`/product-mgmt/rework/aggregation`)
  - Danh sách sản phẩm định kỳ tạo lập lại sau thu hồi (`/product-mgmt/rework/list`)
- **Bài viết phân tích, cảnh báo**
  - Quản lý file upload (`/product-mgmt/articles/upload`)
  - Quản lý bài viết, phân tích cảnh báo (`/product-mgmt/articles`)
  - Hệ thống đăng bài/ẩn bài và tích hợp đăng bài trên web SBV (`/product-mgmt/articles/publish`)
- **Tiếp nhận, tạo lập, cung cấp sản phẩm đặc thù SBV**
  - Danh sách yêu cầu khai thác sản phẩm đặc thù (`/product-mgmt/sbv/requests`)
  - Tạo lập báo cáo (`/product-mgmt/sbv/creation`)
  - Danh sách yêu cầu cung cấp chỉ tiêu (`/product-mgmt/sbv/indicators`)
- **Tổng hợp dữ liệu cho hệ thống M5**
  - Nhận và kiểm tra yêu cầu từ hệ thống M5 (`/product-mgmt/m5/check`)
  - Tổng hợp dữ liệu (`/product-mgmt/m5/aggregation`)
  - Gửi dữ liệu sang hệ thống M5 (`/product-mgmt/m5/send`)
- **Hậu kiểm sau trả lời tin** (`/product-mgmt/post-audit`)

## 4. Hỗ trợ vận hành
- **Dashboard Vận hành**: Theo dõi hoạt động vận hành (`/ops-support/dashboard`)
- **Người dùng & Phân quyền**
  - Quản lý người sử dụng (`/ops-support/users`)
  - Quản lý nhóm quyền (`/ops-support/roles`)
  - Quản lý nhóm người sử dụng (`/ops-support/user-groups`)
- **Quản lý hợp đồng** (`/ops-support/contracts`)
- **Quản lý phân công**
  - Phân công tự động (`/ops-support/assignment/auto`)
  - Cán bộ phụ trách Tập đoàn, TCT (`/ops-support/assignment/staff`)
- **Quản lý chức năng**
  - Quản lý danh mục (`/ops-support/functions/categories`)
  - Quản lý chức năng (`/ops-support/functions`)
  - Quản lý job: Các công việc (job) trong hệ thống (`/ops-support/job-management`)
- **Tra cứu thông báo**
  - Tra cứu thông báo (`/ops-support/notifications`)
  - Tra cứu thông báo (Core) (`/ops-support/notifications-core`)
- **Cấu hình thông báo**
  - Cấu hình mẫu thông báo (`/ops-support/notification-template`)
  - Biến thông báo (`/ops-support/variable-registry`)
- **Đánh giá chất lượng báo cáo TTTD**
  - Danh sách đánh giá (`/ops-support/quality/list`)
  - Kết quả đánh giá (`/ops-support/quality/results`)
  - Quản lý chỉ tiêu, công thức (`/ops-support/quality/config`)
- **Giám sát TCTN, QTDND**
  - Danh sách giám sát (`/ops-support/monitoring/list`)
  - Kết quả giám sát (`/ops-support/monitoring/results`)
  - Quản lý chỉ tiêu giám sát (`/ops-support/monitoring/config`)
- **Tra soát và phản hồi thông tin**
  - Đơn vị bên ngoài đến CIC (`/ops-support/feedback/external`)
  - CIC đến đơn vị bên ngoài (`/ops-support/feedback/internal`)
- **Cấu hình hệ thống**
  - Chính sách tài khoản (`/ops-support/config/policy`)
  - Cấu hình tham số hệ thống (`/ops-support/config/parameters`)
  - Cấu hình ngày làm việc (`/ops-support/config/workdays`)
  - Quản lý mã lỗi (`/ops-support/config/error-codes`)

## 5. Báo cáo thống kê
- **Dashboard Báo cáo**: Quản lý và theo dõi các báo cáo (`/analytics-reporting/dashboard`)
- **Báo cáo nghiệp vụ**
  - Báo cáo tình hình thu thập dữ liệu (`/analytics-reporting/business/collection`)
  - Báo cáo tình hình tạo lập & cung cấp sản phẩm (`/analytics-reporting/business/products`)
  - Báo cáo khai thác kênh kết nối (`/analytics-reporting/business/channels`)
  - Báo cáo chất lượng dữ liệu (`/analytics-reporting/business/quality`)
- **Báo cáo theo yêu cầu**
  - Tạo báo cáo tùy chỉnh (`/analytics-reporting/adhoc/create`)
  - Danh sách báo cáo đã tạo (`/analytics-reporting/adhoc/list`)
  - Lịch sử xuất báo cáo (`/analytics-reporting/adhoc/history`)
- **Thống kê**
  - Thống kê theo TCTD / đơn vị báo cáo (`/analytics-reporting/statistics/units`)
  - Thống kê theo kỳ (`/analytics-reporting/statistics/periods`)
  - Thống kê sản phẩm TTTD đã cung cấp (`/analytics-reporting/statistics/products`)
- **Quản lý mẫu báo cáo**
  - Danh mục mẫu báo cáo (`/analytics-reporting/templates`)
  - Cấu hình tham số báo cáo (`/analytics-reporting/templates/parameters`)
- **Lịch báo cáo định kỳ**
  - Cấu hình lịch chạy (`/analytics-reporting/schedules`)
  - Kết quả chạy báo cáo (`/analytics-reporting/schedules/results`)

## 6. Quản trị dữ liệu (Data Governance)
Phân hệ này có cấu trúc phức tạp nhất, được chia thành nhiều nhóm nghiệp vụ như sau:

* **Tổng quan**: Dashboard Quản trị dữ liệu (`/data-governance/dashboard`)
* **Tìm kiếm toàn cục**: Hỗ trợ phím tắt *Ctrl+K* (`/data-governance/search`)

### Tài sản dữ liệu (Data Assets - T1)
- Danh sách tài sản (`/data-governance/assets`)
- Đăng ký tài sản mới (`/data-governance/assets/new`)
- Chờ phê duyệt (`/data-governance/assets?status=pending_review`)
- Tài sản của tôi (`/data-governance/assets?owner=me`)

### Tài sản nghiệp vụ (Business Assets - T2A)
- Danh sách BA (`/data-governance/assets?type=business`)
- BA ↔ TA Mapping (`/data-governance/assets/mapping`)
- Chưa có mapping (`/data-governance/assets?type=business&mapped=false`)

### Tài sản kỹ thuật (Technical Assets - T2B)
- Danh sách TA (`/data-governance/assets?type=technical`)
- Auto-discovery (`/data-governance/discovery`)
- Thay đổi schema (`/data-governance/assets/schema-changes`)
- Phân tích tác động (`/data-governance/assets/impact`)

### Định nghĩa & Quy tắc (Business Glossary - T3A)
- Tra cứu thuật ngữ (`/data-governance/glossary`)
- Tạo thuật ngữ mới (`/data-governance/glossary/new`)
- Phê duyệt (`/data-governance/glossary/review`)
- Cần review (> 1 năm) (`/data-governance/glossary?stale=true`)
- Xuất Glossary (`/data-governance/glossary/export`)

### Liên kết & Lineage (MX)
- Data Lineage (`/data-governance/lineage`)
- Sơ đồ quan hệ (`/data-governance/relations`)

### Danh mục hệ thống
Yêu cầu quyền Admin (Quản trị hệ thống):
- Quản lý Domain (`/data-governance/admin/domains`)
- Người dùng & Phân quyền (`/data-governance/admin/users`)
- Kết nối Data Source (`/data-governance/admin/connections`)
- Bảng mã danh mục (`/data-governance/admin/codelists`)
