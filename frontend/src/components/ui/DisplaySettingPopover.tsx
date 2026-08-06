'use client';

import React, { useState } from 'react';
import { Popover, Button, Input, Checkbox, Typography } from 'antd';
import {
  FilterOutlined,
  SearchOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import { colors, typography } from '@/design-system';

const { Text } = Typography;

export interface IDisplayColumnOption {
  key: string;
  label: string;
}

interface DisplaySettingPopoverProps {
  columns: IDisplayColumnOption[];
  visibleKeys: string[];
  onChange: (keys: string[]) => void;
  buttonText?: string;
  style?: React.CSSProperties;
}

export const DisplaySettingPopover: React.FC<DisplaySettingPopoverProps> = ({
  columns,
  visibleKeys,
  onChange,
  buttonText = 'Cài đặt hiển thị',
  style,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filteredColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (key: string) => {
    if (visibleKeys.includes(key)) {
      if (visibleKeys.length <= 1) return; // Keep at least 1
      onChange(visibleKeys.filter((k) => k !== key));
    } else {
      onChange([...visibleKeys, key]);
    }
  };

  const handleSelectAll = () => {
    onChange(columns.map((c) => c.key));
  };

  const handleUncheckAll = () => {
    // Keep first column if unchecking all
    if (columns.length > 0) {
      onChange([columns[0].key]);
    } else {
      onChange([]);
    }
  };

  const content = (
    <div style={{ width: 260, padding: '4px 0' }}>
      <Text strong style={{ fontSize: typography.fontSize.base, display: 'block', marginBottom: 10, color: colors.text.primary }}>
        Cài đặt hiển thị
      </Text>

      <Input
        placeholder="Tìm kiếm trường thông tin"
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        allowClear
        size="small"
        style={{ marginBottom: 12 }}
      />

      <div
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 12,
          paddingRight: 4,
        }}
      >
        {filteredColumns.map((col) => {
          const checked = visibleKeys.includes(col.key);
          return (
            <div key={col.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HolderOutlined style={{ color: '#bfbfbf', fontSize: 13, cursor: 'grab' }} />
              <Checkbox
                checked={checked}
                onChange={() => handleToggle(col.key)}
                style={{ fontSize: typography.fontSize.sm }}
              >
                {col.label}
              </Checkbox>
            </div>
          );
        })}
        {filteredColumns.length === 0 && (
          <Text type="secondary" style={{ fontSize: 12, textAlign: 'center', padding: '8px 0' }}>
            Không tìm thấy trường thông tin
          </Text>
        )}
      </div>

      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
        Đã chọn {visibleKeys.length}/{columns.length}
      </Text>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: `1px solid ${colors.border.split}` }}>
        <Button
          type="link"
          size="small"
          onClick={handleUncheckAll}
          style={{ padding: 0, fontSize: 13, color: colors.primary[500] }}
        >
          Bỏ chọn
        </Button>
        <Button
          type="link"
          size="small"
          onClick={handleSelectAll}
          style={{ padding: 0, fontSize: 13, color: colors.primary[500] }}
        >
          Chọn tất cả
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        icon={<FilterOutlined style={{ color: colors.primary[500] }} />}
        style={style}
      >
        {buttonText}
      </Button>
    </Popover>
  );
};
