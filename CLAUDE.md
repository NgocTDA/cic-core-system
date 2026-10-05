# CIC Core System — Claude Working Guide

Hướng dẫn này giúp Claude Code hiểu codebase và làm việc nhất quán với các quyết định kiến trúc đã có.

---

## Tổng quan dự án

**CIC Core System** là hệ thống quản lý thông tin tín dụng nội bộ. 6 subsystem nghiệp vụ cốt lõi:

| ID | Tên | Màu (`SUBSYSTEMS.*.theme.primaryColor`) |
|---|---|---|
| `kkn` | Kênh kết nối | `#f59e0b` (amber gold) |
| `data-collection` | Thu thập & xử lý dữ liệu | `#38bdf8` (sky blue) |
| `product-mgmt` | Quản lý & tạo lập sản phẩm | `#2c795b` (Forest Pine) |
| `ops-support` | Hỗ trợ vận hành | `#8b5cf6` (iris violet) |
| `analytics-reporting` | Báo cáo thống kê | `#f43f5e` (rose coral) |
| `data-governance` | Quản trị dữ liệu | `#14b8a6` (deep mint) |

Ngoài 6 subsystem trên, `SUB_SYSTEMS` còn có các subsystem mở rộng:

| ID | Tên | Màu |
|---|---|---|
| `web-portal` | Web Portal (TCTD) | `#0050b3` (navy blue) |
| `tools` | Công cụ nội bộ (vd UI Doc Generator) | `#1f4e79` (CIC navy) |
| `design-system` | Design System Explorer | `#7c3aed` (indigo) |

> Cấu trúc menu đầy đủ (đồng bộ với `config/navigation.tsx`) xem tại [docs/menu.md](docs/menu.md).
> File này (CLAUDE.md) và [AGENTS.md](AGENTS.md) (guide cho Codex) là **bản song sinh** — khi cập nhật quy tắc làm việc, giữ cả hai đồng bộ.

---

## Tech stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **UI Library**: Ant Design 5.24+
- **Styling**: Tailwind CSS (utility), inline styles via design tokens (primary)
- **Path alias**: `@/` → `frontend/src/`
- **State**: React Context (`HeaderContext`, `SubSystemContext`)

---

## Cấu trúc thư mục

> Lưu ý: **App Router nằm ở `frontend/app/`** (pages + API route handlers), KHÔNG phải `frontend/src/app/`. Còn lại (components, modules, design-system…) ở `frontend/src/`.

```
frontend/app/               # Next.js App Router: pages + API routes (vd app/api/ai/*)
frontend/src/
├── components/
│   ├── ui/                 # Shared design-system components ← DÙNG CHO MỌI PAGE
│   └── *.tsx               # Standalone global components
├── config/
│   └── navigation.tsx      # Menu items & subsystem definitions (nguồn của docs/menu.md)
├── context/                # React Contexts
├── design-system/
│   ├── theme.ts            # Ant Design ConfigProvider theme
│   └── index.ts            # Export antdTheme (Forest CSS nạp từ app/layout.tsx)
├── hooks/                  # Custom hooks
├── layouts/
│   ├── AppHeader.tsx       # Sticky top bar
│   └── AppSidebar.tsx      # Dark left sidebar
├── modules/                # Feature modules (mỗi subsystem 1 folder)
│   ├── kkn/
│   ├── data-collection/
│   ├── ops-support/
│   ├── tools/              # Công cụ nội bộ (vd UIDocGenerator)
│   └── ...
└── types/                  # Shared TypeScript types
docs/
├── menu.md                 # Cấu trúc menu đầy đủ (đồng bộ navigation.tsx)
├── design-system/          # Design system documentation (README/tokens/components/patterns)
└── architecture/README.md  # Architecture overview
AGENTS.md                   # Guide cho Codex — bản song sinh của CLAUDE.md
```

---

## Quy tắc bắt buộc

