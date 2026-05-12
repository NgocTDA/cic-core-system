# Enterprise UI Design
# Credit Information Data Validation Error Management Platform

## 1. Bối cảnh bài toán

Hệ thống thu thập dữ liệu thông tin tín dụng nhận dữ liệu JSON có cấu trúc nhiều cấp:

```text
CNTCTD → KHACHHANG → CHOVAY → KHEUOC
```

Ví dụ thực tế từ dữ liệu:

- CNTCTD = chi nhánh/tổ chức tín dụng
- KHACHHANG = khách hàng
- CHOVAY = hợp đồng tín dụng
- KHEUOC = khế ước

Đặc điểm:

- JSON nhiều cấp (4-6 cấp)
- Có nested array
- Mỗi file có thể chứa hàng triệu hồ sơ
- Một hồ sơ có thể phát sinh nhiều lỗi tại nhiều cấp khác nhau
- Lỗi được sinh ra bởi rule validation

Mục tiêu:

- Quản lý lỗi theo business entity
- Xem lỗi theo nhiều chiều
- Drill-down hierarchy
- Hỗ trợ performance ở quy mô lớn
- UI chuẩn enterprise

---

# 2. Nguyên tắc thiết kế

## 2.1 Error-centric thay vì JSON-centric

❌ Không render raw JSON cho user business.

✅ Hệ thống phải xoay quanh:

- Hồ sơ lỗi
- Mã lỗi
- Thực thể nghiệp vụ
- Drill-down hierarchy

---

## 2.2 Table + Drill-down Pattern

UI chuẩn:

```text
Summary Table
    ↓
Drill-down Hierarchy
    ↓
Error Inspector
```

Lợi ích:

- Scale tốt
- Dễ dùng
- Không overload UI
- Phù hợp dữ liệu lớn

---

# 3. Information Architecture (IA)

```text
Dashboard
 └── Quản lý hồ sơ lỗi
        ├── Danh sách file
        ├── Dashboard lỗi
        ├── Danh sách hồ sơ lỗi
        ├── Customer Error View
        ├── Error Code View
        ├── Drill-down hierarchy
        └── Error inspector
```

---

# 4. Layout tổng thể

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                      │
├──────────────────────────────────────────────────────────────┤
│ Breadcrumb + File Info                                      │
├──────────────────────────────────────────────────────────────┤
│ Summary Cards                                               │
├──────────────────────────────────────────────────────────────┤
│ Filter/Search Panel                                         │
├──────────────────────────────────────────────────────────────┤
│ Main Table                                                  │
├──────────────────────────────────────────────────────────────┤
│ Drill-down Detail Panel                                     │
└──────────────────────────────────────────────────────────────┘
```

---

# 5. Header

```text
[☰] CIC Data Quality Management

                    [Notification] [Profile]
```

---

# 6. Breadcrumb + File Information

```text
Dashboard
 / Thu thập dữ liệu
 / Hồ sơ lỗi
 / File: D3235820250930.005.json
```

## File Metadata Panel

```text
┌──────────────────────────────────────────────────────┐
│ File ID      : D3235820250930.005                   │
│ Loại dữ liệu : D32                                  │
│ TCTD gửi     : TPBank                               │
│ Thời gian    : 30/09/2025 08:45                     │
│ Tổng hồ sơ   : 1,250,000                            │
│ Tổng lỗi     : 125,420                              │
│ Trạng thái   : Validation Completed                 │
└──────────────────────────────────────────────────────┘
```

---

# 7. Summary Cards

```text
┌────────────┐
│ Hồ sơ lỗi  │
│ 125,420    │
└────────────┘

┌────────────┐
│ Error      │
│ 312,892    │
└────────────┘

┌────────────┐
│ Warning    │
│ 58,220     │
└────────────┘

