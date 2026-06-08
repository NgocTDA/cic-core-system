'use client';

import React, { useState } from 'react';
import { Button, Switch, Space, Typography, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageLayout, SectionCard, StatusTag, tablePagination } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
import ComponentShowcase from '../../ComponentShowcase';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const MOCK_DATA = Array.from({ length: 25 }, (_, i) => ({
    key: i,
    id: `CIC-${1000 + i}`,
    name: `Khách hàng ${i + 1}`,
    status: ['ACTIVE', 'PENDING', 'APPROVED', 'INACTIVE', 'REJECTED'][i % 5],
}));

const SectionCardDemo: React.FC = () => {
    const [showCount, setShowCount]     = useState(true);
    const [showExtra, setShowExtra]     = useState(true);
    const [noPadding, setNoPadding]     = useState(false);

    useHeaderActions({ title: 'SectionCard' }, []);

    return (
        <ComponentShowcase
            name="SectionCard"
            group="layout"
            description="Card container chuẩn dùng để nhóm nội dung trong một page. Tự động áp dụng boxShadow, borderRadius từ design tokens. Hỗ trợ title, count badge, extra actions, flex stretch."
            behaviors={[
                'title: tiêu đề hiển thị ở header card',
                'count: số lượng item, tự động format với ThousandsSeparator',
                'extra: slot bên phải header (thường là Button hoặc Export)',
                'flex: card stretch để fill không gian còn lại trong PageLayout',
                'noPadding: bỏ body padding (dùng khi Table cần sát cạnh card)',
                'style: có thể truyền marginTop, height… theo nhu cầu',
            ]}
            code={`import { SectionCard } from '@/components/ui';

<SectionCard
  title="Danh sách hồ sơ"
  count={total}
  extra={<Button icon={<PlusOutlined />}>Thêm mới</Button>}
  flex      // stretch trong PageLayout
  noPadding // Table sát cạnh card
>
  <Table ... />
</SectionCard>`}
            controls={
                <Space direction="vertical" style={{ width: '100%' }}>
                    {[
                        { label: 'count', value: showCount, set: setShowCount },
                        { label: 'extra (Button)', value: showExtra, set: setShowExtra },
                        { label: 'noPadding', value: noPadding, set: setNoPadding },
                    ].map(({ label, value, set }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: typography.fontSize.sm }}>{label}</Text>
                            <Switch checked={value} onChange={set} size="small" />
                        </div>
                    ))}
                </Space>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
                {/* Live demo */}
                <SectionCard
                    title="Danh sách hồ sơ tín dụng"
                    count={showCount ? MOCK_DATA.length : undefined}
                    extra={showExtra ? (
                        <Button type="primary" icon={<PlusOutlined />} size="small">Thêm mới</Button>
                    ) : undefined}
                    noPadding={noPadding}
                >
                    <Table
                        dataSource={MOCK_DATA}
                        size="small"
                        pagination={tablePagination({ pageSize: 10 })}
                        columns={[
                            { title: 'Mã CIC', dataIndex: 'id', width: 100 },
                            { title: 'Họ tên', dataIndex: 'name' },
                            { title: 'Trạng thái', dataIndex: 'status', render: (v: string) => (
                                <StatusTag status={v} />
                            )},
                        ]}
                    />
                </SectionCard>

                {/* Props table */}
                <div style={{ background: colors.bg.subtle, borderRadius: radius.lg, padding: spacing[4] }}>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, display: 'block', marginBottom: spacing[2] }}>Props</Text>
                    {[
                        { prop: 'title?', type: 'string', desc: 'Tiêu đề card header' },
                        { prop: 'count?', type: 'number | string', desc: 'Badge số lượng bên cạnh title' },
                        { prop: 'extra?', type: 'ReactNode', desc: 'Actions ở góc phải header' },
                        { prop: 'flex?', type: 'boolean', desc: 'Stretch card để fill flex container' },
                        { prop: 'noPadding?', type: 'boolean', desc: 'Bỏ body padding' },
                        { prop: 'style?', type: 'CSSProperties', desc: 'CSS override (marginTop, height…)' },
                    ].map(({ prop, type, desc }) => (
                        <div key={prop} style={{ display: 'flex', gap: spacing[3], alignItems: 'baseline', marginBottom: spacing[1] }}>
                            <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.primary[500], minWidth: 110 }}>{prop}</code>
                            <code style={{ fontSize: 11, fontFamily: typography.fontFamily.mono, color: colors.text.tertiary, minWidth: 120 }}>{type}</code>
                            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>{desc}</Text>
                        </div>
                    ))}
                </div>
            </div>
        </ComponentShowcase>
    );
};

export default SectionCardDemo;
