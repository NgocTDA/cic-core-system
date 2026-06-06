# Design System: CIC Core System

## 1. Visual Atmosphere & Philosophy
* **The Kinetic Architect**: A professional, high-density command center that feels authoritative yet breathable. We prioritize structural transparency and sophisticated depth over rigid grids and heavy borders. The interface should feel like a bespoke architectural ledger—precise, organized, and premium.
* **Token-First Principle**: Every color, spacing, radius, and shadow must align with predefined system tokens. No ad-hoc or hardcoded layout variables.
* **Composition, not Customization**: Use shared UI components (`PageLayout`, `FilterBar`, `SectionCard`, etc.) as building blocks rather than building custom layouts from scratch.
* **Ant Design 5 Integration**: The system extends Ant Design 5 via a unified custom `ConfigProvider`. Avoid global CSS overrides; leverage Ant Design's native theme config where possible.

## 2. Global UI Standards (MANDATORY)
These rules are non-negotiable and must be applied to every interactive element:
* **Control Height Scale**:
    * **32px** (`size.md` - Standard/Default) for all standard buttons, inputs, selects, and pickers.
    * **28px** (`size.sm`) for compact inputs/tables.
    * **40px** (`size.lg`) for large inputs/primary hero elements.
* **Border Radius Scale**:
    * **6px`** (`radius.md` - Standard) for standard inputs, buttons, and form controls.
    * **8px`** (`radius.lg`) for Cards, Panels, and [SectionCard](file:///c:/Users/ngoct/Downloads/Code/cic-core-system/docs/design-system/components.md#L80).
    * **12px`** (`radius.xl`) for Modals, Dialogs, and Drawers.
    * **4px`** (`radius.sm`) for Tags and minor chips.
    * **2px`** (`radius.xs`) for Badges.
    * **9999px** (`radius.full`) for Avatars and pill shapes.
* **Density**: 7/10 (Balanced for enterprise productivity, with 8pt grid padding).

## 3. Color Palette & Roles

### Brand & Surface Foundations
* **Primary Brand Blue** (#1677FF) — Default brand color (`colors.primary[500]`) for links, active states, and primary buttons.
    * Hover State: **#0958D9** (`colors.primary[600]`).
    * Background Active Tint: **#E6F4FF** (`colors.primary[50]`).
* **Canvas Neutral** (#F5F7FA) — Global background surface for the page layout and main content area.
* **Pure Surface** (#FFFFFF) — Card, table container, panel, and page header background surface.
* **Sidebar Charcoal** (#2E3035) — Deep charcoal gray for the primary navigation sidebar container background.
    * Sidebar Deep Footer: **#1F2024**.
    * Sidebar Selected Item Accent: **#FA8C16** (Selected menu background).
    * Sidebar Hover Accent: **rgba(255,255,255,0.08)**.

### Subsystem Accents
Used for accent indicators, category-specific tags, or icon accents:
* **Kênh kết nối (KKN)**: **#FA8C16** (`colors.subsystem.kkn`)
* **Thu thập dữ liệu (Collection)**: **#1890FF** (`colors.subsystem.collection`)
* **Quản lý sản phẩm (Product)**: **#52C41A** (`colors.subsystem.product`)
* **Hỗ trợ vận hành (Ops)**: **#722ED1** (`colors.subsystem.ops`)
* **Báo cáo thống kê (Analytics)**: **#EB2F96** (`colors.subsystem.analytics`)
* **Quản trị dữ liệu (Governance)**: **#13C2C2** (`colors.subsystem.governance`)

### Semantic States
* **Success**: Base **#52C41A** (Success tags, positive states), Background **#F6FFED**, Hover/Dark **#389E0D**.
* **Warning**: Base **#FAAD14** (Pending, warning tags), Background **#FFFBE6**, Dark **#D48806**.
* **Error/Danger**: Base **#FF4D4F** (Failed, danger buttons/tags), Background **#FFF2F0**, Dark **#CF1322**.
* **Info**: Base **#1677FF** (Default system messages).

### Typographic & Neutral Scale
* **Primary Text** (rgba(0,0,0,0.88)) — Main body text, headings, and labels.
* **Secondary Text** (rgba(0,0,0,0.45)) — Table headers, subtext, captions, and placeholders.
* **Border Base** (#D9D9D9) — Default border color for inputs and cards.
* **Border Split** (#F0F0F0) — Subtle row divider borders in tables.

## 4. Typography Rules
* **Font Stack**: **Inter** (Primary) for all standard text. Paired with system fallbacks.
* **Monospace Stack**: **JetBrains Mono** or **Fira Code** for identifiers, codes, references, and variables. (Always wrap in `<CodeText>` component in code).
* **Typography Sizes**:
    * Page Title (H4): **20px** (`typography.fontSize.xl`)
    * Sub-heading: **16px** (`typography.fontSize.md`)
    * Body Text (Default): **14px** (`typography.fontSize.base`)
    * Caption/Tooltip: **12px** (`typography.fontSize.sm`)
    * Badge/Section Label: **11px** (`typography.fontSize.xs`)
* **Typography Weights**:
    * Regular: **400** (Body, descriptions)
    * Medium: **500** (Labels, usernames)
    * Semibold: **600** (Sub-headers, highlighted menus)
    * Bold: **700** (Headings, table headers)

## 5. Component Stylings

### Buttons & Inputs
* **Control Sizing**: Standard height of **32px**, rounded corner radius of **6px**.
* **Button Alignment**: For form action button groups (e.g., Save/Cancel), align them to the **center** of the form card.
* **Form Layout**: Vertical arrangement: Input labels positioned above inputs, with an **8px** gap (`spacing[2]`).

### Cards & Sections
* **SectionCard**: Always use for containing lists, tables, and content sections.
    * Border Radius: **8px** (`radius.lg`).
    * Shadow: Ultra-soft shadow `shadows.xs` (`0 1px 2px rgba(0,0,0,0.04)`) to separate sections visually.
    * Dividers: Use **1px hairline borders** in `#F0F0F0` (`colors.border.split`) or `#F5F5F5` (`colors.border.subtle`) rather than heavy separators.

### Shared UI Components
Stitch generations should prioritize using or mapping to these component schemas:
* **PageLayout**: Wrapper with standard responsive padding (`16px 24px 24px` on desktop, `8px` on mobile).
* **FilterBar + FilterCol**: Standard search/filter row containing inputs and dropdowns, with Action Buttons (Search/Reset) right-aligned.
* **StatusSummaryBar**: Summary count badges grouped together horizontally to display totals (e.g., Error/Warning/Info counts).
* **StatusTag**: Tag component with preset color mapping for system states (e.g., `ACTIVE` = success, `FAILED` = error, `PENDING` = warning).
* **ActionMenu**: Vertical ellipsis (`⋯`) dropdown for list actions in tables.
* **CodeText**: Monospace code styled element using Primary Blue or Muted Secondary color.

## 6. Layout, Spacing & Motion
* **Header Height**: **56px** (`layout.headerHeight`) with a white background and soft shadow (`0 2px 8px rgba(0,0,0,0.06)`).
* **Sidebar Width**: **256px** (`layout.sidebarWidth`) collapsing to **64px**.
* **Spacing Scale (8pt Grid)**:
    * `2px` (micro gaps)
    * `4px` (gaps between tags/icons)
    * `8px` (gaps between label-input, form items)
    * `12px` (compact padding)
    * `16px` (standard padding, grid columns)
    * `24px` (card padding, large gaps)
* **Glassmorphism**: Use for floating popovers, menus, and dropdowns with `12px` backdrop-blur.
* **Motion**: Smooth, high-performance transitions for interactive states (Ant Design default transition timings).

## 7. Anti-Patterns (NEVER DO)
* **NO** custom hardcoded bo góc (radii) outside of the token scale (`2px`, `4px`, `6px`, `8px`, `12px`).
* **NO** hardcoded hex colors outside the design token scale (always use the documented system colors).
* **NO** `40px` or larger inputs/buttons for standard lists or tables (strictly keep to `32px` standard).
* **NO** pure black `#000000` for text (use Primary Text `rgba(0,0,0,0.88)` instead).
* **NO** emojis in professional enterprise dashboard data.
* **NO** AI cliché terms ("seamless integration", "elevate", "synergy") in generated mock data.
* **NO** fabricated metrics or fake data that doesn't resemble real banking/credit information.
