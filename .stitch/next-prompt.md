---
page: job-management-professional
---
A professional Job Management screen for CIC Core System, strictly following the layout of the 'Notifications' module.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Vibe: "The Kinetic Architect" / "Digital Atrium" (Structural transparency, sophisticated depth).
- Palette: Primary Accuracy (#1677FF), Canvas Neutral (#F5F7FA), Sidebar Slate (#001529), Pure Surface (#FFFFFF).
- Rules: 32px standard control height, 6px uniform border radius.
- Shadows: Use Tonal Layering. Zero-border philosophy.

**Page Structure:**
1. **Control Header:**
   - Breadcrumbs: Hỗ trợ vận hành > Quản lý Job
   - Page Title: Quản lý Job định kỳ
2. **Filter Section (Card 1):**
   - High-density filter bar with: Hệ thống (Select), Loại Job (Select), Trạng thái (Select), Search (Input with icon).
3. **Main Content (Card 2):**
   - Header with View Toggle (Radio button group: "Danh sách" vs "Quy trình") and "Thêm Job mới" button.
   - **Table View (Danh sách):**
     - Columns: ID, Mã Job, Tên Job, Phân loại, Trạng thái (Pill), Lần chạy cuối, Lần chạy tiếp theo, Ưu tiên. 
     - "Thao tác" column with Dropdown (Xem, Chạy, Sửa, Xóa).
   - **Inbox/Process View (Quy trình):**
     - Split view (resizable). 
     - Left: Vertical list of jobs with status indicators.
     - Right: Detailed Job Dashboard for the selected job. Includes: 
       - Header with primary actions (Chạy ngay, Cấu hình).
       - Status overview (Progress radial chart, Active metrics).
       - Live Execution Logs (Table/Terminal view).
       - Config quick-view (Recurrence, Alerts).

**Atmosphere:** Authoritative, high-density, precise, enterprise-grade. Maintain the editorial authority and breathable transparency of the Digital Atrium.
