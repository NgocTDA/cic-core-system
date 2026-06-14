'use client';

import React, { useState } from 'react';
import { Table, Tag, Typography, Button, Space, Popconfirm, message } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import {
  EyeOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  CopyOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { ActionMenu, StatusTag, CodeText, tablePagination } from '@/components/ui';
import { colors } from '@/design-system';
import { useRole, hasPermission } from '@/context/RoleContext';
import type { IJob, UserRole } from './types';

const { Text } = Typography;

interface Props {
  data: IJob[];
  onRowClick: (id: string) => void;
  onRun: (id: string) => void;
  onEdit: (id: string) => void;
  onClone?: (id: string) => void;
  onBulkRun?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const JobList: React.FC<Props> = ({ data, onRowClick, onRun, onEdit, onClone, onBulkRun, onBulkDelete }) => {
  const { currentRole } = useRole();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors: Record<number, string> = {
    1: colors.error.base,
    2: colors.warning.base,
    3: colors.primary[500],
    4: colors.success.base,
    5: colors.neutral[300],
  };

  const handleBulkRun = () => {
    if (onBulkRun) {
      onBulkRun(selectedRowKeys as string[]);
      setSelectedRowKeys([]);
      message.success(`Đã chạy ${selectedRowKeys.length} job`);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    if (onBulkDelete) {
      onBulkDelete(selectedRowKeys as string[]);
      setSelectedRowKeys([]);
      message.success(`Đã xóa ${selectedRowKeys.length} job`);
    }
    setIsDeleting(false);
  };

  const columns: TableProps<IJob>['columns'] = [
    {
      title: 'Mã Job',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (code) => <CodeText>{code}</CodeText>,
    },
    {
      title: 'Tên Job',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      ellipsis: true,
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (category) => {
        const categoryMap: Record<string, string> = {
          DATA_SYNC: 'Đồng bộ',
          REPORT: 'Báo cáo',
          CLEANUP: 'Dọn dẹp',
          VALIDATION: 'Kiểm tra',
          BATCH: 'Xử lý',
        };
        return <Tag color="blue">{categoryMap[category] || category}</Tag>;
      },
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      align: 'center' as const,
      render: (priority: number) => (
        <Tag style={{ backgroundColor: priorityColors[priority], color: '#fff', border: 'none' }}>
          Level {priority}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Lần chạy gần nhất',
      dataIndex: 'schedule',
      key: 'lastRun',
      width: 160,
      render: (_, record) =>
        record.schedule.lastRunTime ? (
          <Text type="secondary" style={{ fontSize: 13 }}>
            {record.schedule.lastRunTime}
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 13 }}>
            Chưa chạy
          </Text>
        ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 80,
      fixed: 'right' as const,
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'Xem chi tiết',
            onClick: () => onRowClick(record.id),
          },
        ];

        if (hasPermission(currentRole, 'run')) {
          items.push({
            key: 'run',
            icon: <PlayCircleOutlined />,
            label: 'Chạy ngay',
            onClick: () => onRun(record.id),
          });
        }

        if (hasPermission(currentRole, 'edit')) {
          items.push({
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Chỉnh sửa',
            onClick: () => onEdit(record.id),
          });

          items.push({
            key: 'clone',
            icon: <CopyOutlined />,
            label: 'Nhân bản',
            onClick: () => onClone?.(record.id),
          });

          items.push({
            key: 'history',
            icon: <HistoryOutlined />,
            label: 'Lịch sử',
            onClick: () => onRowClick(record.id),
          });
        }

        if (hasPermission(currentRole, 'delete')) {
          items.push({
            key: 'divider',
            type: 'divider',
          } as any);

          items.push({
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Xóa',
            danger: true,
            onClick: () => console.log('Delete:', record.id),
          });
        }

        return <ActionMenu items={items} />;
      },
    },
  ];

  const rowSelection: TableProps<IJob>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: !hasPermission(currentRole, 'run') && !hasPermission(currentRole, 'delete'),
    }),
  };

  return (
    <div>
      {selectedRowKeys.length > 0 && hasPermission(currentRole, 'edit') && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            background: colors.bg.subtle,
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text>Đã chọn {selectedRowKeys.length} job</Text>
          <Space>
            {hasPermission(currentRole, 'run') && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleBulkRun}
              >
                Chạy ({selectedRowKeys.length})
              </Button>
            )}
            {hasPermission(currentRole, 'delete') && (
              <Popconfirm
                title="Xóa các job được chọn?"
                description={`Bạn sắp xóa ${selectedRowKeys.length} job. Hành động này không thể hoàn tác.`}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true, loading: isDeleting }}
                onConfirm={handleBulkDelete}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button onClick={() => setSelectedRowKeys([])}>Bỏ chọn</Button>
          </Space>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={tablePagination()}
        scroll={{ x: 1400 }}
        size="middle"
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => onRowClick(record.id),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default JobList;