### 0. Tài liệu docs/design-system là Gốc (Source of Truth)
Mọi quyết định về visual, UI, layout, components và design tokens phải luôn tuân thủ và lấy tài liệu trong [docs/design-system](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/docs/design-system) làm gốc. Bất kỳ chỉ dẫn, cấu hình hay công cụ sinh giao diện ngoại vi nào (kể cả Stitch) đều phải đồng bộ và đối chiếu với tài liệu gốc này làm chuẩn.

### 1. Luôn dùng design tokens — không hardcode giá trị

```tsx
// ✅ ĐÚNG
import { antdTheme } from '@/design-system';
style={{ color: 'var(--primary)', padding: 'var(--spacing-16)' }}

// ❌ SAI
style={{ color: '#1677ff', padding: '16px' }}
```

### 2. Mọi page list đều dùng shared UI components

```tsx
import { PageLayout, FilterBar, FilterCol, SectionCard,
         StatusSummaryBar, StatusTag, ActionMenu,
         CodeText, tablePagination } from '@/components/ui';
```

Xem API đầy đủ tại [docs/design-system/components.md](docs/design-system/components.md).

### 3. Không import màu subsystem bằng string literal

```tsx
// ✅ ĐÚNG
import { SUBSYSTEMS } from '@/config/subsystems';
SUBSYSTEMS.kkn.theme.primaryColor     // '#f59e0b'
SUBSYSTEMS.ops.theme.primaryColor     // '#8b5cf6'

// ❌ SAI
'#fa8c16'
```

### 4. Pattern chuẩn cho mọi table page

Xem [docs/design-system/patterns.md](docs/design-system/patterns.md) — copy template từ đó, không tự phát minh lại.

### 5. Pagination luôn dùng `tablePagination()` helper

```tsx
import { tablePagination } from '@/components/ui';

<Table pagination={tablePagination()} ... />
// hoặc override:
<Table pagination={tablePagination({ pageSize: 50 })} ... />
```

### 6. Header actions đăng ký qua hook, không hardcode vào layout

```tsx
import useHeaderActions from '@/hooks/useHeaderActions';

useHeaderActions({
  title: 'Tên trang',
  actions: [
    { key: 'add', label: 'Thêm mới', icon: <PlusOutlined />, onClick: fn, type: 'primary' },
  ]
}, []);
```

### 7. Kiểm tra sự tuân thủ thiết kế (Design Compliance Check)
Trước khi tạo mới hoặc sửa đổi bất kỳ giao diện, component nào (như Modal, Form, Card, v.v.), **BẮT BUỘC** phải đối chiếu thiết kế của chúng với các component mẫu trong thư mục `frontend/src/modules/design-system-explorer/components` hoặc các tài liệu hướng dẫn trong `docs/design-system`.
- **Modal:** Tiêu đề ở dạng chữ thường viết hoa chữ đầu (không viết IN HOA toàn bộ), lược bỏ icon tiêu đề, các nút footer phải được căn giữa (`justifyContent: 'center'`) và đồng bộ kích thước/bo góc.
- **Form/Card:** Không tự tạo màu nền/khoảng cách/kiểu dáng khác biệt mà không sử dụng tokens.

### 8. Quy định Bảng Lịch sử thay đổi (Audit Change History Table)
Tất cả màn hình Xem chi tiết bắt buộc phải có **Bảng Lịch sử thay đổi** thống kê các lần cập nhật làm thay đổi dữ liệu của người dùng/hệ thống:
- **Bố cục**: Đặt trong `<Collapse>` (mặc định thu gọn `defaultActiveKey={[]}`).
- **Cấu hình Bảng**: Tối đa chiều cao `250px` (`scroll={{ y: 250, x: 1300 }}`), không phân trang (`pagination={false}`), hiển thị tối đa 20 bản ghi mới nhất xếp ở trên cùng.
- **Cấu trúc 8 cột chuẩn**:
  1. `STT` (50px, align center)
  2. `Thời gian` (170px): Hiển thị `dd/mm/yyyy`, hover hiển thị tooltip `dd/mm/yyyy hh:mm:ss`.
  3. `Người cập nhật` (160px): Hiển thị username, hover hiển thị tooltip Họ và tên đầy đủ.
  4. `Hành động` (140px): Tên hành động tác động dữ liệu.
  5. `Giá trị cũ` (220px): Giá trị trước thay đổi.
  6. `Giá trị mới` (220px): Giá trị sau thay đổi thành công.
  7. `Địa chỉ IP` (130px): IP thiết bị thực hiện.
  8. `Mô tả` (240px): Lý do/ghi chú/tệp đính kèm (nếu > 2 dòng có "Xem tiếp", file dạng link tải về).
