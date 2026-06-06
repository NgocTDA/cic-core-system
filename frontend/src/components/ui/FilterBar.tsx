import React from 'react';
import { Space, Button, Tooltip, Card } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { shadows, radius } from '../../design-system';

// ─── FilterCol ───────────────────────────────────────────────
// Responsive wrapper for a single filter input inside FilterBar.

interface FilterColProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}

export const FilterCol: React.FC<FilterColProps> = ({
  children,
  minWidth = 160,
  maxWidth,
  style,
}) => (
  <div
    style={{
      flex: `1 1 ${minWidth}px`,
      minWidth,
      ...(maxWidth ? { maxWidth } : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── FilterBar ───────────────────────────────────────────────
// Wraps filter inputs in a flex row with standard action buttons
// (Thêm bộ lọc | Reset | Tìm kiếm) auto-docked to the right.
//
// Usage:
//   <FilterBar onSearch={fn} onReset={fn}>
//     <FilterCol><Input /></FilterCol>
//     <FilterCol><Select /></FilterCol>
//     <FilterCol minWidth={240}><RangePicker /></FilterCol>
//   </FilterBar>
//
// Set inCard={true} to wrap in an Ant Design Card (matches JobFilter / TemplateFilter pattern).

interface FilterBarProps {
  children: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  loading?: boolean;
  inCard?: boolean;
  extra?: React.ReactNode;
  showAddFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onSearch,
  onReset,
  loading,
  inCard = false,
  extra,
  showAddFilter = true,
}) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 16px',
        alignItems: 'center',
      }}
    >
      {children}
      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <Space>
          {extra}
          {showAddFilter && (
            <Tooltip title="Thêm điều kiện lọc nâng cao">
              <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
            </Tooltip>
          )}
          {onReset && (
            <Tooltip title="Xóa tất cả bộ lọc">
              <Button icon={<ReloadOutlined />} onClick={onReset} />
            </Tooltip>
          )}
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
          >
            Tìm kiếm
          </Button>
        </Space>
      </div>
    </div>
  );

  if (inCard) {
    return (
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: radius.lg,
          boxShadow: shadows.xs,
        }}
      >
        {content}
      </Card>
    );
  }

  return <div style={{ marginBottom: 16 }}>{content}</div>;
};

export default FilterBar;
