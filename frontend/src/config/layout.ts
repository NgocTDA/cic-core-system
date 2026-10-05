// ============================================================
//  CIC Core System — Layout Dimension Constants
// ============================================================

export const layout = {
    sidebarWidth:          256,
    sidebarCollapsedWidth: 64,
    headerHeight:          56,
    contentPadding:        '24px',
    contentPaddingMobile:  '16px',
} as const;

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
