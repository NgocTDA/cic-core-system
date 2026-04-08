import React from 'react';
import { Select, Typography, Space, Tooltip } from 'antd';
import { useSubSystem } from '../context/SubSystemContext';
import { SUB_SYSTEMS } from '../config/navigation';

const { Text } = Typography;
const { Option } = Select;

interface SubSystemSwitcherProps {
    mode?: 'light' | 'dark' | 'header';
    collapsed?: boolean;
}

const SubSystemSwitcher: React.FC<SubSystemSwitcherProps> = ({ mode = 'light', collapsed = false }) => {
    const { activeSubSystem, setActiveSubSystem } = useSubSystem();

    const isDark = mode === 'dark' || mode === 'header';
    const isHeader = mode === 'header';

    if (collapsed) {
        return (
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: isHeader ? '1px solid rgba(255,255,255,0.1)' : 'none'
            }}>
                <Tooltip title={`Chuyển phân hệ (Hiện tại: ${activeSubSystem.name})`} placement="right">
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f2f5',
                        color: activeSubSystem.color,
                        cursor: 'pointer',
                        fontSize: 24
                    }}>
                        {activeSubSystem.icon}
                    </div>
                </Tooltip>
            </div>
        );
    }

    if (isHeader) {
        return (
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                lineHeight: '64px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Select
                        value={activeSubSystem.id}
                        onChange={setActiveSubSystem}
                        style={{
                            flex: 1,
                            fontWeight: 700,
                            fontSize: '16px'
                        }}
                        variant="borderless"
                        dropdownStyle={{
                            background: '#1f2024',
                            borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        className="header-subsystem-select"
                    >
                        {SUB_SYSTEMS.map(sys => (
                            <Option key={sys.id} value={sys.id} label={sys.name}>
                                <Space>
                                    <span style={{ color: sys.color, fontSize: 18, display: 'flex', alignItems: 'center' }}>{sys.icon}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.85)' }}>{sys.name}</span>
                                </Space>
                            </Option>
                        ))}
                    </Select>
                </div>
                <style jsx global>{`
                    .header-subsystem-select .ant-select-selection-item {
                        color: #fff !important;
                        font-size: 16px !important;
                        display: flex !important;
                        align-items: center !important;
                    }
                    .header-subsystem-select .ant-select-selection-item .ant-space {
                        gap: 12px !important;
                    }
                    .header-subsystem-select .ant-select-arrow {
                        color: rgba(255,255,255,0.45) !important;
                    }
                    /* Dropdown styling */
                    .ant-select-dropdown {
                        background-color: #1f2024 !important;
                        padding: 4px !important;
                    }
                    .ant-select-dropdown .ant-select-item {
                        color: rgba(255,255,255,0.85) !important;
                        border-radius: 4px !important;
                        margin-bottom: 2px !important;
                    }
                    .ant-select-dropdown .ant-select-item-option-active {
                        background-color: rgba(255,255,255,0.08) !important;
                    }
                    .ant-select-dropdown .ant-select-item-option-selected {
                        background-color: rgba(255,255,255,0.12) !important;
                        font-weight: 600 !important;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f2f5',
            padding: '4px 12px',
            borderRadius: '6px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #d9d9d9',
            margin: isDark ? '8px 16px' : '0'
        }}>
            <Space size="small" style={{ width: '100%' }}>
                {!isDark && <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>Phân hệ:</Text>}
                <Select
                    value={activeSubSystem.id}
                    onChange={setActiveSubSystem}
                    style={{ width: isDark ? '100%' : 220, fontWeight: 600 }}
                    variant="borderless"
                    dropdownStyle={{ borderRadius: 6 }}
                >
                    {SUB_SYSTEMS.map(sys => (
                        <Option key={sys.id} value={sys.id}>
                            <Space>
                                <span style={{ color: sys.color }}>{sys.icon}</span>
                                <span style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'inherit' }}>{sys.name}</span>
                            </Space>
                        </Option>
                    ))}
                </Select>
            </Space>
        </div>
    );
};

export default SubSystemSwitcher;
