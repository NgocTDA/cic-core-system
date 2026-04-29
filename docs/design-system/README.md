# Design System — CIC Core System

> **Single source of truth** cho mọi quyết định visual của toàn hệ thống.

---

## Triết lý

- **Token-first**: Mọi giá trị màu, kích thước, shadow đều khai báo trong `tokens.ts` trước, component dùng token sau — không bao giờ ngược lại.
- **Composition, not customization**: Dùng shared components `@/components/ui`, không tự tạo lại UI pattern đã có.
- **Ant Design làm nền**: Hệ thống extend Ant Design 5 thông qua `ConfigProvider` — không override CSS global, không viết custom CSS cho những gì Ant Design đã có.

---

## Cấu trúc files

```
frontend/src/design-system/
├── tokens.ts       ← Tất cả giá trị gốc: colors, spacing, radius, shadow, ...
├── theme.ts        ← Ant Design ThemeConfig cho ConfigProvider
└── index.ts        ← Barrel export (re-export tất cả từ tokens.ts + theme.ts)

frontend/src/components/ui/
├── PageLayout.tsx
├── FilterBar.tsx
├── SectionCard.tsx
├── StatusTag.tsx
├── ActionMenu.tsx
├── CodeText.tsx
├── StatusSummaryBar.tsx
├── tableConfig.ts
└── index.ts        ← Import từ đây: import { ... } from '@/components/ui'
```

---

## Import

```tsx
// Design tokens
import { colors, spacing, shadows, radius, typography,
         layout, zIndex, transitions } from '@/design-system';

// Ant Design theme (chỉ dùng trong ClientLayout)
import { antdTheme } from '@/design-system';

// Shared UI components
import {
  PageLayout, FilterBar, FilterCol, SectionCard,
  StatusSummaryBar, StatusTag, ActionMenu, CodeText,
  tablePagination,
} from '@/components/ui';
```

---

## Tài liệu chi tiết

| File | Nội dung |
|---|---|
| [tokens.md](./tokens.md) | Toàn bộ token values, scale, và cách dùng |
| [components.md](./components.md) | API reference cho từng UI component |
| [patterns.md](./patterns.md) | Template code cho các loại page phổ biến |

---

## Kiến trúc visual nhanh

```
┌─────────────────────────────────────────────────────────────┐
│  AppHeader  (height: 56px, bg: white, shadow: sm)           │
├──────────────┬──────────────────────────────────────────────┤
│              │  PageLayout (padding: 16px 24px 24px)         │
│  AppSidebar  │  ┌──────────────────────────────────────┐    │
│  (256px)     │  │  FilterBar                           │    │
│              │  ├──────────────────────────────────────┤    │
│  bg: #2e3035 │  │  StatusSummaryBar (optional)         │    │
│              │  ├──────────────────────────────────────┤    │
│              │  │  SectionCard (flex: 1)               │    │
│              │  │    Table + tablePagination()         │    │
│              │  └──────────────────────────────────────┘    │
└──────────────┴──────────────────────────────────────────────┘
```
