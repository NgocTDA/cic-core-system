'use client';

import React, { useState } from 'react';
import { Table, Tooltip, Typography, Tag } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import {
  EyeOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { colors } from '@/design-system';
import { SectionCard, StatusTag, ActionMenu, tablePagination, type IDisplayColumnOption } from '@/components/ui';
import type { IIndustryProduct } from './types';

const { Text } = Typography;

export const INDUSTRY_PRODUCT_COLUMNS: IDisplayColumnOption[] = [
  { key: 'code', label: 'Mã sản phẩm' },
  { key: 'name', label: 'Tên sản phẩm' },
  { key: 'fiscalYear', label: 'Năm tài chính' },
  { key: 'industryCode', label: 'Mã ngành nghề' },
  { key: 'industryName', label: 'Tên ngành nghề' },
  { key: 'createdAt', label: 'Ngày tạo lập' },
  { key: 'createdBy', label: 'Người tạo' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'approvedBy', label: 'Người duyệt' },
  { key: 'approvedAt', label: 'Ngày duyệt' },
];

interface IndustryAnalysisListProps {
  data: IIndustryProduct[];
  loading?: boolean;
  visibleColumns?: string[];
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (keys: React.Key[]) => void;
  onView: (record: IIndustryProduct) => void;
  onSendApproval: (record: IIndustryProduct) => void;
  onApprove: (record: IIndustryProduct) => void;
  onReject: (record: IIndustryProduct) => void;
  onDownload: (record: IIndustryProduct) => void;
  onRecall: (record: IIndustryProduct) => void;
}

const IndustryAnalysisList: React.FC<IndustryAnalysisListProps> = ({
  data,
  loading,
  visibleColumns,
  selectedRowKeys: controlledSelectedKeys,
  onSelectionChange,
  onView,
  onSendApproval,
  onApprove,
  onReject,
  onDownload,
  onRecall,
}) => {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<React.Key[]>([]);
  const selectedRowKeys = controlledSelectedKeys ?? internalSelectedKeys;

  const setSelectedRowKeys = (keys: React.Key[]) => {
    if (onSelectionChange) {
      onSelectionChange(keys);
    } else {
      setInternalSelectedKeys(keys);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const allColumns: TableProps<IIndustryProduct>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      fixed: 'left',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (text) => (
        <Text strong style={{ color: colors.primary[500], whiteSpace: 'nowrap' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      minWidth: 230,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <Text strong style={{ cursor: 'pointer' }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Năm tài chính',
      dataIndex: 'fiscalYear',
      key: 'fiscalYear',
      width: 110,
      align: 'center',
      render: (val) => (
        <Tag color="cyan" style={{ fontWeight: 600, margin: 0 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: 'Mã ngành nghề',
      dataIndex: 'industryCode',
      key: 'industryCode',
      width: 120,
      align: 'center',
      render: (text) => (
        <Text strong style={{ color: colors.neutral[700] }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Tên ngành nghề',
      dataIndex: 'industryName',
      key: 'industryName',
      minWidth: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo lập',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: 'center',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 140,
      render: (_, record) => (
        <Tooltip title={record.creatorFullName} placement="top">
          <span style={{ cursor: 'pointer', color: colors.primary[500], fontWeight: 500, whiteSpace: 'nowrap' }}>
            {record.createdBy}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approvedBy',
      key: 'approvedBy',
      width: 140,
      render: (_, record) =>
        record.approvedBy ? (
          <Tooltip title={record.approverFullName} placement="top">
            <span style={{ cursor: 'pointer', color: colors.success.base, fontWeight: 500, whiteSpace: 'nowrap' }}>
              {record.approvedBy}
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: colors.text.disabled }}>—</span>
        ),
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'approvedAt',
      key: 'approvedAt',
      width: 120,
      align: 'center',
      render: (val) => val || <span style={{ color: colors.text.disabled }}>—</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 75,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const canSendApproval = record.status === 'DRAFT' || record.status === 'REJECTED' || record.status === 'RECALLED';
        const canApprove = record.status === 'PENDING';
        const canReject = record.status === 'PENDING';
        const canRecall = record.status === 'APPROVED' || record.status === 'PENDING';
        const canDownload = !!record.fileName;

        const items: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'Xem chi tiết',
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onView(record);
            },
          },
        ];

        if (canSendApproval) {
          items.push({
            key: 'send_approval',
            icon: <SendOutlined />,
            label: 'Gửi duyệt',
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onSendApproval(record);
            },
          });
        }

        if (canApprove) {
          items.push({
            key: 'approve',
            icon: <CheckCircleOutlined style={{ color: colors.success.base }} />,
            label: 'Phê duyệt',
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onApprove(record);
            },
          });
        }

        if (canReject) {
          items.push({
            key: 'reject',
            icon: <CloseCircleOutlined style={{ color: colors.error.base }} />,
            label: 'Từ chối duyệt',
            danger: true,
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onReject(record);
            },
          });
        }

        if (canDownload) {
          items.push({
            key: 'download',
            icon: <DownloadOutlined />,
            label: 'Tải tệp báo cáo',
            onClick: (info) => {
              info?.domEvent?.stopPropagation();
              onDownload(record);
            },
          });
        }

        if (canRecall) {
          items.push(
            {
              key: 'divider',
              type: 'divider',
            } as any,
            {
              key: 'recall',
              icon: <RollbackOutlined style={{ color: colors.warning.base }} />,
              label: 'Thu hồi báo cáo',
              danger: true,
              onClick: (info) => {
                info?.domEvent?.stopPropagation();
                onRecall(record);
              },
            }
          );
        }

        return <ActionMenu items={items} />;
      },
    },
  ];

  // Filter columns based on visibleKeys (keeping 'stt' and 'action' always visible)
  const columns = allColumns.filter((col) => {
    if (col.key === 'stt' || col.key === 'action') return true;
    return !visibleColumns || visibleColumns.includes(col.key as string);
  });

  const rowSelection: TableProps<IIndustryProduct>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <SectionCard flex>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="middle"
        loading={loading}
        rowSelection={rowSelection}
        pagination={tablePagination({
          current: currentPage,
          pageSize,
          total: data.length,
          showQuickJumper: false,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        })}
        scroll={{ x: 1450, y: 'calc(100vh - 380px)' }}
        onRow={(record) => ({
          onClick: () => onView(record),
          style: { cursor: 'pointer' },
        })}
      />
    </SectionCard>
  );
};

export default IndustryAnalysisList;
