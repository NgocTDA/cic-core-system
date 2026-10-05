// ============================================================
//  CIC Core System — Ant Design Theme Configuration
//  Single source of truth for ConfigProvider theme.
//  Powered by NTDA Forest Design System.
// ============================================================

import type { ThemeConfig } from 'antd';
import { forestLight } from '@ntda/forest-design-system/antd';
import { zIndex } from '@/config/layout';

export const antdTheme: ThemeConfig = {
    ...forestLight,
    token: {
        ...forestLight.token,
        // ─── Brand ───────────────────────────────────────────
        colorPrimary:         '#2c795b', // Pine Green
        colorSuccess:         '#4b8b18',
        colorWarning:         '#976204',
        colorError:           '#db2326',
        colorInfo:            '#1383ac',

        // ─── Typography ───────────────────────────────────────
        fontFamily:           "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
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
        borderRadius:         4,
        borderRadiusSM:       4,
        borderRadiusLG:       8,
        borderRadiusXS:       2,
        controlHeight:        32,
        controlHeightSM:      24,
        controlHeightLG:      40,
        controlHeightXS:      24,
        zIndexPopupBase:      zIndex.modal,

        // ─── Colors ───────────────────────────────────────────
        colorBgContainer:     '#ffffff',
        colorBgLayout:        '#f7fbf9',           // Forest soft canvas
        colorBorder:          '#e0eae5',           // Forest border
        colorBorderSecondary: '#edf7f2',
        colorText:            '#121916',           // Forest text primary
        colorTextSecondary:   '#4c5551',           // Forest text muted
        colorTextTertiary:    '#6d7672',           // Forest text subtle
        colorTextDisabled:    '#9aa39f',

        // ─── Motion ──────────────────────────────────────────
        motionDurationFast:   '0.1s',
        motionDurationMid:    '0.2s',
        motionDurationSlow:   '0.3s',
    },

    components: {
        ...forestLight.components,
        // ─── Menu ────────────────────────────────────────────
        Menu: {
            darkItemColor:         '#8c9ba5',
            darkSubMenuItemBg:     '#0f1f1a',
            darkItemHoverBg:       'rgba(255, 255, 255, 0.08)',
            darkItemHoverColor:    '#ffffff',
            darkItemSelectedBg:    '#244338',
            darkItemSelectedColor: '#ffffff',
        },

        // ─── Layout ──────────────────────────────────────────
        Layout: {
            siderBg:               '#132620',
            triggerBg:             '#0f1f1a',
            headerBg:              '#ffffff',
            headerHeight:          56,
            headerPadding:         '0 16px',
            footerPadding:         '12px 24px',
        },

        // ─── Table ────────────────────────────────────────────
        Table: {
            headerBg:              '#edf7f2', // Forest soft sage tint
            headerColor:           '#4c5551',
            rowHoverBg:            '#ecf9f3',
            borderColor:           '#e0eae5',
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
            borderRadius:          4,
        },

        // ─── Input ────────────────────────────────────────────
        Input: {
            activeShadow:          '0 0 0 2px #ecf9f3',
            errorActiveShadow:     '0 0 0 2px #fff2f0',
            borderRadius:          4,
        },

        // ─── Select ───────────────────────────────────────────
        Select: {
            optionSelectedBg:      '#ecf9f3',
            optionActiveBg:        '#f7fbf9',
            borderRadius:          4,
        },

        // ─── Drawer ───────────────────────────────────────────
        Drawer: {
            paddingLG:             24,
        },

        // ─── Modal ────────────────────────────────────────────
        Modal: {
            paddingContentHorizontalLG: 24,
            borderRadiusLG:        12,
        },

        // ─── Tag ──────────────────────────────────────────────
        Tag: {
            defaultBg:             '#edf7f2',
            borderRadiusSM:        4,
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
            separatorColor:        '#9aa39f',
            linkColor:             '#4c5551',
            linkHoverColor:        '#2c795b',
            lastItemColor:         '#121916',
        },

        // ─── Statistic ────────────────────────────────────────
        Statistic: {
            titleFontSize:         13,
            contentFontSize:       24,
        },

        // ─── Tabs ─────────────────────────────────────────────
        Tabs: {
            inkBarColor:           '#2c795b',
            itemSelectedColor:     '#2c795b',
            itemHoverColor:        '#23634a',
        },

        // ─── Collapse ─────────────────────────────────────────
        Collapse: {
            headerBg:              '#edf7f2',
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
            colorSplit:            '#e0eae5',
        },

        // ─── Alert ────────────────────────────────────────────
        Alert: {
            defaultPadding:        '8px 12px',
            borderRadiusLG:        4,
        },

        // ─── Steps ────────────────────────────────────────────
        Steps: {
            customIconSize:        32,
            iconSize:              32,
        },
    },
};
