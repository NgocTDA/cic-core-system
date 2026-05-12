'use client';

import React, { useState } from 'react';
import { Space, Switch, Typography, message, Table, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { ActionMenu, StatusTag, tablePagination } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const MOCK_ROWS = [
    { id: 1, name: 'Job tổng hợp KKN-M5', status: 'ACTIVE',    schedule: '00:00 hàng ngày' },
    { id: 2, name: 'Job kiểm tra dữ liệu', status: 'RUNNING',   schedule: '30 phút/lần' },
    { id: 3, name: 'Job xuất báo cáo',     status: 'SCHEDULED', schedule: '08:00 thứ 2' },
    { id: 4, name: 'Job sync tỷ giá',      status: 'INACTIVE',  schedule: '06:00 hàng ngày' },
];

const ActionMenuDemo: React.FC = () => {
    const [showConfirm, setShowConfirm] = useState(true);
    const [showDisabled, setShowDisabled] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useHeaderActions({ title: 'ActionMenu' }, []);

    const getMenuItems = (record: typeof MOCK_ROWS[0]) => [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => messageApi.info(`Xem chi tiết: ${record.name}`),
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <EditOutlined />,
            disabled: showDisabled && record.status === 'RUNNING',
            onClick: () => messageApi.success(`Chỉnh sửa: ${record.name}`),
        },
        {
            key: 'toggle',
            label: record.status === 'INACTIVE' ? 'Kích hoạt' : 'Vô hiệu hóa',
            icon: record.status === 'INACTIVE' ? <CheckCircleOutlined /> : <StopOutlined />,
            confirm: showConfirm ? {
                title: record.status === 'INACTIVE' ? 'Kích hoạt job này?' : 'Vô hiệu hóa job này?',
                okText: 'Xác nhận',
                cancelText: 'Huỷ',
                onConfirm: () => messageApi.success('Đã cập nhật trạng thái'),
            } : undefined,
            onClick: !showConfirm ? () => messageApi.success('Đã cập nhật trạng thái') : undefined,
        },
        { type: 'divider' as const },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <DeleteOutlined />,
            danger: true,
            confirm: showConfirm ? {
                title: 'Xóa job này?',
                content: 'Hành động này không thể hoàn tác.',
                okText: 'Xóa',
                okType: 'danger' as const,
                cancelText: 'Huỷ',
                onConfirm: () => messageApi.error('Đã xóa'),
            } : undefined,
            onClick: !showConfirm ? () => messageApi.error('Đã xóa') : undefined,
        },
    ];

    const columns = [
        { title: 'STT',      dataIndex: 'id',       key: 'id',       width: 60,  align: 'center' as const },
        { title: 'Tên job',  dataIndex: 'name',     key: 'name',     ellipsis: true },
        { title: 'Lịch',     dataIndex: 'schedule', key: 'schedule', width: 140 },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            align: 'center' as const,
            render: (v: string) => <StatusTag status={v} minWidth={90} />,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            align: 'center' as const,
            fixed: 'right' as const,
            render: (_: unknown, record: typeof MOCK_ROWS[0]) => (
                <ActionMenu items={getMenuItems(record)} />
            ),
        },
    ];

    return (
        <ComponentShowcase
            name="ActionMenu"
            group="data-display"
            description="Dropdown menu cho các hành động trên từng dòng trong bảng. Hỗ trợ confirm dialog, disabled state, danger action, và divider."
            behaviors={[
                'Hiển thị dưới dạng icon (...) — không chiếm không gian trên mỗi dòng',
                'Danger actions (Xóa, Từ chối) hiển thị màu đỏ',
                'Confirm dialog trước khi thực hiện hành động quan trọng',
                'Disabled items khi không đủ điều kiện (ví dụ: không chỉnh sửa job đang chạy)',
                'Divider phân tách nhóm hành động',
                'Luôn đặt ở cột Thao tác cố định (fixed: right)',
            ]}
            wide
            controls={
                <Space direction="vertical" style={{ width: '100%', gap: spacing[3] }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: typography.fontSize.sm }}>Confirm dialog</Text>
                        <Switch checked={showConfirm} onChange={setShowConfirm} size="small" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: typography.fontSize.sm }}>Disabled khi RUNNING</Text>
                        <Switch checked={showDisabled} onChange={setShowDisabled} size="small" />
                    </div>
                </Space>
            }
            code={`import { ActionMenu } from '@/components/ui';

const menuItems = [
  {
    key: 'view',
    label: 'Xem chi tiết',
    icon: <EyeOutlined />,
    onClick: () => router.push(\`/detail/\${record.id}\`),
  },
  {
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteOutlined />,
    danger: true,
    confirm: {
      title: 'Xóa bản ghi này?',
      okText: 'Xóa', okType: 'danger',
      cancelText: 'Huỷ',
      onConfirm: () => handleDelete(record.id),
    },
  },
];

// Trong Table column
{
  title: 'Thao tác',
  key: 'action',
  width: 100,
  align: 'center',
  fixed: 'right',
  render: (_, record) => <ActionMenu items={menuItems} />,
}`}
        >
            {contextHolder}
            <Table
                dataSource={MOCK_ROWS}
                columns={columns}
                rowKey="id"
                size="small"
                pagination={tablePagination({ pageSize: 10 })}
                scroll={{ x: 600 }}
            />
        </ComponentShowcase>
    );
};

export default ActionMenuDemo;
