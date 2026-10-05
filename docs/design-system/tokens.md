# Design Tokens — Reference

> Package: `@ntda/forest-design-system` (v1.4.0)
> Theme: `frontend/src/design-system/theme.ts`
> Subsystems: `frontend/src/config/subsystems.ts`
> Layout & Z-Index: `frontend/src/config/layout.ts`
> Standard: **NTDA Forest Design System (v1.4.0)** — WCAG 2.2 AA Compliant
> Theme Import: `import { antdTheme } from '@/design-system'`
> CSS Variables: `var(--primary)`, `var(--bg)`, `var(--text)`, `var(--elevation-1)`, `var(--radius-control)`

---

## Hợp đồng sử dụng trong mã nguồn

Các tên `colors.*`, `radius.*`, `shadows.*` trong các bảng bên dưới là tên phân loại tham chiếu của tài liệu cũ, **không phải TypeScript exports**. `@/design-system` chỉ export `antdTheme`. Không import `colors`, `spacing`, `radius` từ barrel này.

Dùng `var(--primary)`, `var(--text)`, `var(--text-muted)`, `var(--text-subtle)`, `var(--bg)`, `var(--surface)`, `var(--border)`, `var(--border-input)`, `var(--spacing-16)`, `var(--radius-control)`, `var(--elevation-1)`. Không có biến `--text-secondary` hoặc `--text-disabled` trong Forest 1.4.0. `Space.size` cần số/tên kích thước; CSS string phải đặt vào `style.gap`.

Màu subsystem lấy từ `config/subsystems.ts`; layout/z-index từ `config/layout.ts`. Theme hiện có overrides CIC tại `design-system/theme.ts`; các overrides và lớp CSS tương thích trong `app/globals.css` vẫn đang trong quá trình migration, không mặc định mọi giá trị đã đồng bộ với package.

## 1. Triết lý Thiết kế NTDA Forest

1. **Dữ liệu là trung tâm:** Màu sắc dùng để báo trạng thái và điều hướng, không dùng trang trí lãng phí.
2. **Mật độ có kiểm soát:** Bảng Compact 40px mặc định cho các trang danh sách và form nghiệp vụ.
3. **Tiêu chuẩn Tiếp cận WCAG 2.2 AA:** Chữ trên nút Primary và chữ nội dung luôn đạt tỷ lệ tương phản tối thiểu ≥ 4.5:1 (nút `#2c795b` đạt 5.26:1), viền control ≥ 3:1.
4. **Không chỉ dựa vào màu:** Trạng thái luôn đi kèm văn bản rõ ràng; màu trạng thái Thành công (Leaf Green `#3a7401`) được lệch vàng (yellow-shifted) để **tuyệt đối không bị nhầm lẫn** với màu thương hiệu Forest Green.

---

## 2. Bảng Màu (Colors)

### 2.1 Brand Primary (Forest Pine)

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.primary[50]` | `#ecf9f3` | Hover dòng bảng, selected tag, background nhẹ |
| `colors.primary[100]` | `#d9f0e5` | Khung badge phụ, viền thẻ nổi bật |
| `colors.primary[200]` | `#bde4d1` | Viền focus active |
| `colors.primary[300]` | `#9dd5bb` | Accent tint |
| `colors.primary[400]` | `#77c0a0` | Hover state trong dark mode |
| `colors.primary[500]` | `#2c795b` | **Màu thương hiệu chính (Core Brand Primary)** — nút bấm, liên kết chính, active indicator |
| `colors.primary[600]` | `#195b43` | Hover trên primary button |
| `colors.primary[700]` | `#144b36` | Pressed / Active state |
| `colors.primary[800]` | `#0e3b2a` | Deep pine |
| `colors.primary[900]` | `#09271c` | Darkest pine |

### 2.2 Forest Ink & Nền Tối

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.ink[600]` | `#35544b` | Viền input trong Dark Mode |
| `colors.ink[700]` | `#27443c` | Đường viền bảng, divider trong Dark Mode |
| `colors.ink[800]` | `#1e3931` | Bề mặt nổi (surface raised) Dark Mode |
| `colors.ink[900]` | `#18312a` | Bề mặt thẻ Card / Container trong Dark Mode |
| `colors.ink[950]` | `#0e241e` | Nền header, vùng tìm kiếm Dark Mode |
| `colors.ink[975]` | `#081a15` | Nền canvas sâu nhất Dark Mode |

### 2.3 Forest Accent Lime (Dành cho nền tối)

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.accent[200]` | `#d8e485` | Điểm nhấn Lime trên nền tối (tương phản 10.16:1 trên ink) |
| `colors.accent[50]` | `#f4f9dc` | Nền subtle accent |

### 2.4 Subsystem Accents

| Token | Hex | Subsystem |
|---|---|---|
| `colors.subsystem.kkn` | `#f59e0b` | Kênh kết nối (Amber Gold) |
| `colors.subsystem.collection` | `#38bdf8` | Thu thập dữ liệu (Sky Teal-Blue) |
| `colors.subsystem.product` | `#2c795b` | Quản lý sản phẩm (Forest Pine — đồng bộ core) |
| `colors.subsystem.ops` | `#8b5cf6` | Hỗ trợ vận hành (Modern Iris/Violet) |
| `colors.subsystem.analytics` | `#f43f5e` | Báo cáo thống kê (Rose Coral) |
| `colors.subsystem.governance` | `#14b8a6` | Quản trị dữ liệu (Deep Mint) |
| `colors.subsystem.design` | `#7c3aed` | Design System |
| `colors.subsystem.portal` | `#0050b3` | Web Portal |
| `colors.subsystem.tools` | `#1f4e79` | Công cụ nội bộ (CIC Navy) |

