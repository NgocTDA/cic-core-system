import React from 'react';
import { Space, Button, Tooltip, Card } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { colors, shadows, radius } from '../../design-system';

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
// Set inCard={true} hoặc variant="context" để áp dụng phong cách Context Banner (#edf3ed).
// Set variant="card" để dùng thẻ Card trắng truyền thống.

interface FilterBarProps {
  children: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  loading?: boolean;
  inCard?: boolean;
  variant?: 'context' | 'card' | 'plain';
  title?: React.ReactNode;
  note?: React.ReactNode;
  extra?: React.ReactNode;
  showAddFilter?: boolean;
  style?: React.CSSProperties;
}

const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onSearch,
  onReset,
  loading,
  inCard = false,
  variant,
  title,
  note,
  extra,
  showAddFilter = true,
  style,
}) => {
  // Mặc định inCard sẽ sử dụng phong cách Context Banner (#edf3ed) thanh lịch, gọn gàng
  const isContext = variant === 'context' || (inCard && variant !== 'card');
  const isCard = variant === 'card';

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
              <Button
                icon={<FilterOutlined />}
                style={isContext ? { background: '#ffffff', borderColor: '#9fb3a9' } : undefined}
              >
                Thêm bộ lọc
              </Button>
            </Tooltip>
          )}
          {onReset && (
            <Tooltip title="Xóa tất cả bộ lọc">
              <Button
                icon={<ReloadOutlined />}
                onClick={onReset}
                style={isContext ? { background: '#ffffff', borderColor: '#9fb3a9' } : undefined}
              />
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

  if (isContext) {
    return (
      <div
        style={{
          background: colors.bg.context,
          border: `1px solid ${colors.border.base}`,
          borderRadius: radius.md,
          padding: '14px 20px',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: title || note ? 8 : 0,
          ...style,
        }}
      >
        {title && (
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: colors.text.primary,
            }}
          >
            {title}
          </div>
        )}
        {content}
        {note && (
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: colors.text.secondary,
            }}
          >
            {note}
          </div>
        )}
      </div>
    );
  }

  if (isCard) {
    return (
      <Card
        style={{
          marginBottom: 16,
          borderRadius: radius.lg,
          boxShadow: shadows.xs,
          border: `1px solid ${colors.border.base}`,
          background: colors.bg.container,
          ...style,
        }}
      >
        {content}
      </Card>
    );
  }

  return <div style={{ marginBottom: 16, ...style }}>{content}</div>;
};

export default FilterBar;
