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
| `colors.subsystem.kkn` | `#f59e0b` | Kênh kết nối (Amber Gold) |
| `colors.subsystem.collection` | `#38bdf8` | Thu thập dữ liệu (Sky Teal-Blue) |
| `colors.subsystem.product` | `#2a765b` | Quản lý sản phẩm (ReqHub Emerald) |
| `colors.subsystem.ops` | `#8b5cf6` | Hỗ trợ vận hành (Modern Iris/Violet) |
| `colors.subsystem.analytics` | `#f43f5e` | Báo cáo thống kê (Rose Coral) |
| `colors.subsystem.governance` | `#14b8a6` | Quản trị dữ liệu (Deep Mint) |
| `colors.subsystem.design` | `#7c3aed` | Design System |
| `colors.subsystem.portal` | `#0050b3` | Web Portal |
| `colors.subsystem.tools` | `#1f4e79` | Công cụ nội bộ (CIC Navy) |

> Dùng khi cần màu badge, icon, hoặc accent theo subsystem context. **Không dùng cho text thông thường.**

#### Tools palette (`colors.toolsColors`)

Bảng màu navy/blue riêng cho subsystem `tools` (CIC UI Doc Generator…).

| Token | Hex | Dùng cho |
|---|---|---|
| `colors.toolsColors.primary` | `#1f4e79` | navy — header, heading |
| `colors.toolsColors.secondary` | `#2e75b6` | blue — accent, link |
| `colors.toolsColors.light` | `#d6e4f0` | blue light — table header / meta cell |
| `colors.toolsColors.xlight` | `#eef5fb` | blue xtra-light — row alternating |

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

### Status Tag Palette (colors.statusTag)

Gam màu hữu cơ (Organic Pastel) độ bão hòa thấp, chống chói mắt cho các thẻ trạng thái trong bảng dữ liệu:

| Role | Nền (`bg`) | Chữ (`text`) | Viền (`border`) | Trạng thái áp dụng |
|---|---|---|---|---|
| `active` | `#ddf0e2` | `#21603c` | `#c3e4cc` | `ACTIVE`, `APPROVED`, `VALID` |
| `warning` | `#faecd9` | `#895311` | `#f3d4a8` | `SCHEDULED`, `PAUSED`, `PENDING`, `REVIEWING` |
| `error` | `#fae4df` | `#913426` | `#f2bab0` | `FAILED`, `REJECTED`, `UNREAD`, `INVALID`, `ERROR` |
| `processing` | `#e6f4ff` | `#0958d9` | `#bae0ff` | `RUNNING` |
| `neutral` | `#eaf0ed` | `#365b4e` | `#d0dfd8` | `INACTIVE`, `ARCHIVED`, `IDLE`, `READ`, `CLOSED` |
| `notice` | `#fff3d5` | `#674400` | `#e5c879` | Cảnh báo quan trọng, one-time keys |

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
| `colors.bg.page` | `#f4f5f2` | Layout background, content area (Warm Off-white Canvas) |
| `colors.bg.container` | `#ffffff` | Card, panel, header |
| `colors.bg.subtle` | `#fbfcfa` | Alternating rows, header surface |
| `colors.bg.context` | `#edf3ed` | Context banners, muted sage tint |
| `colors.bg.overlay` | `rgba(0,0,0,0.45)` | Modal overlay |

### Sidebar (Dark theme — Forest Ink Luxury)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `colors.sidebar.bg` | `#132620` | Nền sidebar (Deep Forest Noir đậm sâu) |
| `colors.sidebar.bgDeep` | `#0f1f1a` | Footer sidebar (Dark Pine) |
| `colors.sidebar.text` | `rgba(255,255,255,0.88)` | Text chính trên nền tối |
| `colors.sidebar.textSecond` | `#b1c3bc` | Text phụ, version, icon mặc định |
| `colors.sidebar.selectedBg` | `#2b4b40` | Nền menu item đang chọn (Solid Dark Sage + Left Indicator) |
| `colors.sidebar.selectedText` | `#ffffff` | Chữ menu item đang chọn |
| `colors.sidebar.hoverBg` | `#1f3c32` | Nền menu item khi hover chuột |
| `colors.sidebar.divider` | `#244338` | Đường kẻ ngang, viền phân cách |

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
| `colors.border.base` | `#d8e0dc` | Input, card border (Soft Sage Line) |
| `colors.border.split` | `#e8edea` | Table row divider |
| `colors.border.subtle` | `#f0f4f1` | Subtle section divider |

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
| `typography.fontSize.base` | `14px` | Body text (default, align AntD) |
| `typography.fontSize.md` | `16px` | Sub-heading |
| `typography.fontSize.lg` | `18px` | |
| `typography.fontSize.xl` | `20px` | Page title (H4) |
| `typography.fontSize['2xl']` | `24px` | Statistic value |
| `typography.fontSize['3xl']` | `30px` | |
| `typography.fontSize['4xl']` | `36px` | |
| `typography.fontSize['5xl']` | `48px` | Display |

### Font Weight

| Token | Giá trị | Dùng cho |
|---|---|---|
| `typography.fontWeight.regular` | `400` | Body text |
| `typography.fontWeight.medium` | `500` | Username, small label |
| `typography.fontWeight.semibold` | `600` | Highlighted menu, subheading |
| `typography.fontWeight.bold` | `700` | Table header, heading |
| `typography.fontWeight.extrabold` | `800` | Display heading |

### Line Height