- **Shared Component**: Sử dụng `<ChangeHistoryCollapse data={historyItems} />` từ `@/components/ui`.

### 9. Tiêu chuẩn giao diện danh sách (List Page Standards — chuẩn mực từ `/ops-support/job-management`)
Mọi màn hình danh sách (List Page) phải tuân thủ nghiêm ngặt các quy chuẩn giao diện, kiểu chữ, định dạng dữ liệu và phân trang sau:

- **Bộ tìm kiếm (`FilterBar`)**:
  - Bắt buộc dùng `inCard` (hoặc `variant="context"`): nền màu Sage tint (`#edf3ed`), viền mờ nhạt `var(--border)`, bo góc `var(--radius-md)` tạo cảm giác Context Banner nhất quán.
  - Chỉ hiển thị nút "Thêm bộ lọc" khi có hành vi ẩn/hiện trường thật: truyền `onAddFilter` vào `FilterBar` hoặc dùng popover riêng qua `extra`. Không hiển thị nút không có tác dụng.
  - Thiết lập `minWidth` hợp lý cho từng `<FilterCol>` (130px - 220px) để các ô tìm kiếm trải đều, các nút *Tìm kiếm* (Primary) và *Đặt lại* (`ReloadOutlined`) luôn neo vững ở góc phải.
- **Thẻ bảng dữ liệu (`SectionCard`)**:
  - Không lặp lại tiêu đề nếu Header trang đã có tên chức năng rõ ràng: Dùng `<SectionCard flex>`. Chỉ đặt `title` và `count` (`<SectionCard title="Tên danh sách" count={data.length} flex>`) khi trang có nhiều khối danh sách hoặc cần phân đoạn riêng biệt.
  - Chọn hàng loạt (`rowSelection`): Khi người dùng chọn các dòng dữ liệu, Header tự động hiển thị nút thao tác lô (vd: `Gửi duyệt (${selectedRowKeys.length})` hoặc `Chạy Job (${selectedRowKeys.length})`).
  - Tương tác click dòng: nhấp vào bất kỳ đâu trên dòng dữ liệu (`onRow -> onClick`) mở trực tiếp Modal chi tiết.
- **Font chữ, style & Định dạng dữ liệu**:
  - **Mã định danh (Mã Job, Mã SP, Mã hồ sơ)**: Dùng font sans-serif đậm màu xanh primary (`<Text strong style={{ color: 'var(--primary)', whiteSpace: 'nowrap' }}>{code}</Text>`) hoặc `<CodeText>{code}</CodeText>`.
  - **Tên đối tượng**: Dùng `<Text strong>{name}</Text>`, bật `ellipsis: true` kèm `Tooltip` nếu văn bản dài.
  - **Người tạo / Người duyệt / Người cập nhật**:
    - Hiển thị trực tiếp `username`, **TUYỆT ĐỐI KHÔNG thêm ký tự `@` phía trước** (hiển thị `admin`, `nguyenvana`, KHÔNG DÙNG `@admin`, `@nguyenvana`).
    - Bắt buộc có thuộc tính `whiteSpace: 'nowrap'`.
    - Bọc trong `<Tooltip title={fullName}>` để khi hover sẽ hiển thị Họ và tên đầy đủ.
  - **Ngày tháng**: Căn giữa (`align: 'center'`), định dạng `dd/MM/yyyy`, hover hiển thị tooltip `dd/MM/yyyy HH:mm:ss`. Nếu trống hiển thị `—`.
- **Phân trang (`tablePagination`)**:
  - Luôn sử dụng helper chuẩn `tablePagination({ current: currentPage, pageSize, total: data.length, showQuickJumper: false, onChange })`.
  - Quản lý state `currentPage` và `pageSize`, tự động reset về trang 1 khi danh sách dữ liệu lọc thay đổi (`React.useEffect(() => { setCurrentPage(1); }, [data])`).
