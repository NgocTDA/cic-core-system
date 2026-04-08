# Design System: CIC Core System

## 1. Visual Atmosphere & Philosophy
**The Kinetic Architect**: A professional, high-density command center that feels authoritative yet breathable. We prioritize structural transparency and sophisticated depth over rigid grids and heavy borders. The interface should feel like a bespoke architectural ledger—precise, organized, and premium.

## 2. Global UI Standards (MANDATORY)
These rules are non-negotiable and must be applied to every interactive element:
- **Control Height**: **32px** (Standard) for all buttons, inputs, selects, and pickers.
- **Border Radius**: **6px** (Uniform) for all cards, containers, inputs, and buttons.
- **Density**: 7/10 (Balanced for enterprise productivity).

## 3. Color Palette & Roles
- **Primary Accuracy** (#1677FF) — Main brand color for primary actions and active states.
- **Canvas Neutral** (#F5F7FA) — Global background surface for the main content area.
- **Sidebar Slate** (#001529) — Deep navy for the primary navigation anchor.
- **Pure Surface** (#FFFFFF) — Primary card and data entry area background.
- **High-End Neutrals**: Use Ant Design v5 Neutral scale. Never use pure black (#000000); use Zinc-950 or Charcoal for text.

## 4. Typography Rules
- **Font Stack**: **Inter** (Primary) paired with system fallbacks.
- **Display**: Track-tight, weight-driven hierarchy. Use for major metrics.
- **Body**: 14px (Standard) for data tables and forms.
- **No-Serif Rule**: Serif fonts are strictly BANNED in all dashboard and software interfaces.

## 5. Component Stylings
- **Buttons**:
    - **Height**: 32px.
    - **Radius**: 6px.
    - **Style**: Flat or subtle gradient. No outer glows.
- **Inputs & Forms**:
    - **Height**: 32px.
    - **Radius**: 6px.
    - **Layout**: Labels above input, 8px gap.
- **Cards**:
    - **Radius**: 6px.
    - **Elevation**: Tonal layering (shifting hex values) over heavy shadows.
    - **The "No-Line" Rule**: Avoid 1px borders between sections; use subtle background shifts to define boundaries.

## 6. Layout & Motion
- **Header/Sidebar Header Alignment**: Both must have a consistent height (64px).
- **Glassmorphism**: Use for floating elements (Top Nav, Popovers) with 12px backdrop-blur.
- **Motion**: Spring physics (stiffness: 100, damping: 20) for all interactive states.

## 7. Anti-Patterns (NEVER DO)
- NO hardcoded 8px or 12px radii.
- NO 40px/large buttons or inputs unless explicitly specified for a Hero section.
- NO emojis in business data.
- NO AI clichés ("Seamless", "Elevate").
- NO fabricated metrics or fake data.