| Token | Giá trị | Dùng cho |
|---|---|---|
| `typography.lineHeight.tight` | `1.25` | Heading compact |
| `typography.lineHeight.snug` | `1.375` | |
| `typography.lineHeight.normal` | `1.5` | Body text (default) |
| `typography.lineHeight.relaxed` | `1.625` | Label, caption |
| `typography.lineHeight.loose` | `2` | |

### Letter Spacing

| Token | Giá trị | Dùng cho |
|---|---|---|
| `typography.letterSpacing.tight` | `-0.025em` | Display heading |
| `typography.letterSpacing.normal` | `0em` | Default |
| `typography.letterSpacing.wide` | `0.025em` | Button text |
| `typography.letterSpacing.wider` | `0.05em` | Badge, uppercase label |

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
| `radius.md` | `6px` | **Default** (align AntD), input, button |
| `radius.lg` | `8px` | Card, SectionCard, Modal/Drawer built-in |
| `radius.xl` | `12px` | Large card, elevated panel tùy chỉnh |
| `radius.full` | `9999px` | Avatar, pill |

> **Lưu ý**: AntD Modal/Drawer built-in dùng `borderRadiusLG = radius.lg = 8px` (xem `theme.ts`). Dùng `radius.xl` cho custom container, không phải AntD component.
> Khi cấu hình AntD theme cần giá trị số, dùng `radiusNumber.*` tương ứng với `radius.*` thay vì parse chuỗi CSS trong component/theme.

---

## Shadows

| Token | Giá trị | Dùng cho |
|---|---|---|
| `shadows.none` | `'none'` | Reset shadow |
| `shadows.xs` | `0 1px 2px rgba(0,0,0,0.04)` | SectionCard, FilterBar card |
| `shadows.sm` | `0 2px 8px rgba(0,0,0,0.06)` | AppHeader |
| `shadows.md` | `0 4px 16px rgba(0,0,0,0.08)` | |
| `shadows.lg` | `0 8px 24px rgba(0,0,0,0.10)` | |
| `shadows.xl` | `0 16px 48px rgba(0,0,0,0.14)` | |
| `shadows.card` | `0 2px 8px rgba(0,0,0,0.05)` | Card hover |
| `shadows.menu` | `0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)` | Dropdown, popup menu (align AntD) |

---

## Layout

| Token | Giá trị | Dùng cho |
|---|---|---|
| `layout.sidebarWidth` | `256` (px) | Sider width |
| `layout.sidebarCollapsedWidth` | `64` (px) | Collapsed sider |
| `layout.headerHeight` | `56` (px) | AppHeader height |
| `layout.contentPadding` | `'24px'` | |
| `layout.contentPaddingMobile` | `'16px'` | Padding trên mobile |

> Page padding thực tế: `'16px 24px 24px'` — dùng `<PageLayout>` thay vì tự set.

---

## Breakpoints

Align hoàn toàn với Ant Design Grid breakpoints.

| Token | Px | AntD Grid tương ứng |
|---|---|---|
| `breakpoints.xs` | `0` | xs — base, áp dụng mọi màn hình (< sm) |
| `breakpoints.sm` | `576` | sm |
| `breakpoints.md` | `768` | md |
| `breakpoints.lg` | `992` | lg |
| `breakpoints.xl` | `1200` | xl |
| `breakpoints.xxl` | `1600` | xxl |

> **Lưu ý**: `breakpoints.xs = 0` là base tier, không dùng trong `@media (min-width: 0px)`. Dùng làm tham chiếu cho AntD `<Col xs={...}>` responsive props. Token chưa tích hợp tự động với AntD Grid — cần import và dùng thủ công khi viết media query tùy chỉnh.

---

## Transitions

Token format dùng **milliseconds** (`'100ms'`). Khi set `motionDuration*` trong `theme.ts`, AntD yêu cầu format **giây** (`'0.1s'`) — không truyền `transitions.duration.*` trực tiếp vào ThemeConfig.

### Duration

| Token | Giá trị | AntD ThemeConfig mapping |
|---|---|---|
| `transitions.duration.fast` | `'100ms'` | `motionDurationFast: '0.1s'` |
| `transitions.duration.normal` | `'200ms'` | `motionDurationMid: '0.2s'` |
| `transitions.duration.slow` | `'300ms'` | `motionDurationSlow: '0.3s'` |
| `transitions.duration.slower` | `'500ms'` | Không có AntD equivalent — custom |

### Easing

| Token | Giá trị |
|---|---|
| `transitions.easing.standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `transitions.easing.enter` | `cubic-bezier(0.0, 0, 0.2, 1)` |
| `transitions.easing.exit` | `cubic-bezier(0.4, 0, 1, 1)` |
| `transitions.easing.spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Shorthands (dùng trong CSS `transition` property)

| Token | Dùng cho |
|---|---|
| `transitions.all` | `all 200ms standard` |
| `transitions.allFast` | `all 100ms standard` |
| `transitions.allSlow` | `all 300ms standard` |
| `transitions.transform` | transform only |
| `transitions.opacity` | opacity only |
| `transitions.colors` | color + background-color + border-color |

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

| Token | Px | AntD ThemeConfig | Ghi chú |
|---|---|---|---|
| `size.xs` | `24` | `controlHeightXS` | |
| `size.sm` | `24` | `controlHeightSM` | Align AntD default |
| `size.md` | `32` | `controlHeight` | Default |
| `size.lg` | `40` | `controlHeightLG` | |
| `size.xl` | `48` | — | Custom extension, không có AntD equivalent |
