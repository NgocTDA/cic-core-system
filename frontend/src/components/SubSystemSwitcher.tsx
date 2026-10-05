'use client';
import React from 'react';
import { Select, Typography, Space, Tooltip, Dropdown } from 'antd';
import { useSubSystem } from '../context/SubSystemContext';
import { SUB_SYSTEMS } from '../config/navigation';
import { layout, zIndex } from '@/config/layout';

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
                borderBottom: isHeader ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
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
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--color-neutral-100)',
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(0,0,0,0.12)',
            }}>
                <Select
                    value={activeSubSystem.id}
                    onChange={setActiveSubSystem}
                    style={{
                        flex: 1,
                        fontWeight: 700,
                        fontSize: '16px',
                    }}
                    variant="borderless"
                    className={SELECT_CLASS}
                    classNames={{ popup: { root: POPUP_CLASS } }}
                    styles={{
                        popup: {
                            root: {
                                background: 'var(--color-ink-950)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                zIndex: zIndex.overlay,
                            },
                        },
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
                                    }}
                                >
                                    {sys.icon}
                                </span>
                                <span style={{ color: 'var(--color-neutral-0)' }}>{sys.name}</span>
                            </Space>
                        </Option>
                    ))}
                </Select>

                {/* Scoped styles — chỉ ảnh hưởng đến dropdown của component này */}
                <style jsx global>{`
                    .${SELECT_CLASS} .ant-select-selection-item {
                        color: var(--text-inverse) !important;
                        font-size: 16px !important;
                        display: flex !important;
                        align-items: center !important;
                    }
                    .${SELECT_CLASS} .ant-select-selection-item .ant-space {
                        gap: 12px !important;
                    }
                    .${SELECT_CLASS} .ant-select-arrow {
                        color: var(--color-secondary-300) !important;
                    }
                    .${POPUP_CLASS} {
                        background-color: var(--color-ink-950) !important;
                        padding: 4px !important;
                    }
                    .${POPUP_CLASS} .ant-select-item {
                        color: var(--color-neutral-0) !important;
                        border-radius: var(--radius-sm) !important;
                        margin-bottom: 2px !important;
                    }
                    .${POPUP_CLASS} .ant-select-item-option-active {
                        background-color: rgba(255, 255, 255, 0.08) !important;
                    }
                    .${POPUP_CLASS} .ant-select-item-option-selected {
                        background-color: rgba(255, 255, 255, 0.14) !important;
                        font-weight: 600 !important;
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
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--color-neutral-100)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-md)',
            border: isDark
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid var(--border)',
            margin: isDark ? '8px 16px' : '0',
        }}>
            <Space size="small" style={{ width: '100%' }}>
                {!isDark && (
                    <Text type="secondary" style={{ fontSize: '12px', marginRight: 8 }}>
                        Phân hệ:
                    </Text>
                )}
                <Select
                    value={activeSubSystem.id}
                    onChange={setActiveSubSystem}
                    style={{
                        width: isDark ? '100%' : 220,
                        fontWeight: 600,
                    }}
                    variant="borderless"
                    styles={{ popup: { root: { borderRadius: 'var(--radius-md)' } } }}
                >
                    {SUB_SYSTEMS.map(sys => (
                        <Option key={sys.id} value={sys.id}>
                            <Space>
                                <span style={{ color: sys.color }}>{sys.icon}</span>
                                <span style={{ color: isDark ? 'var(--color-neutral-0)' : 'inherit' }}>
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