┌────────────┐
│ CNTCTD     │
│ 235        │
└────────────┘
```

---

# 8. Filter Panel

```text
┌────────────────────────────────────────────────────────────┐
│ File ID        [____________________]                     │
│ CNTCTD         [ Dropdown ▼ ]                             │
│ KHACHHANG      [____________________]                     │
│ Error Code     [ Dropdown ▼ ]                             │
│ Severity       [ ERROR ▼ ]                                │
│ Entity Type    [ KHEUOC ▼ ]                               │
│                                                         │
│ [+ Thêm bộ lọc]                          [Làm mới][Tìm] │
└────────────────────────────────────────────────────────────┘
```

---

# 9. Main Table - Error Record Table

## Requirements

- Server-side pagination
- Virtual scroll
- Sticky header
- Row selection
- Column pinning
- Lazy loading
- Async search

---

## Table Wireframe

```text
┌─────────────────────────────────────────────────────────────────────┐
│ □ │ CNTCTD │ KHACHHANG │ Entity │ Error │ Severity │ Updated Time │
├─────────────────────────────────────────────────────────────────────┤
│ > │01358001│ NTDA0000  │KHEUOC │ 5     │ ERROR    │ 08:45         │
│ > │01358001│ NTDA0001  │CHOVAY │ 2     │ WARNING  │ 08:46         │
│ > │01358002│ NTDA0002  │KH     │ 1     │ ERROR    │ 08:47         │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 10. Drill-down Panel

## Layout

```text
┌────────────────────────────────────────────────────────────┐
│ LEFT: Hierarchy Tree     │ RIGHT: Error Detail           │
└────────────────────────────────────────────────────────────┘
```

---

# 11. Hierarchy Tree

```text
KHACHHANG NTDA0000 (5 lỗi)
│
├── CHOVAY HD001 (2 lỗi)
│     │
│     ├── KHEUOC KU001 (1 lỗi)
│     │      ├── KU010 🔴
│     │      └── KU022 ⚠️
│     │
│     └── KHEUOC KU002
│
├── CAMKETNGB (1 lỗi)
│
└── NHANUT (2 lỗi)
```

## Tree Behavior

| Action | Behavior |
|---|---|
| Expand node | Lazy load |
| Click node | Load detail |
| Hover | Tooltip |
| Error badge | Count |

---

# 12. Error Inspector

```text
┌─────────────────────────────────────────────┐
│ Error Detail                                │
├─────────────────────────────────────────────┤
│ Field         : KU010                       │
│ Path          : CHOVAY[0].KHEUOC[2].KU010  │
│ Error Code    : E102                        │
│ Severity      : ERROR                       │
│ Rule          : INVALID_AMOUNT_FORMAT       │
│ Message       : Sai định dạng số tiền       │
│                                                     │
│ Raw Value     : 1743477983                  │
│ Expected      : decimal(18,2)               │
└─────────────────────────────────────────────┘
```

---

# 13. Business View vs Technical View

```text
[Business View] [Technical View]
```

## Technical View

```json
{
  "KU010": 1743477983,
  "KU011": 2.5
}
```

---

# 14. Customer Error View

## Mục tiêu

Hiển thị toàn bộ lỗi theo KHACHHANG.

---

## UI Structure

```text
KHÁCH HÀNG: NTDA0000 (5 lỗi)
────────────────────────────

🔴 Thông tin KHACHHANG
 - TC010: Email sai format

🔴 CHOVAY[0]
 - HD004: Sai số tiền

🔴 KHEUOC[2]
 - KU010: Sai định dạng
 - KU022: Sai mã
```

---

## Tabs

```text
[Chi tiết] [Thống kê lỗi] [Lịch sử xử lý]
```

---

# 15. Error Code View

## Mục tiêu

Cho phép điều tra theo mã lỗi.

---

## Layout

```text
┌────────────────────────────────────────────────────────────┐
│ Bộ lọc: File | Mã lỗi | Severity | CNTCTD | Entity Type   │
├────────────────────────────────────────────────────────────┤
│ LEFT: Danh sách mã lỗi     │ RIGHT: Hồ sơ phát sinh lỗi   │
│                            │                               │
│ E102  52,120 lỗi           │ CNTCTD | KH | Entity | Field │
│ E205  31,002 lỗi           │ ...                          │
│ E301  12,500 lỗi           │                               │
└────────────────────────────────────────────────────────────┘
```

---

# 16. Error Code List

```text
┌──────────────────────────────┐
│ Mã lỗi                       │
├──────────────────────────────┤
│ 🔴 E102                      │
│ Sai định dạng số tiền        │
│ 52,120 lỗi | 18,200 hồ sơ    │
│                              │
│ 🟠 E205                      │
│ Thiếu trường bắt buộc        │
│ 31,002 lỗi | 10,100 hồ sơ    │
│                              │
│ 🔴 E301                      │
│ Sai mã ngành/loại tiền       │
│ 12,500 lỗi | 8,900 hồ sơ     │
└──────────────────────────────┘
```