- **Cột Thao tác (`ActionMenu`)**:
  - Chiều rộng chuẩn `width: 75`, `align: 'center'`, `fixed: 'right'`.
  - Sử dụng dropdown 3 chấm `<ActionMenu items={items} />` chuẩn Rule 2, KHÔNG dàn trải nhiều nút icon nhỏ rời rạc gây rối mắt và tràn màn hình.
  - Các hành động mang tính rủi ro/phá hủy (Từ chối, Xóa, Thu hồi) phải đặt `danger: true` và có divider (`{ type: 'divider' }`) ngăn cách.

---

## Naming conventions

| Thứ | Convention | Ví dụ |
|---|---|---|
| Components | PascalCase | `FilterBar`, `SectionCard` |
| Hooks | camelCase với prefix `use` | `useHeaderActions`, `useIsMobile` |
| Types/Interfaces | PascalCase với prefix `I` cho data models | `INotification`, `IVariable` |
| Files | PascalCase cho components, camelCase cho utilities | `FilterBar.tsx`, `tableConfig.ts` |
| Status enums | SCREAMING_SNAKE_CASE | `'ACTIVE'`, `'PENDING'` |

---

## Làm việc với modules

Mỗi feature module nằm trong `frontend/src/modules/<subsystem>/<FeatureName>/`. Cấu trúc chuẩn:

```
modules/ops-support/JobManagement/
├── index.tsx           # Page container, đăng ký useHeaderActions
├── JobFilter.tsx       # Dùng <FilterBar> + <FilterCol>
├── JobList.tsx         # Dùng <Table> + <ActionMenu> + <StatusTag>
├── JobDetailPage.tsx   # Detail / form page
├── useJobManagement.ts # Business logic hook
├── mockData.ts         # Mock data (xóa khi có API thật)
└── types.ts            # Types cục bộ (nếu cần)
```

---

## Những điều KHÔNG làm

- **Không** hardcode hex color trong component; dùng Forest CSS variables, cấu hình subsystem và theme trung tâm
- **Không** dùng `background: '#f5f5f5'` — phải dùng `var(--bg)`
- **Không** tạo `padding: '16px'` — phải dùng `var(--spacing-16)`
- **Không** tự tạo status tag riêng — dùng `<StatusTag status="ACTIVE" />`
- **Không** tự tạo action dropdown riêng — dùng `<ActionMenu items={...} />`
- **Không** viết pagination config thủ công — dùng `tablePagination()`
- **Không** thêm actions vào header bằng cách sửa `AppHeader.tsx` — dùng `useHeaderActions`
- **Không** đặt z-index tuỳ ý — dùng `zIndex.*` tokens

---

## Khi thêm page mới

1. Tạo folder trong module đúng subsystem
2. Copy pattern từ [docs/design-system/patterns.md](docs/design-system/patterns.md)
3. Đăng ký `useHeaderActions` với title và actions cần thiết
4. Không cần sửa `AppHeader.tsx` hay `AppSidebar.tsx`
5. Thêm route vào `navigation.tsx` nếu cần menu item
6. Nếu có thêm/đổi menu item → cập nhật [docs/menu.md](docs/menu.md) cho khớp với `navigation.tsx`

---

## Khi thêm token mới

Ưu tiên CSS variables của `@ntda/forest-design-system` (nạp tại `frontend/app/layout.tsx`). `@/design-system` chỉ export `antdTheme`; không import `colors`/`spacing` từ đó. Cấu hình số cho Ant Design ở `theme.ts`, layout/z-index ở `config/layout.ts`, màu subsystem ở `config/subsystems.ts`. Không khôi phục `tokens.ts` cũ. Với prop chỉ nhận số (vd `Space.size`), dùng giá trị từ theme hoặc CSS `gap` thay vì truyền CSS string.
Sau đó cập nhật [docs/design-system/tokens.md](docs/design-system/tokens.md).
