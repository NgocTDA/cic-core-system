'use client';
import React from 'react';
import { Select, Typography, Space, Tooltip, Dropdown } from 'antd';
import { useSubSystem } from '../context/SubSystemContext';
import { SUB_SYSTEMS } from '../config/navigation';
import { colors, typography, layout, radius, zIndex } from '../design-system';

const { Text } = Typography;
const { Option } = Select;

// CSS class dùng để scope dropdown styles — tránh leak toàn app
const POPUP_CLASS = 'subsystem-switcher-dropdown';
const SELECT_CLASS = 'subsystem-switcher-select';

interface SubSystemSwitcherProps {
    mode?: 'light' | 'dark' | 'header';
    collapsed?: boolean;
}

const SubSystemSwitcher: React.FC<SubSystemSwitcherProps> = ({ mode = 'light', collapsed = false }) => {
    const { activeSubSystem, setActiveSubSystem } = useSubSystem();

    const isDark = mode === 'dark' || mode === 'header';
    const isHeader = mode === 'header';

    // ─── Collapsed: icon + Dropdown để chọn phân hệ ─────────
    if (collapsed) {
        const collapsedMenuItems = {
            items: SUB_SYSTEMS.map(sys => ({
                key: sys.id,
                label: (
                    <Space>
                        <span style={{ color: sys.color, fontSize: 16, display: 'flex', alignItems: 'center' }}>
                            {sys.icon}
                        </span>
                        <span>{sys.name}</span>
                    </Space>
                ),
            })),
            onClick: ({ key }: { key: string }) => setActiveSubSystem(key),
        };

        return (
            <div style={{
                height: layout.headerHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: isHeader ? `1px solid ${colors.sidebar.divider}` : 'none',
            }}>
                <Dropdown 
                    menu={collapsedMenuItems} 
                    placement="bottomLeft" 
                    trigger={['click']}
                    overlayStyle={{ zIndex: zIndex.overlay }}
                >
                    <Tooltip title={`Chuyển phân hệ (Hiện tại: ${activeSubSystem.name})`} placement="right">
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: radius.md,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isDark ? colors.sidebar.hoverBg : colors.neutral[100],
                            color: activeSubSystem.color,
                            cursor: 'pointer',
                            fontSize: 24,
                        }}>
                            {activeSubSystem.icon}
                        </div>
                    </Tooltip>
                </Dropdown>
            </div>
        );
    }

    // ─── Header mode: Select mở rộng trong sidebar ────────────
    if (isHeader) {
        return (
            <div style={{
                height: layout.headerHeight,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                borderBottom: `1px solid ${colors.sidebar.divider}`,
                background: 'rgba(0,0,0,0.12)',
            }}>
                <Select
                    value={activeSubSystem.id}
                    onChange={setActiveSubSystem}
                    style={{
                        flex: 1,
                        fontWeight: typography.fontWeight.bold,
                        fontSize: typography.fontSize.md,
                    }}
                    variant="borderless"
                    className={SELECT_CLASS}
                    popupClassName={POPUP_CLASS}
                    dropdownStyle={{
                        background: colors.sidebar.bgDeep,
                        borderRadius: radius.md,
                        border: `1px solid ${colors.sidebar.divider}`,
                        zIndex: zIndex.overlay,
                    }}
                >
                    {SUB_SYSTEMS.map(sys => (
                        <Option key={sys.id} value={sys.id} label={sys.name}>
                            <Space>
                                <span style={{
                                    color: sys.color,
                                    fontSize: 18,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    {sys.icon}
                                </span>
                                <span style={{ color: colors.sidebar.text }}>{sys.name}</span>
                            </Space>
                        </Option>
                    ))}
                </Select>

                {/* Scoped styles — chỉ ảnh hưởng đến dropdown của component này */}
                <style jsx global>{`
                    .${SELECT_CLASS} .ant-select-selection-item {
                        color: ${colors.text.inverse} !important;
                        font-size: ${typography.fontSize.md} !important;
                        display: flex !important;
                        align-items: center !important;
                    }
                    .${SELECT_CLASS} .ant-select-selection-item .ant-space {
                        gap: 12px !important;
                    }
                    .${SELECT_CLASS} .ant-select-arrow {
                        color: ${colors.sidebar.textSecond} !important;
                    }
                    .${POPUP_CLASS} {
                        background-color: ${colors.sidebar.bgDeep} !important;
                        padding: 4px !important;
                    }
                    .${POPUP_CLASS} .ant-select-item {
                        color: ${colors.sidebar.text} !important;
                        border-radius: ${radius.sm} !important;
                        margin-bottom: 2px !important;
                    }
                    .${POPUP_CLASS} .ant-select-item-option-active {
                        background-color: ${colors.sidebar.hoverBg} !important;
                    }
                    .${POPUP_CLASS} .ant-select-item-option-selected {
                        background-color: rgba(255, 255, 255, 0.14) !important;
                        font-weight: ${typography.fontWeight.semibold} !important;
                    }
                `}</style>
            </div>
        );
    }

    // ─── Light mode: dùng cho các vị trí khác (ít dùng) ──────
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: isDark ? colors.sidebar.hoverBg : colors.neutral[100],
            padding: '4px 12px',
            borderRadius: radius.md,
            border: isDark
                ? `1px solid ${colors.sidebar.divider}`
                : `1px solid ${colors.border.base}`,
            margin: isDark ? '8px 16px' : '0',
        }}>
            <Space size="small" style={{ width: '100%' }}>
                {!isDark && (
                    <Text type="secondary" style={{ fontSize: typography.fontSize.sm, marginRight: 8 }}>
                        Phân hệ:
                    </Text>
                )}
                <Select
                    value={activeSubSystem.id}
                    onChange={setActiveSubSystem}
                    style={{
                        width: isDark ? '100%' : 220,
                        fontWeight: typography.fontWeight.semibold,
                    }}
                    variant="borderless"
                    dropdownStyle={{ borderRadius: radius.md }}
                >
                    {SUB_SYSTEMS.map(sys => (
                        <Option key={sys.id} value={sys.id}>
                            <Space>
                                <span style={{ color: sys.color }}>{sys.icon}</span>
                                <span style={{ color: isDark ? colors.sidebar.text : 'inherit' }}>
                                    {sys.name}
                                </span>
                            </Space>
                        </Option>
                    ))}
                </Select>
            </Space>
        </div>
    );
};

export default SubSystemSwitcher;
