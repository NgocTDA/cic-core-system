# Design Tokens — Reference

> Source: `frontend/src/design-system/tokens.ts`
> Import: `import { colors, spacing, ... } from '@/design-system'`

---

## Colors

### Primary (Brand Blue)

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.primary[50]` | `#e6f4ff` | Hover bg, selected row bg |
| `colors.primary[100]` | `#bae0ff` | |
| `colors.primary[400]` | `#4096ff` | |
| `colors.primary[500]` | `#1677ff` | **Default brand**, links, active |
| `colors.primary[600]` | `#0958d9` | Hover trên primary button |
| `colors.primary[900]` | `#001d66` | |

### Subsystem Accents

| Token | Hex | Subsystem |
|---|---|---|
| `colors.subsystem.kkn` | `#fa8c16` | Kênh kết nối |
| `colors.subsystem.collection` | `#1890ff` | Thu thập dữ liệu |
| `colors.subsystem.product` | `#52c41a` | Quản lý sản phẩm |
| `colors.subsystem.ops` | `#722ed1` | Hỗ trợ vận hành |
| `colors.subsystem.analytics` | `#eb2f96` | Báo cáo thống kê |
| `colors.subsystem.governance` | `#13c2c2` | Quản trị dữ liệu |

> Dùng khi cần màu badge, icon, hoặc accent theo subsystem context. **Không dùng cho text thông thường.**

### Semantic

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.success.light` | `#f6ffed` | Success background |
| `colors.success.base` | `#52c41a` | Success icon, tag |
| `colors.success.dark` | `#389e0d` | Xuất Excel button, hover |
| `colors.warning.light` | `#fffbe6` | Warning background |
| `colors.warning.base` | `#faad14` | Warning icon, tag |
| `colors.warning.dark` | `#d48806` | |
| `colors.error.light` | `#fff2f0` | Error background |
| `colors.error.base` | `#ff4d4f` | Error tag, danger |
| `colors.error.dark` | `#cf1322` | |
| `colors.info.base` | `#1677ff` | Info (= primary) |
| `colors.info.dark` | `#0958d9` | |

### Neutral Scale

| Token | Hex | Thường dùng cho |
|---|---|---|
| `colors.neutral[0]` | `#ffffff` | |
| `colors.neutral[50]` | `#fafafa` | Subtle bg, table header alt |
| `colors.neutral[100]` | `#f5f5f5` | |
| `colors.neutral[200]` | `#f0f0f0` | |
| `colors.neutral[300]` | `#d9d9d9` | Border |
| `colors.neutral[400]` | `#bfbfbf` | Placeholder icon, disabled |
| `colors.neutral[500]` | `#8c8c8c` | Secondary text, badge gray |
| `colors.neutral[600]` | `#595959` | |
| `colors.neutral[800]` | `#262626` | |

### Backgrounds

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.bg.page` | `#f5f7fa` | Layout background, content area |
| `colors.bg.container` | `#ffffff` | Card, panel, header |
| `colors.bg.subtle` | `#fafafa` | Alternating rows |
| `colors.bg.overlay` | `rgba(0,0,0,0.45)` | Modal overlay |

### Sidebar (Dark theme)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `colors.sidebar.bg` | `#2e3035` | Nền sidebar |
| `colors.sidebar.bgDeep` | `#1f2024` | Footer sidebar |
| `colors.sidebar.text` | `rgba(255,255,255,0.85)` | Text chính |
| `colors.sidebar.textSecond` | `rgba(255,255,255,0.45)` | Text phụ, version |
| `colors.sidebar.selectedBg` | `#fa8c16` | Menu item đang chọn |
| `colors.sidebar.selectedText` | `#ffffff` | |
| `colors.sidebar.hoverBg` | `rgba(255,255,255,0.08)` | Hover |
| `colors.sidebar.divider` | `rgba(255,255,255,0.12)` | Đường kẻ ngang |

### Text

| Token | Giá trị | Dùng cho |
|---|---|---|
| `colors.text.primary` | `rgba(0,0,0,0.88)` | Text chính |
| `colors.text.secondary` | `rgba(0,0,0,0.45)` | Label, meta, table header |
| `colors.text.tertiary` | `rgba(0,0,0,0.25)` | Placeholder |
| `colors.text.disabled` | `rgba(0,0,0,0.25)` | Disabled state |
| `colors.text.inverse` | `#ffffff` | Text trên nền tối |

### Border

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.border.base` | `#d9d9d9` | Input, card border |
| `colors.border.split` | `#f0f0f0` | Table row divider |
| `colors.border.subtle` | `#f5f5f5` | Subtle section divider |

