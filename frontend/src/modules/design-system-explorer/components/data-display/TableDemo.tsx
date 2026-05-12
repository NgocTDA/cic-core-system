'use client';

import React, { useState } from 'react';
import { Table, Switch, Space, Typography, Tag, Skeleton, Tooltip, Empty, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ComponentShowcase from '../../ComponentShowcase';
import { StatusTag, ActionMenu, tablePagination, SectionCard, StatusSummaryBar } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

interface JobRow {
    id: number;
    name: string;
    status: string;
    createdBy: string;
    createdByFull: string;
    createdAt: string;
    amount: number;
}

const generateData = (n: number): JobRow[] =>
    Array.from({ length: n }, (_, i) => ({
        id:           i + 1,
        name:         ['Job tổng hợp KKN-M5', 'Job kiểm tra dữ liệu', 'Job xuất báo cáo', 'Job sync tỷ giá', 'Job phân tích XHTD'][i % 5] + ` #${i + 1}`,
        status:       ['ACTIVE', 'RUNNING', 'SCHEDULED', 'FAILED', 'INACTIVE'][i % 5],
        createdBy:    ['nguyenvana', 'tranthib', 'lethic', 'phamvand'][i % 4],
        createdByFull: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Thị C', 'Phạm Văn D'][i % 4],
        createdAt:    `${String(15 + (i % 10)).padStart(2, '0')}/03/2025`,
        amount:       Math.round(1000000 + Math.random() * 999000000),
    }));

const ALL_DATA = generateData(45);

const TableDemo: React.FC = () => {
    const [loading,     setLoading]     = useState(false);
    const [empty,       setEmpty]       = useState(false);
    const [selected,    setSelected]    = useState<React.Key[]>([]);
    const [showSummary, setShowSummary] = useState(true);

    useHeaderActions({ title: 'Table & Pagination' }, []);

    const data = empty ? [] : ALL_DATA;

    const summaryItems = [
        { count: ALL_DATA.filter(r => r.status === 'FAILED').length,    label: 'Lỗi',         color: 'error'   as const },
        { count: ALL_DATA.filter(r => r.status === 'SCHEDULED').length, label: 'Đã đặt lịch', color: 'warning' as const },
        { count: ALL_DATA.filter(r => r.status === 'RUNNING').length,   label: 'Đang chạy',   color: 'info'    as const },
        { count: ALL_DATA.filter(r => r.status === 'ACTIVE').length,    label: 'Hoạt động',   color: 'success' as const },
    ];

    const columns: ColumnsType<JobRow> = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
            fixed: 'left',
        },
        {
            title: 'Tên job',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            filteredValue: null,
            onFilter: () => true,
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 130,
            render: (v: string, row: JobRow) => (
                <Tooltip title={row.createdByFull} mouseEnterDelay={0.3}>
                    <Text style={{ fontSize: typography.fontSize.sm, cursor: 'default' }}>{v}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            align: 'center',
            render: (v: string) => (
                <Tooltip title={`${v} 08:30:00`} mouseEnterDelay={0.3}>
                    <Text style={{ fontSize: typography.fontSize.sm, cursor: 'default' }}>{v}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Giá trị (VNĐ)',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            align: 'right',
            render: (v: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {v.toLocaleString('vi-VN')}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            align: 'center',
            render: (v: string) => <StatusTag status={v} minWidth={90} />,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 80,
            align: 'center',
            fixed: 'right',
            render: () => (
                <ActionMenu
                    items={[
                        { key: 'view',   label: 'Xem chi tiết', onClick: () => {} },
                        { key: 'edit',   label: 'Chỉnh sửa',   onClick: () => {} },
                        { type: 'divider' },
                        { key: 'delete', label: 'Xóa', danger: true, confirm: { title: 'Xóa bản ghi?', okText: 'Xóa', okType: 'danger', cancelText: 'Huỷ', onConfirm: () => {} } },
                    ]}
                />
            ),
        },
    ];

    return (
        <ComponentShowcase
            name="Table & Pagination"
            group="data-display"
            description="Bảng dữ liệu chuẩn với đầy đủ quy tắc: skeleton loading, empty state, sticky header, column filter, batch action, phân trang."
            behaviors={[
                'Skeleton loading khi đang tải dữ liệu',
                'Empty state "Không có dữ liệu" với icon khi không có kết quả',
                'Sticky header khi scroll dọc trong bảng',
                'Date column: hover hiển thị full datetime (hh:mm:ss)',
                'User column: hover hiển thị họ tên đầy đủ',
                'Số tiền/số lượng: căn phải, format dấu . phân nghìn',
                'Text: căn trái | Ngày/STT/Thao tác: căn giữa',
                'Cột STT và Thao tác cố định (sticky left/right)',
                'Batch action bar hiển thị khi chọn ít nhất 1 dòng',
                'Phân trang: options 20/30/40/50/80/100, hiển thị tổng bản ghi',
            ]}
            wide
            demoMinHeight={400}
            controls={
                <Space direction="vertical" style={{ width: '100%', gap: spacing[3] }}>
                    {[
                        { label: 'Loading state',    checked: loading,     onChange: setLoading },
                        { label: 'Empty data',       checked: empty,       onChange: setEmpty },
                        { label: 'StatusSummaryBar', checked: showSummary, onChange: setShowSummary },
                    ].map((ctrl) => (
                        <div key={ctrl.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: typography.fontSize.sm }}>{ctrl.label}</Text>
                            <Switch checked={ctrl.checked} onChange={ctrl.onChange} size="small" />
                        </div>
                    ))}
                </Space>
            }
            code={`import { Table } from 'antd';
import { StatusTag, ActionMenu, tablePagination, StatusSummaryBar } from '@/components/ui';

// Căn lề cột theo quy tắc
const columns: ColumnsType<T> = [
  { title: 'STT',     dataIndex: 'id',   width: 60,  align: 'center', fixed: 'left' },
  { title: 'Tên',     dataIndex: 'name', ellipsis: true },
  { title: 'Ngày tạo', dataIndex: 'date', width: 120, align: 'center',
    render: (v) => <Tooltip title={\`\${v} HH:mm:ss\`}>{v}</Tooltip> },
  { title: 'Số tiền', dataIndex: 'amount', width: 150, align: 'right',
    render: (v) => v.toLocaleString('vi-VN') },
  { title: 'Trạng thái', dataIndex: 'status', align: 'center',
    render: (v) => <StatusTag status={v} minWidth={90} /> },
  { title: 'Thao tác', key: 'action', fixed: 'right', align: 'center',
    render: (_, row) => <ActionMenu items={...} /> },
];

<SectionCard title="Danh sách" count={total} flex>
  <StatusSummaryBar items={summaryItems} />
  <Table
    dataSource={data}
    columns={columns}
    rowKey="id"
    loading={loading}
    pagination={tablePagination()}
    scroll={{ x: 900, y: 400 }}
    rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
  />
</SectionCard>`}
        >
            <SectionCard title="Danh sách job" count={data.length} flex>
                {showSummary && <StatusSummaryBar items={summaryItems} />}

                {selected.length > 0 && (
                    <div
                        style={{
                            background: colors.primary[50],
                            border: `1px solid ${colors.primary[200]}`,
                            borderRadius: 6,
                            padding: `${spacing[2]} ${spacing[4]}`,
                            marginBottom: spacing[3],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ color: colors.primary[600], fontSize: typography.fontSize.sm }}>
                            Đã chọn <strong>{selected.length}</strong> bản ghi
                        </Text>
                        <Space>
                            <Tag style={{ cursor: 'pointer', color: colors.error.base }}>Xóa đã chọn</Tag>
                            <Tag style={{ cursor: 'pointer', color: colors.text.secondary }} onClick={() => setSelected([])}>Bỏ chọn</Tag>
                        </Space>
                    </div>
                )}

                {loading ? (
                    <Skeleton active paragraph={{ rows: 8 }} />
                ) : (
                    <Table<JobRow>
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        size="small"
                        scroll={{ x: 900, y: 320 }}
                        pagination={tablePagination({ pageSize: 20, pageSizeOptions: ['20', '30', '40', '50', '80', '100'] })}
                        rowSelection={{
                            selectedRowKeys: selected,
                            onChange: setSelected,
                        }}
                        locale={{ emptyText: <Empty description="Không có dữ liệu" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                    />
                )}
            </SectionCard>
        </ComponentShowcase>
    );
};

export default TableDemo;
