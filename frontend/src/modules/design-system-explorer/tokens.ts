// ============================================================
//  CIC Core System — Design Tokens
//  Single source of truth for all visual decisions.
//  Import from '@/design-system' in components.
// ============================================================

// ─── COLOR ──────────────────────────────────────────────────

export const colors = {
    // Brand primary — NTDA Forest (Pine Green)
    primary: {
        50:  '#ecf9f3',
        100: '#d9f0e5',
        200: '#bde4d1',
        300: '#9dd5bb',
        400: '#77c0a0',
        500: '#2c795b', // NTDA Forest Pine Green (main brand)
        600: '#195b43',
        700: '#144b36',
        800: '#0e241e',
        900: '#081a15',
    },

    // ─── Subsystem accent colors ─────────────────────────────
    subsystem: {
        kkn:        '#f59e0b', // Kênh kết nối       — Amber Gold (calibrated)
        collection: '#38bdf8', // Thu thập dữ liệu   — Sky Teal-Blue (calibrated)
        product:    '#2a765b', // Quản lý sản phẩm   — ReqHub Emerald (calibrated)
        ops:        '#8b5cf6', // Hỗ trợ vận hành    — Modern Iris/Violet (calibrated)
        analytics:  '#f43f5e', // Báo cáo thống kê   — Rose Coral (calibrated)
        governance: '#14b8a6', // Quản trị dữ liệu   — Deep Mint (calibrated)
        design:     '#7c3aed', // Design System      — Indigo
        portal:     '#0050b3', // Web Portal         — Navy Blue
        tools:      '#1f4e79', // Công cụ nội bộ      — CIC Navy
    },

    // ─── Tools subsystem palette (internal tools) ─────────────
    // Tông navy/blue nhận diện CIC, dùng trong subsystem `tools`.
    toolsColors: {
        primary:   '#1f4e79', // navy — header, heading
        secondary: '#2e75b6', // blue — accent, link
        light:     '#d6e4f0', // blue light — table header / meta cell
        xlight:    '#eef5fb', // blue xtra-light — row alternating
    },

    // ─── Semantic ─────────────────────────────────────────────
    success: {
        light: '#eefae9',
        base:  '#4b8b18',
        dark:  '#3a7401',
    },
    warning: {
        light: '#fef4e8',
        base:  '#976204',
        dark:  '#744a02',
    },
    error: {
        light: '#fff2f0',
        base:  '#db2326',
        dark:  '#c2181d',
    },
    info: {
        light: '#eaf8ff',
        base:  '#1383ac',
        dark:  '#077398',
    },
    processing: '#2c795b',

    // ─── Status / Tag tokens (Organic pastel palette) ─────────
    statusTag: {
        active: {
            bg:     '#ddf0e2',
            text:   '#21603c',
            border: '#c3e4cc',
        },
        warning: {
            bg:     '#faecd9',
            text:   '#895311',
            border: '#f3d4a8',
        },
        error: {
            bg:     '#fae4df',
            text:   '#913426',
            border: '#f2bab0',
        },
        processing: {
            bg:     '#ecf9f3',
            text:   '#144b36',
            border: '#9dd5bb',
        },
        neutral: {
            bg:     '#eaf0ed',
            text:   '#365b4e',
            border: '#d0dfd8',
        },
        notice: {
            bg:     '#fff3d5',
            text:   '#674400',
            border: '#e5c879',
        },
    },

    // ─── Neutral scale (gray) ─────────────────────────────────
    neutral: {
        0:    '#ffffff',
        50:   '#fafafa',
        100:  '#f5f5f5',
        200:  '#f0f0f0',
        300:  '#d9d9d9',
        400:  '#bfbfbf',
        500:  '#8c8c8c',
        600:  '#595959',
        700:  '#434343',
        800:  '#262626',
        900:  '#1f1f1f',
        1000: '#141414',
    },

    // ─── Background surfaces ──────────────────────────────────
    bg: {
        page:      '#f4f5f2', // Warm off-white canvas (ReqHub)
        container: '#ffffff', // cards, panels
        subtle:    '#fbfcfa', // subtle rows, header surface
        context:   '#edf3ed', // context banners, muted sage tint
        overlay:   'rgba(0, 0, 0, 0.45)',
    },

    // ─── Sidebar (dark theme — Forest Ink luxury) ─────────────
    sidebar: {
        bg:           '#132620', // Deep Forest Noir (đậm và sang hơn)
        bgDeep:       '#0f1f1a', // Dark Pine footer
        text:         'rgba(255, 255, 255, 0.88)',
        textSecond:   '#b1c3bc', // Muted sage text
        selectedBg:   '#2b4b40', // Solid Dark Sage (ReqHub active pill)
        selectedText: '#ffffff',
        hoverBg:      '#1f3c32', // Deep sage hover
        divider:      '#244338', // Deep pine divider
    },

    // ─── Text ─────────────────────────────────────────────────
    text: {
        primary:   'rgba(0, 0, 0, 0.88)',
        secondary: 'rgba(0, 0, 0, 0.45)',
        tertiary:  'rgba(0, 0, 0, 0.25)',
        disabled:  'rgba(0, 0, 0, 0.25)',
        inverse:   '#ffffff',
    },

    // ─── Border ───────────────────────────────────────────────
    border: {
        base:    '#d8e0dc', // Soft sage border (ReqHub)
        split:   '#e8edea', // Soft divider line
        subtle:  '#f0f4f1', // Ultra-subtle border
    },
} as const;

