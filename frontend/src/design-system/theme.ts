// ============================================================
//  CIC Core System — Ant Design Theme Configuration
//  Single source of truth for ConfigProvider theme.
//  Used in ClientLayout.tsx.
// ============================================================

import type { ThemeConfig } from 'antd';
import { colors, typography, radius, size } from './tokens';

export const antdTheme: ThemeConfig = {
    token: {
        // ─── Brand ───────────────────────────────────────────
        colorPrimary:         colors.primary[500],
        colorSuccess:         colors.success.base,
        colorWarning:         colors.warning.base,
        colorError:           colors.error.base,
        colorInfo:            colors.info.base,

        // ─── Typography ───────────────────────────────────────
        fontFamily:           typography.fontFamily.sans,
        fontSize:             14,
        fontSizeSM:           12,
        fontSizeLG:           16,
        fontSizeXL:           20,
        fontSizeHeading1:     38,
        fontSizeHeading2:     30,
        fontSizeHeading3:     24,
        fontSizeHeading4:     20,
        fontSizeHeading5:     16,

        // ─── Layout & sizing ─────────────────────────────────
        borderRadius:         radius.md as unknown as number,      // 6
        borderRadiusSM:       radius.sm as unknown as number,      // 4
        borderRadiusLG:       radius.lg as unknown as number,      // 8
        borderRadiusXS:       radius.xs as unknown as number,      // 2
        controlHeight:        size.md,      // 32
        controlHeightSM:      size.sm,      // 28
        controlHeightLG:      size.lg,      // 40
        controlHeightXS:      size.xs,      // 24

        // ─── Colors ───────────────────────────────────────────
        colorBgContainer:     colors.bg.container,
        colorBgLayout:        colors.bg.page,
        colorBorder:          colors.border.base,
        colorBorderSecondary: colors.border.split,
        colorText:            colors.text.primary,
        colorTextSecondary:   colors.text.secondary,
        colorTextTertiary:    colors.text.tertiary,
        colorTextDisabled:    colors.text.disabled,

        // ─── Motion ──────────────────────────────────────────
        motionDurationFast:   '0.1s',
        motionDurationMid:    '0.2s',
        motionDurationSlow:   '0.3s',
    },

    components: {
        // ─── Menu ────────────────────────────────────────────
        // darkItemSelectedBg không set ở đây — được override động
        // trong AppSidebar qua ConfigProvider theo activeSubSystem.color
        Menu: {
            darkItemColor:     colors.sidebar.text,
            darkSubMenuItemBg: colors.sidebar.bgDeep,
        },

        // ─── Layout ──────────────────────────────────────────
        Layout: {
            siderBg:               colors.sidebar.bg,
            triggerBg:             colors.sidebar.bgDeep,
            headerBg:              colors.bg.container,
            headerHeight:          56,
            headerPadding:         '0 16px',
            footerPadding:         '12px 24px',
        },

        // ─── Table ────────────────────────────────────────────
        Table: {
            headerBg:              colors.neutral[50],
            headerColor:           colors.text.secondary,
            rowHoverBg:            colors.primary[50],
            borderColor:           colors.border.split,
        },

        // ─── Card ─────────────────────────────────────────────
        Card: {
            paddingLG:             24,
        },

        // ─── Button ───────────────────────────────────────────
        Button: {
            defaultShadow:         'none',
            primaryShadow:         'none',
            dangerShadow:          'none',
        },

        // ─── Input ────────────────────────────────────────────
        Input: {
            activeShadow:          `0 0 0 2px ${colors.primary[50]}`,
            errorActiveShadow:     `0 0 0 2px ${colors.error.light}`,
        },

        // ─── Select ───────────────────────────────────────────
        Select: {
            optionSelectedBg:      colors.primary[50],
            optionActiveBg:        colors.neutral[50],
        },

        // ─── Drawer ───────────────────────────────────────────
        Drawer: {
            paddingLG:             24,
        },

        // ─── Modal ────────────────────────────────────────────
        Modal: {
            paddingContentHorizontalLG: 24,
        },

        // ─── Tag ──────────────────────────────────────────────
        Tag: {
            defaultBg:             colors.neutral[100],
        },

        // ─── Badge ────────────────────────────────────────────
        Badge: {
            statusSize:            6,
        },

        // ─── Form ─────────────────────────────────────────────
        Form: {
            labelFontSize:         14,
            itemMarginBottom:      20,
        },

        // ─── Breadcrumb ───────────────────────────────────────
        Breadcrumb: {
            separatorColor:        colors.neutral[400],
            linkColor:             colors.text.secondary,
            linkHoverColor:        colors.primary[500],
            lastItemColor:         colors.text.primary,
        },

        // ─── Statistic ────────────────────────────────────────
        Statistic: {
            titleFontSize:         13,
            contentFontSize:       24,
        },

        // ─── Tabs ─────────────────────────────────────────────
        Tabs: {
            inkBarColor:           colors.primary[500],
            itemSelectedColor:     colors.primary[500],
        },

        // ─── Collapse ─────────────────────────────────────────
        Collapse: {
            headerBg:              colors.neutral[50],
        },

        // ─── Tooltip ──────────────────────────────────────────
        Tooltip: {
            fontSize:              12,
        },

        // ─── Popover ──────────────────────────────────────────
        Popover: {
            titleMinWidth:         200,
        },

        // ─── Divider ──────────────────────────────────────────
        Divider: {
            colorSplit:            colors.border.split,
        },

        // ─── Alert ────────────────────────────────────────────
        Alert: {
            defaultPadding:        '8px 12px',
        },

        // ─── Steps ────────────────────────────────────────────
        Steps: {
            customIconSize:        32,
            iconSize:              32,
        },
    },
};
