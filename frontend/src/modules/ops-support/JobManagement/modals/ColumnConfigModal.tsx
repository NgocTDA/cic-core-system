'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Row, Col, Button, Space, Typography, Divider } from 'antd';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { colors, spacing, radius, typography } from '@/design-system';

const { Text } = Typography;

export interface IColumnOption {
  key: string;
  label: string;
}

export const ALL_JOB_COLUMNS: IColumnOption[] = [
  { key: 'code', label: 'Mã Job' },
  { key: 'name', label: 'Tên Job' },
  { key: 'serviceCode', label: 'Mã dịch vụ' },
  { key: 'category', label: 'Loại Job' },
  { key: 'triggerType', label: 'Điều kiện kích hoạt' },
  { key: 'cron', label: 'Biểu thức Cron' },
  { key: 'status', label: 'Trạng thái' },
];

export const DEFAULT_VISIBLE_COLUMNS = ALL_JOB_COLUMNS.map((c) => c.key);

interface ColumnConfigModalProps {
  visible: boolean;
  visibleKeys: string[];
  onChange: (keys: string[]) => void;
  onClose: () => void;
}

const ColumnConfigModal: React.FC<ColumnConfigModalProps> = ({
  visible,
  visibleKeys,
  onChange,
  onClose,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(visibleKeys);

  useEffect(() => {
    if (visible) {
      setSelectedKeys(visibleKeys);
    }
  }, [visible, visibleKeys]);

  const handleToggle = (key: string) => {
    if (selectedKeys.includes(key)) {
      if (selectedKeys.length <= 1) {
        return; // At least 1 column must remain visible
      }
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  const handleSelectAll = () => {
    setSelectedKeys(DEFAULT_VISIBLE_COLUMNS);
  };

  const handleResetDefault = () => {
    setSelectedKeys(DEFAULT_VISIBLE_COLUMNS);
    onChange(DEFAULT_VISIBLE_COLUMNS);
  };

  const handleSave = () => {
    onChange(selectedKeys);
    onClose();
  };

  return (
    <Modal
      title="Cấu hình hiển thị cột"
      open={visible}
      onCancel={onClose}
      width={520}
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Button onClick={onClose} style={{ minWidth: 90 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleSave} style={{ minWidth: 100 }}>
            Lưu cấu hình
          </Button>
        </div>
      }
    >
      <div style={{ padding: '8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
          <Text type="secondary" style={{ fontSize: typography.fontSize.sm }}>
            Chọn các cột muốn hiển thị trên danh sách ({selectedKeys.length}/{ALL_JOB_COLUMNS.length})
          </Text>
          <Button
            type="link"
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleResetDefault}
            style={{ fontSize: 12, padding: 0 }}
          >
            Đặt lại mặc định
          </Button>
        </div>

        <Divider style={{ margin: '8px 0 16px 0' }} />

        <Row gutter={[16, 14]}>
          {ALL_JOB_COLUMNS.map((col) => {
            const checked = selectedKeys.includes(col.key);
            return (
              <Col span={12} key={col.key}>
                <div
                  onClick={() => handleToggle(col.key)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: radius.md,
                    border: `1px solid ${checked ? colors.primary[500] : colors.border.base}`,
                    backgroundColor: checked ? colors.primary[50] || '#e6f7ff' : colors.bg.container,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Checkbox checked={checked} onChange={() => handleToggle(col.key)} />
                  <Text strong={checked} style={{ fontSize: typography.fontSize.sm, cursor: 'pointer' }}>
                    {col.label}
                  </Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </Modal>
  );
};

export default ColumnConfigModal;
