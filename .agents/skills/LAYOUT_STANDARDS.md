# CIC Core System Layout Standards

This document defines the UI/UX consistency standards for the CIC Core System application. These rules must be followed for all new modules and layout refinements.

## 1. Sidebar (Navigation)
- **Header**:
  - Collapsed: Display orange icon (`#fa8c16`).
  - Expanded: Display icon + "CIC Core System" title in white (`#fff`).
- **Footer**: Always include version information (e.g., "v1.1.0-alpha") at the bottom, separated by a subtle border.
- **Background**: Use dark theme (`#2e3035`).

## 2. Global Header & Page Titles
- **Page Title**:
  - Located in the **AppHeader**, next to the sidebar toggle.
  - Dynamically mapped based on the URL path.
  - Style: `Title` level 4, `fontWeight: 700`, `margin: 0`.
- **Header Actions (Right Side)**:
  - Buttons must follow a strict order: **Primary Add Action** → **Display Config** → **Export Excel** → **Notifications** → **User Profile**.
  - **Icons**: Use Ant Design icons (`PlusOutlined`, `SettingOutlined`, `FileExcelOutlined`).
  - **Export button**: Use green color (`#389e0d`) for high visibility.

## 3. Content Layout (Two-Card Pattern)
All module pages (especially those with data tables) must follow the **Two-Card** layout to ensure a clean visual hierarchy:
- **Card 1: Filter Area**:
  - Borderless card with `marginBottom: 16`.
  - Filter inputs (Search, Selects, RangePicker) on the left.
  - Action buttons docked to the **right** (`justifyContent: flex-end`).
  - **Reset/Refresh button** (`ReloadOutlined`) must be placed between the "Extra Filter" and the primary "Search" button.
- **Card 2: Data Content**:
  - Borderless card hosting the main Table or Inbox.
  - **Title Area (Left)**: Place primary bulk actions (e.g., "Mark all as read" buttons).
  - **Extra Area (Right)**: Place view toggles (e.g., "List / Inbox" radio group).

## 4. Tables & Data Presentation
- **Size**: Use `middle` size for standard tables.
- **Styling**:
  - Code variables must be wrapped in double curly braces `{{variable_code}}`.
  - Use `monospace` font for codes and sample values.
- **Pagination**:
  - Default `pageSize: 10`.
  - Enable `showSizeChanger` and `showQuickJumper: true`.
  - Content: `Hiển thị {range[0]}-{range[1]} trong tổng {total} bản ghi`.
  - `pageSizeOptions: ['10', '20', '50', '100']`.

## 5. Mobile Responsiveness
- **Sidebar**: Transform into a Drawer.
- **Header Actions**: Collapse complex actions or transform the primary "Add" button into a circle shape to save space.
- **Spacing**: Reduce padding to `8px` on small screens.

