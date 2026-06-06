# CIC Core System — Claude Working Guide

Hướng dẫn này giúp Claude Code hiểu codebase và làm việc nhất quán với các quyết định kiến trúc đã có.

---

## Tổng quan dự án

**CIC Core System** là hệ thống quản lý thông tin tín dụng nội bộ, bao gồm 6 subsystem:

| ID | Tên | Màu |
|---|---|---|
| `kkn` | Kênh kết nối | `#fa8c16` (cam) |
| `data-collection` | Thu thập & xử lý dữ liệu | `#1890ff` (xanh dương) |
| `product-mgmt` | Quản lý & tạo lập sản phẩm | `#52c41a` (xanh lá) |
| `ops-support` | Hỗ trợ vận hành | `#722ed1` (tím) |
| `analytics-reporting` | Báo cáo thống kê | `#eb2f96` (hồng) |
| `data-governance` | Quản trị dữ liệu | `#13c2c2` (teal) |

---

## Tech stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **UI Library**: Ant Design 5.24+
- **Styling**: Tailwind CSS (utility), inline styles via design tokens (primary)
- **Path alias**: `@/` → `frontend/src/`
- **State**: React Context (`HeaderContext`, `SubSystemContext`)

---

## Cấu trúc thư mục

```
frontend/src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # Shared design-system components ← DÙNG CHO MỌI PAGE
│   └── *.tsx               # Standalone global components
├── config/
│   └── navigation.tsx      # Menu items & subsystem definitions
├── context/                # React Contexts
├── design-system/
│   ├── tokens.ts           # Single source of truth cho mọi visual value
│   ├── theme.ts            # Ant Design ConfigProvider theme
│   └── index.ts            # Barrel export
├── hooks/                  # Custom hooks
├── layouts/
│   ├── AppHeader.tsx       # Sticky top bar
│   └── AppSidebar.tsx      # Dark left sidebar
├── modules/                # Feature modules (mỗi subsystem 1 folder)
│   ├── kkn/
│   ├── data-collection/
│   ├── ops-support/
│   └── ...
└── types/                  # Shared TypeScript types
docs/
├── design-system/          # Design system documentation
│   ├── README.md           # Overview + quick start
│   ├── tokens.md           # Token reference
│   ├── components.md       # UI component API
│   └── patterns.md         # Page patterns & full examples
└── architecture/
    └── README.md           # Architecture overview
```

---

## Quy tắc bắt buộc

### 0. Tài liệu docs/design-system là Gốc (Source of Truth)
Mọi quyết định về visual, UI, layout, components và design tokens phải luôn tuân thủ và lấy tài liệu trong [docs/design-system](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/docs/design-system) làm gốc. Bất kỳ chỉ dẫn, cấu hình hay công cụ sinh giao diện ngoại vi nào (kể cả Stitch) đều phải đồng bộ và đối chiếu với tài liệu gốc này làm chuẩn.

### 1. Luôn dùng design tokens — không hardcode giá trị

```tsx
// ✅ ĐÚNG
import { colors, spacing, shadows, typography } from '@/design-system';
style={{ color: colors.primary[500], padding: spacing[4] }}

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
import { colors } from '@/design-system';
colors.subsystem.kkn     // '#fa8c16'
colors.subsystem.ops     // '#722ed1'

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

- **Không** hardcode hex color bên ngoài `design-system/tokens.ts`
- **Không** dùng `background: '#f5f5f5'` — phải dùng `colors.bg.page`
- **Không** tạo `padding: '16px'` — phải dùng `spacing[4]`
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

---

## Khi thêm token mới

Chỉ thêm vào `frontend/src/design-system/tokens.ts`. Không hardcode ở chỗ khác.
Sau đó cập nhật [docs/design-system/tokens.md](docs/design-system/tokens.md).