---

## Typography

### Font Family

| Token | Giá trị |
|---|---|
| `typography.fontFamily.sans` | `'Inter', -apple-system, ...` |
| `typography.fontFamily.mono` | `'JetBrains Mono', 'Fira Code', ...` |

> `sans` cho mọi UI text. `mono` cho code, ID, mã tham chiếu — dùng qua `<CodeText>`.

### Font Size

| Token | Px | Dùng cho |
|---|---|---|
| `typography.fontSize.xs` | `11px` | Section label, badge text |
| `typography.fontSize.sm` | `12px` | Caption, tooltip |
| `typography.fontSize.base` | `14px` | Body text (default) |
| `typography.fontSize.md` | `16px` | Sub-heading |
| `typography.fontSize.lg` | `18px` | |
| `typography.fontSize.xl` | `20px` | Page title (H4) |
| `typography.fontSize['2xl']` | `24px` | Statistic value |

### Font Weight

| Token | Giá trị | Dùng cho |
|---|---|---|
| `typography.fontWeight.regular` | `400` | Body text |
| `typography.fontWeight.medium` | `500` | Username, small label |
| `typography.fontWeight.semibold` | `600` | Highlighted menu, subheading |
| `typography.fontWeight.bold` | `700` | Table header, heading |

---

## Spacing (8pt grid)

| Token | Px | CSS shorthand |
|---|---|---|
| `spacing[0.5]` | `2px` | Micro gap |
| `spacing[1]` | `4px` | Icon padding |
| `spacing[2]` | `8px` | Small gap |
| `spacing[3]` | `12px` | |
| `spacing[4]` | `16px` | Standard padding |
| `spacing[5]` | `20px` | |
| `spacing[6]` | `24px` | Card padding, section gap |
| `spacing[7]` | `28px` | |
| `spacing[8]` | `32px` | |
| `spacing[10]` | `40px` | |
| `spacing[12]` | `48px` | |

---

## Border Radius

| Token | Px | Dùng cho |
|---|---|---|
| `radius.xs` | `2px` | Badge |
| `radius.sm` | `4px` | Tag, small button |
| `radius.md` | `6px` | **Default** (Ant Design), input, button |
| `radius.lg` | `8px` | Card, SectionCard |
| `radius.xl` | `12px` | Modal, drawer |
| `radius.full` | `9999px` | Avatar, pill |

---

## Shadows

| Token | Giá trị | Dùng cho |
|---|---|---|
| `shadows.xs` | `0 1px 2px rgba(0,0,0,0.04)` | SectionCard, FilterBar card |
| `shadows.sm` | `0 2px 8px rgba(0,0,0,0.06)` | AppHeader |
| `shadows.md` | `0 4px 16px rgba(0,0,0,0.08)` | |
| `shadows.lg` | `0 8px 24px rgba(0,0,0,0.10)` | |
| `shadows.card` | `0 2px 8px rgba(0,0,0,0.05)` | Card hover |
| `shadows.menu` | `0 6px 16px rgba(0,0,0,0.08), ...` | Dropdown menu |

---

## Layout

| Token | Giá trị | Dùng cho |
|---|---|---|
| `layout.sidebarWidth` | `256` (px) | Sider width |
| `layout.sidebarCollapsedWidth` | `64` (px) | Collapsed sider |
| `layout.headerHeight` | `56` (px) | AppHeader height |
| `layout.contentPadding` | `'24px'` | |

> Page padding thực tế: `'16px 24px 24px'` — dùng `<PageLayout>` thay vì tự set.

---

## Z-Index Scale

| Token | Giá trị | Dùng cho |
|---|---|---|
| `zIndex.hide` | `-1` | |
| `zIndex.base` | `0` | |
| `zIndex.raised` | `1` | AppHeader (relative positioning) |
| `zIndex.dropdown` | `1000` | |
| `zIndex.sticky` | `1100` | AppSidebar (sticky) |
| `zIndex.overlay` | `1200` | |
| `zIndex.modal` | `1300` | Modal |
| `zIndex.popover` | `1400` | |
| `zIndex.toast` | `1500` | Notification |
| `zIndex.tooltip` | `1600` | |

---

## Component Sizes (control height)

| Token | Px | Ant Design tương ứng |
|---|---|---|
| `size.xs` | `24` | `controlHeightXS` |
| `size.sm` | `28` | `controlHeightSM` |
| `size.md` | `32` | `controlHeight` (default) |
| `size.lg` | `40` | `controlHeightLG` |
| `size.xl` | `48` | |
