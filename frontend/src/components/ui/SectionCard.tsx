import React from 'react';
import { Card, Space, Typography } from 'antd';
import { colors, shadows, radius } from '../../design-system';

const { Text } = Typography;

// ─── SectionCard ─────────────────────────────────────────────
// Standard card wrapper for data-table sections.
//
// flex=true → card stretches to fill remaining vertical space
// (use inside a PageLayout for full-height table pages).
//
// Usage:
//   <SectionCard title="Danh sách" count={total} extra={<Button />} flex>
//     <Table ... />
//   </SectionCard>

interface SectionCardProps {
  title?: string;
  count?: number | string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  flex?: boolean;
  noPadding?: boolean;
  style?: React.CSSProperties;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  count,
  extra,
  children,
  flex,
  noPadding,
  style,
}) => {
  const hasHeader = !!(title || extra);

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: radius.lg,
        boxShadow: shadows.xs,
        ...(flex
          ? {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: 0,
            }
          : {}),
        ...style,
      }}
      styles={{
        body: {
          padding: noPadding ? 0 : '0 20px 20px',
          ...(flex
            ? {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0,
              }
            : {}),
        },
        ...(hasHeader
          ? { header: { borderBottom: 'none', padding: '16px 20px 0' } }
          : {}),
      }}
      title={
        title ? (
          <Space size="small">
            <Text
              strong
              style={{ fontSize: 13, color: colors.text.secondary }}
            >
              {title.toUpperCase()}
              {count !== undefined && ` (${count})`}
            </Text>
          </Space>
        ) : undefined
      }
      extra={extra}
    >
      {children}
    </Card>
  );
};

export default SectionCard;