---

# 17. Error Code Detail Table

```text
┌──────────────────────────────────────────────────────────────┐
│ E102 - Sai định dạng số tiền                                 │
│ Severity: ERROR | Tổng lỗi: 52,120 | Hồ sơ ảnh hưởng: 18,200 │
├──────────────────────────────────────────────────────────────┤
│ CNTCTD   | KHACHHANG | Entity | Entity ID | Field | Value   │
├──────────────────────────────────────────────────────────────┤
│01358001 | NTDA0000  | KHEUOC | KU001     | KU010 | 174...  │
│01358001 | NTDA0001  | CHOVAY | HD001     | HD004 | abc     │
│77358001 | NTDA0020  | KHEUOC | KU003     | KU010 | null    │
└──────────────────────────────────────────────────────────────┘
```

---

# 18. Error Detail Drawer

```text
┌─────────────────────────────────────────────┐
│ Chi tiết lỗi                                │
├─────────────────────────────────────────────┤
│ Mã lỗi      : E102                          │
│ Mô tả       : Sai định dạng số tiền         │
│ CNTCTD      : 01358001                      │
│ Khách hàng  : NTDA0000                      │
│ Entity      : KHEUOC                        │
│ Field       : KU010                         │
│ Path        : CNTCTD[...].KHACHHANG[...]... │
│ Giá trị     : 1743477983                    │
│ Rule        : INVALID_AMOUNT_FORMAT         │
└─────────────────────────────────────────────┘
```

---

# 19. Error Analytics

## Top Error

```text
E102 : 52,120
E205 : 31,002
```

## Top Entity

```text
KHEUOC : 80%
CHOVAY : 12%
KHACHHANG : 8%
```

## Theo CNTCTD

```text
01358001: 12,000 lỗi
77358001: 8,500 lỗi
```

---

# 20. Severity Standards

| Severity | Color |
|---|---|
| ERROR | Red |
| WARNING | Orange |
| INFO | Blue |

---

# 21. Icon Standards

| Entity | Icon |
|---|---|
| CNTCTD | Bank |
| KHACHHANG | User |
| CHOVAY | File |
| KHEUOC | Folder |

---

# 22. Performance Requirements

## Không được làm

❌ Render full JSON

❌ Client pagination

❌ Load full hierarchy tree

❌ Query bằng path LIKE

---

## Bắt buộc

✅ Server-side pagination

✅ Virtualized table

✅ Lazy tree loading

✅ Async search

✅ Debounce filter

✅ Cassandra query-driven model

---

# 23. Backend Architecture Principles

## Cassandra Design

```text
1 query = 1 table
```

Không JOIN.

Không scan.

Denormalized data.

---

## Recommended Tables

### error_by_customer

```text
Query toàn bộ lỗi theo khách hàng
```

### error_by_branch

```text
Query toàn bộ lỗi theo CNTCTD
```

### error_by_record

```text
Query lỗi theo hồ sơ
```

### error_by_code

```text
Query theo mã lỗi
```

---

# 24. Recommended Ant Design Components

| Feature | Component |
|---|---|
| Table | ProTable |
| Tree | Tree |
| Drawer | Drawer |
| Summary | Statistic |
| Filter | Form |
| Detail | Descriptions |
| Tabs | Tabs |
| Charts | Charts |

---

# 25. Enterprise Enhancements

## Bulk Actions

```text
[Export Excel]
[Assign xử lý]
[Đánh dấu đã xử lý]
```

---

## Saved Filters

```text
[Lỗi nghiêm trọng]
[Lỗi KHEUOC]
[Lỗi TPBank]
```

---

## Audit Trail

```text
Ai đã xem?
Ai đã xử lý?
Khi nào?
```

---

# 26. Final UI Architecture

```text
TABLE (summary/index)
      ↓
DRILL-DOWN (hierarchy)
      ↓
ERROR INSPECTOR
      ↓
JSON DEBUG
```

---

# 27. Kết luận

Đây không còn là một màn hình “xem JSON lỗi”.

Đây là:

```text
Enterprise Credit Data Error Investigation Platform
```

Bao gồm:

- Error-centric UX
- Hierarchy drill-down
- Multi-dimensional filtering
- Error analytics
- Massive scale performance
- Business investigation workflow

