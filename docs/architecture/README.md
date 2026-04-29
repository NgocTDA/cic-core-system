# Frontend Architecture — CIC Core System

> Next.js 14 App Router · TypeScript · Ant Design 5 · Tailwind CSS

---

## Luồng dữ liệu tổng quan

```
URL change
  → Next.js App Router
    → ClientLayout (ConfigProvider + Header + Sidebar)
      → Page Component (route segment)
        → useHeaderActions()        ← đăng ký title + header buttons
          → HeaderContext           ← global state cho AppHeader
        → PageLayout                ← chuẩn hoá padding/flex
          → FilterBar               ← filter inputs
          → StatusSummaryBar        ← (nếu có) badge counts
          → SectionCard             ← wrapper cho table
            → Table                 ← Ant Design table
```

---

## App Router structure

```
frontend/app/
├── layout.tsx          ← Root layout: fonts, metadata
├── globals.css         ← CSS variables từ design tokens
├── (main)/
│   ├── layout.tsx      ← ClientLayout: ConfigProvider + AppHeader + AppSidebar
│   ├── page.tsx        ← Dashboard tổng quan (/)
│   ├── kkn-dashboard/
│   ├── data-collection/
│   ├── ops-support/
│   │   ├── job-management/
│   │   │   ├── page.tsx           ← JobControlCenter
│   │   │   ├── [id]/page.tsx      ← JobDetailPage
│   │   │   └── [id]/edit/page.tsx ← JobFormPage
│   │   ├── notifications/
│   │   └── notification-template/
│   └── data-governance/
└── ...
```

---

## Subsystem switching

Hệ thống có 6 subsystem, mỗi subsystem có menu riêng. Người dùng chuyển subsystem qua `SubSystemSwitcher`.

```
SubSystemContext
  └── activeSubSystem: { id, name, icon, color, menuItems[] }

SubSystemSwitcher     ← UI để chọn subsystem
AppSidebar            ← Render menu của activeSubSystem
```

- Định nghĩa tất cả subsystem + menu trong `config/navigation.tsx`
- Màu accent của subsystem (`subsystem.color`) nên khớp với `colors.subsystem.*` trong tokens

---

## Header actions (page-specific)

AppHeader render buttons theo những gì page hiện tại đăng ký, không hardcode.

```
Page Component
  → useHeaderActions({ title, actions })   ← register
    → HeaderContext.setPageTitle / setPageActions
      → AppHeader reads từ context          ← render

Khi unmount: useHeaderActions tự clear (via useEffect cleanup)
```

**Actions được AppHeader hỗ trợ:**
- `key: 'add'` → render primary button bên trái của icons
- Mọi action có `type: 'primary'` → đặt vào slot "add"
- Actions còn lại → render tùy theo logic header

---

## Design system flow

```
tokens.ts (giá trị gốc)
  ↓
theme.ts (Ant Design ConfigProvider config)
  ↓
ClientLayout → ConfigProvider → antdTheme
  ↓
Mọi Ant Design component trong app hưởng theme

tokens.ts
  ↓
components/ui/*.tsx (shared components dùng token qua import)
  ↓
Page/module components import từ '@/components/ui'
```

---

## State management

Dự án dùng React Context thuần — không có Redux hay Zustand.

| Context | File | Cung cấp |
|---|---|---|
| `HeaderContext` | `context/HeaderContext.tsx` | `pageTitle`, `pageActions`, setter/clearer |
| `SubSystemContext` | `context/SubSystemContext.tsx` | `activeSubSystem`, `setActiveSubSystem` |

Dữ liệu nghiệp vụ (list, detail) được quản lý local trong từng page/hook.

---

## Mock data strategy

- Mỗi feature có `mockData.ts` trong folder riêng
- Mock data dùng TypeScript interface giống production
- Khi tích hợp API: xoá `mockData.ts`, thay `useState(MOCK_DATA)` bằng hook gọi API
- **Không** mock ở global level hay shared file

---

## Quy ước file naming

| Loại | Convention | Ví dụ |
|---|---|---|
| Page container | `index.tsx` | `JobManagement/index.tsx` |
| Feature component | `<Feature><Role>.tsx` | `JobFilter.tsx`, `JobList.tsx` |
| Business hook | `use<Feature>.ts` | `useJobManagement.ts` |
| Types | `<feature>Types.ts` hoặc `types.ts` | `VariableTypes.ts` |
| Mock | `mockData.ts` | — |

---

## Dependency graph (simplified)

```
app/layout.tsx
  └── app/(main)/layout.tsx  (ClientLayout)
        ├── ConfigProvider  ← antdTheme từ design-system/theme.ts
        ├── HeaderProvider  ← HeaderContext
        ├── SubSystemProvider ← SubSystemContext
        ├── AppHeader
        │     └── useHeaderContext()
        └── AppSidebar
              ├── useSubSystem()
              └── useMenuBadges()

Page Component
  ├── useHeaderActions()    ← viết vào HeaderContext
  ├── PageLayout
  ├── FilterBar / FilterCol
  ├── StatusSummaryBar
  └── SectionCard
        └── Table (Ant Design)
              └── columns: StatusTag, ActionMenu, CodeText
```