// ─── TYPOGRAPHY ─────────────────────────────────────────────

export const typography = {
    fontFamily: {
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        mono: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    },

    fontSize: {
        xs:   '11px',
        sm:   '12px',
        base: '14px', // Ant Design default
        md:   '16px',
        lg:   '18px',
        xl:   '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
    },

    fontWeight: {
        regular:  400,
        medium:   500,
        semibold: 600,
        bold:     700,
        extrabold: 800,
    },

    lineHeight: {
        tight:   1.25,
        snug:    1.375,
        normal:  1.5,
        relaxed: 1.625,
        loose:   2,
    },

    letterSpacing: {
        tight:  '-0.025em',
        normal: '0em',
        wide:   '0.025em',
        wider:  '0.05em',
    },
} as const;

// ─── SPACING (8pt grid) ──────────────────────────────────────

export const spacing = {
    0:   '0px',
    0.5: '2px',
    1:   '4px',
    2:   '8px',
    3:   '12px',
    4:   '16px',
    5:   '20px',
    6:   '24px',
    7:   '28px',
    8:   '32px',
    10:  '40px',
    12:  '48px',
    16:  '64px',
    20:  '80px',
    24:  '96px',
} as const;

// ─── BORDER RADIUS ───────────────────────────────────────────

export const radius = {
    none: '0px',
    xs:   '2px',
    sm:   '4px',
    button: '4px',
    md:   '4px',   // Forest control default 4px
    lg:   '8px',
    xl:   '12px',
    '2xl':'16px',
    '3xl':'24px',
    full: '9999px',
} as const;

export const radiusNumber = {
    none: 0,
    xs:   2,
    sm:   4,
    button: 4,
    md:   4,       // Forest control default 4px
    lg:   8,
    xl:   12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
} as const;

// ─── SHADOWS ─────────────────────────────────────────────────

export const shadows = {
    none: 'none',
    xs:   '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm:   '0 2px 8px rgba(0, 0, 0, 0.06)',
    md:   '0 4px 16px rgba(0, 0, 0, 0.08)',
    lg:   '0 8px 24px rgba(0, 0, 0, 0.10)',
    xl:   '0 16px 48px rgba(0, 0, 0, 0.14)',
    card: '0 2px 8px rgba(0, 0, 0, 0.05)',
    menu: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
} as const;

// ─── TRANSITIONS ─────────────────────────────────────────────

export const transitions = {
    duration: {
        fast:   '100ms',
        normal: '200ms',
        slow:   '300ms',
        slower: '500ms',
    },
    easing: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enter:    'cubic-bezier(0.0, 0, 0.2, 1)',
        exit:     'cubic-bezier(0.4, 0, 1, 1)',
        spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    // Shorthand helpers
    all:        'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    allFast:    'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    allSlow:    'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform:  'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity:    'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors:     'color 200ms, background-color 200ms, border-color 200ms',
} as const;

// ─── BREAKPOINTS ─────────────────────────────────────────────

/* export */ const breakpoints = {
    xs:  0,    // base — tương đương AntD Col xs (all screens, < sm)
    sm:  576,
    md:  768,
    lg:  992,
    xl:  1200,
    xxl: 1600, // align AntD xxl (trước là '2xl')
} as const;

// ─── Z-INDEX LAYERS ──────────────────────────────────────────

export const zIndex = {
    hide:       -1,
    base:        0,
    raised:      1,
    dropdown:  1000,
    sticky:    1100,
    overlay:   1200,
    modal:     1300,
    popover:   1400,
    toast:     1500,
    tooltip:   1600,
} as const;

// ─── LAYOUT ──────────────────────────────────────────────────

export const layout = {
    sidebarWidth:          256,
    sidebarCollapsedWidth: 64,
    headerHeight:          56,
    contentPadding:        '24px',
    contentPaddingMobile:  '16px',
} as const;

// ─── COMPONENT SIZES (control height) ────────────────────────

export const size = {
    xs:  24,
    sm:  24, // align AntD controlHeightSM default
    md:  32, // Ant Design default controlHeight
    lg:  40,
    xl:  48,
} as const;