### 2.5 Biểu đồ 8 Màu (CVD & Dark Safe)

Màu phân loại theo thứ tự cố định, đã kiểm định mù màu:
1. `#1e8863` (Forest)
2. `#b77ff2` (Violet)
3. `#f57f45` (Orange)
4. `#4353d6` (Indigo)
5. `#db9424` (Amber)
6. `#077398` (Sky)
7. `#a2ae44` (Lime)
8. `#ba1f5a` (Rose)

### 2.6 Semantic & Trạng Thái (Status)

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.success.light` | `#eefae9` | Nền trạng thái thành công |
| `colors.success.base` | `#4b8b18` | Icon thành công |
| `colors.success.dark` | `#3a7401` | Chữ trạng thái thành công (Leaf Green lệch vàng) |
| `colors.warning.light` | `#fef4e8` | Nền cảnh báo |
| `colors.warning.base` | `#bd8537` | Icon cảnh báo |
| `colors.warning.dark` | `#976204` | Chữ cảnh báo |
| `colors.error.light` | `#fff2f0` | Nền lỗi |
| `colors.error.base` | `#db2326` | Icon lỗi, nguy hiểm |
| `colors.error.dark` | `#c2181d` | Chữ lỗi |
| `colors.info.light` | `#eaf8ff` | Nền thông tin |
| `colors.info.base` | `#1383ac` | Icon thông tin |
| `colors.info.dark` | `#077398` | Chữ thông tin |

### 2.7 Bảng Status Tag Chuẩn (`colors.statusTag`)

| Role | Nền (`bg`) | Chữ (`text`) | Viền (`border`) | Trạng thái áp dụng |
|---|---|---|---|---|
| `active` | `#eefae9` | `#3a7401` | `#c3e6b1` | `ACTIVE`, `APPROVED`, `VALID`, `SUCCESS` |
| `warning` | `#fef4e8` | `#976204` | `#f1d4b0` | `SCHEDULED`, `PAUSED`, `PENDING`, `REVIEWING` |
| `error` | `#fff2f0` | `#c2181d` | `#ffcbc4` | `FAILED`, `REJECTED`, `UNREAD`, `INVALID`, `ERROR`, `INACTIVE` |
| `processing` | `#eaf8ff` | `#077398` | `#b4e1f7` | `RUNNING` |
| `neutral` | `#edf7f2` | `#4c5551` | `#cdd7d3` | `ARCHIVED`, `IDLE`, `READ`, `CLOSED`, `DRAFT` |
| `notice` | `#fef4e8` | `#865600` | `#f1d4b0` | Cảnh báo quan trọng |

### 2.8 Thang Màu Trung Tính (Neutrals) & Bề Mặt

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.neutral[0]` | `#ffffff` | Nền thẻ container |
| `colors.neutral[50]` | `#f7fbf9` | Nền trang (`bg.page`), header bảng |
| `colors.neutral[100]` | `#edf7f2` | Bề mặt lùi (`bg.context`), khung badge cron |
| `colors.neutral[200]` | `#e0eae5` | Viền cơ bản (`border.base`) |
| `colors.neutral[300]` | `#cdd7d3` | Viền đậm phụ |
| `colors.neutral[500]` | `#6d7672` | Viền input / control (WCAG 3:1) |
| `colors.neutral[600]` | `#4c5551` | Text phụ (`text.secondary` - WCAG 5.5:1) |
| `colors.neutral[900]` | `#121916` | Text chính (`text.primary`) |
| `colors.neutral[950]` | `#080b0a` | Pure ink |

---

## 3. Bo Góc (Radius) & Hình Khối

Hệ thống NTDA Forest chuẩn hóa bán kính bo góc:

| Token | Giá trị | Dùng cho |
|---|---|---|
| `radius.sm` (`radiusNumber.sm`) | `4px` | Tag, badge, checkbox, tooltip |
| `radius.button` (`radiusNumber.button`) | `4px` | **Nút bấm (Button - sắc nét, tinh gọn)** |
| `radius.md` (`radiusNumber.md`) | `8px` | **Ô nhập liệu (Input), Hộp chọn (Select)** |
| `radius.lg` (`radiusNumber.lg`) | `12px` | **Thẻ Card (SectionCard), Hộp thoại (Modal, Drawer)** |
| `radius.xl` (`radiusNumber.xl`) | `16px` | Container lớn |
| `radius.full` | `9999px` | Pill buttons, avatar tròn |

---

## 4. Đổ Bóng & Elevation

Hệ thống ưu tiên **viền mỏng sắc nét (crisp borders)** kết hợp độ nổi siêu mịn:
- `shadows.elevation1`: `0px 1px 1px 0px rgba(15, 23, 42, 0.03), 0px 1px 2px 0px rgba(15, 23, 42, 0.06)`
- `shadows.elevation2`: `0px 1px 2px 0px rgba(15, 23, 42, 0.04), 0px 2px 4px -1px rgba(15, 23, 42, 0.06)`
- `shadows.elevation3`: `0px 1px 2px 0px rgba(15, 23, 42, 0.04), 0px 4px 8px -2px rgba(15, 23, 42, 0.07)` (Dùng cho Modal, Popover)
- `shadows.elevation4`: `0px 2px 3px -1px rgba(15, 23, 42, 0.04), 0px 6px 12px -3px rgba(15, 23, 42, 0.09)` (Dùng cho Drawer)
