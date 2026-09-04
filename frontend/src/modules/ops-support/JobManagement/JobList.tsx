'use client';

import React, { useState } from 'react';
import { Table, Typography, Button, Space, Popconfirm, message, Tooltip } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import {
  EyeOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  HistoryOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { ActionMenu, StatusTag, CodeText, tablePagination, SectionCard } from '@/components/ui';
import { colors, typography } from '@/design-system';
import { useRole, hasPermission } from '@/context/RoleContext';
import type { IJob } from './types';
import { getCronDescription } from './cronUtils';

const { Text } = Typography;

interface Props {
  data: IJob[];
  visibleColumns?: string[];
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (keys: React.Key[]) => void;
  onRowClick: (id: string) => void;
  onRun: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus?: (job: IJob) => void;
  onViewHistory?: (job: IJob) => void;
  onBulkRun?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const categoryMap: Record<string, string> = {
  DATA_SYNC: 'Đồng bộ dữ liệu',
  REPORT: 'Sinh báo cáo',
  CLEANUP: 'Dọn dẹp & Lưu trữ',
  VALIDATION: 'Kiểm tra & Đối soát',
  BATCH: 'Xử lý lô',
  SPRING_BEAN: 'Spring Component',
  REST_API: 'REST API',
  SQL_SCRIPT: 'SQL Stored Procedure',
};

const triggerTypeMap: Record<string, string> = {
  SCHEDULER: 'Bộ lập lịch',
  EVENT: 'Theo sự kiện',
  MANUAL: 'Thủ công',
};

const JobList: React.FC<Props> = ({
  data,
  visibleColumns,
  selectedRowKeys: controlledSelectedKeys,
  onSelectionChange,
  onRowClick,
  onRun,
  onEdit,
  onToggleStatus,
  onViewHistory,
  onBulkRun,
  onBulkDelete,
}) => {
  const { currentRole } = useRole();
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<React.Key[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedRowKeys = controlledSelectedKeys ?? internalSelectedKeys;
  const setSelectedRowKeys = (keys: React.Key[]) => {
    if (onSelectionChange) {
      onSelectionChange(keys);
    } else {
      setInternalSelectedKeys(keys);
    }
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
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center' as const,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã Job',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code) => (
        <Text code strong style={{ color: '#000000', fontSize: typography.fontSize.base }}>
          {code}
        </Text>
      ),
    },
    {
      title: 'Tên Job',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      ellipsis: true,
      render: (name) => <Text strong style={{ fontSize: typography.fontSize.base }}>{name}</Text>,
    },
    {
      title: 'Mã dịch vụ',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 170,
      render: (serviceCode) => (
        <Text code style={{ color: '#000000', fontSize: typography.fontSize.base }}>
          {serviceCode || 'SVC_CIC_CORE_SYNC'}
        </Text>
      ),
    },
    {
      title: 'Loại Job',
      dataIndex: 'category',
      key: 'category',
      width: 170,
      filters: [
        { text: 'Đồng bộ dữ liệu', value: 'DATA_SYNC' },
        { text: 'Sinh báo cáo', value: 'REPORT' },
        { text: 'Dọn dẹp & Lưu trữ', value: 'CLEANUP' },
        { text: 'Kiểm tra & Đối soát', value: 'VALIDATION' },
        { text: 'Xử lý lô', value: 'BATCH' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => (
        <Text style={{ fontSize: typography.fontSize.base }}>
          {categoryMap[category] || category}
        </Text>
      ),
    },
    {
      title: 'Điều kiện kích hoạt',
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: 175,
      filters: [
        { text: 'Bộ lập lịch', value: 'SCHEDULER' },
        { text: 'Theo sự kiện', value: 'EVENT' },
        { text: 'Thủ công', value: 'MANUAL' },
      ],
      onFilter: (value, record) => (record.triggerType || 'SCHEDULER') === value,
      render: (triggerType) => (
        <Text style={{ fontSize: typography.fontSize.base }}>
          {triggerTypeMap[triggerType || 'SCHEDULER'] || 'Bộ lập lịch'}
        </Text>
      ),
    },
    {
      title: 'Biểu thức Cron',
      dataIndex: 'cron',
      key: 'cron',
      width: 140,
      render: (cron, record) => {
        const cronExpr = cron || record.schedule?.expression || '0 0 1 * * *';
        const description = getCronDescription(cronExpr);
        return (
          <Tooltip title={`💡 Diễn giải: ${description}`} mouseEnterDelay={0.15}>
            <code
              style={{
                fontFamily: typography.fontFamily.mono,
                fontWeight: 'bold',
                fontSize: typography.fontSize.base,
                color: '#000000',
                background: colors.neutral[100],
                padding: '2px 6px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {cronExpr}
            </code>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      filters: [
        { text: 'Hoạt động', value: 'ACTIVE' },
        { text: 'Ngừng hoạt động', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <StatusTag status={status} />,
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
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onRowClick(record.id);
            },
          },
        ];

        if (hasPermission(currentRole, 'edit')) {
          items.push({
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Chỉnh sửa',
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onEdit(record.id);
            },
          });
        }

        if (hasPermission(currentRole, 'run')) {
          items.push({
            key: 'run',
            icon: <PlayCircleOutlined />,
            label: 'Chạy ngay',
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onRun(record.id);
            },
          });
        }

        if (hasPermission(currentRole, 'edit')) {
          if (record.status === 'ACTIVE') {
            items.push({
              key: 'deactivate',
              icon: <PoweroffOutlined />,
              label: 'Vô hiệu hóa',
              onClick: (info) => {
                info?.domEvent?.stopPropagation();
                if (onToggleStatus) {
                  onToggleStatus(record);
                } else {
                  message.success(`Đã vô hiệu hóa Job ${record.code}`);
                }
              },
            });
          } else {
            items.push({
              key: 'activate',
              icon: <PoweroffOutlined />,
              label: 'Kích hoạt',
              onClick: (info) => {
                info?.domEvent?.stopPropagation();
                if (onToggleStatus) {
                  onToggleStatus(record);
                } else {
                  message.success(`Đã kích hoạt Job ${record.code}`);
                }
              },
            });
          }
        }

        items.push({
          key: 'history',
          icon: <HistoryOutlined />,
          label: 'Lịch sử chạy Job',
          onClick: (info) => {
            info?.domEvent?.stopPropagation();
            if (onViewHistory) onViewHistory(record);
          },
        });

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
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              message.success(`Đã xóa Job ${record.code}`);
            },
          });
        }

        return <ActionMenu items={items} />;
      },
    },
  ];

  const filteredColumns = visibleColumns
    ? columns.filter((col) => !col.key || col.key === 'action' || visibleColumns.includes(col.key as string))
    : columns;

  const rowSelection: TableProps<IJob>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: !hasPermission(currentRole, 'run') && !hasPermission(currentRole, 'delete'),
    }),
  };

  return (
    <SectionCard title="Danh sách tác vụ" count={data.length} flex>
      <Table
        columns={filteredColumns}
        dataSource={data}
        rowKey="id"
        pagination={tablePagination({ total: data.length })}
        scroll={{ x: 1200 }}
        size="middle"
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => onRowClick(record.id),
          style: { cursor: 'pointer' },
        })}
      />
    </SectionCard>
  );
};

export default JobList;
