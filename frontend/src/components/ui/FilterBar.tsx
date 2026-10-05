import React from 'react';
import { Space, Button, Tooltip, Card } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

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
  onAddFilter?: () => void;
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
  onAddFilter,
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
          {showAddFilter && onAddFilter && (
            <Tooltip title="Thêm điều kiện lọc nâng cao">
              <Button
                icon={<FilterOutlined />}
                onClick={onAddFilter}
                style={isContext ? { background: 'var(--surface)', borderColor: 'var(--border-input)' } : undefined}
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
                style={isContext ? { background: 'var(--surface)', borderColor: 'var(--border-input)' } : undefined}
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
          background: 'var(--surface-sunken)',
          border: `1px solid var(--border)`,
          borderRadius: 'var(--radius-md)',
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
              color: 'var(--text)',
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
              color: 'var(--text-muted)',
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
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-1)',
          border: `1px solid var(--border)`,
          background: 'var(--surface)',
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
