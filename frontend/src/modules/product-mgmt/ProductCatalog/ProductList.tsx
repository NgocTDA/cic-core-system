'use client';
import React from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import {
  EyeOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, StopOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {
  SectionCard, StatusTag, ActionMenu, CodeText, tablePagination,
} from '@/components/ui';
import {
  PRODUCT_TYPE_OPTIONS,
  PRODUCT_GROUP_OPTIONS,
  SUBJECT_TYPE_OPTIONS,
} from './productTypes';
import type { IProduct } from './productTypes';

// ─── Label helpers ────────────────────────────────────────────

const productTypeLabel = (val: string) =>
  PRODUCT_TYPE_OPTIONS.find((o) => o.value === val)?.label ?? val;

const productGroupLabel = (val: string) =>
  PRODUCT_GROUP_OPTIONS.find((o) => o.value === val)?.label ?? val;

const subjectTypeLabel = (val: string) =>
  SUBJECT_TYPE_OPTIONS.find((o) => o.value === val)?.label ?? val;

// ─── Component ───────────────────────────────────────────────

interface ProductListProps {
  data: IProduct[];
  loading: boolean;
  onDelete: (record: IProduct) => void;
  onToggleStatus: (record: IProduct) => void;
}

const ProductList: React.FC<ProductListProps> = ({ data, loading, onDelete, onToggleStatus }) => {
  const router = useRouter();

  const columns: TableProps<IProduct>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã SP',
      dataIndex: 'code',
      key: 'code',
      width: 90,
      render: (text) => <CodeText>{text}</CodeText>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'productType',
      key: 'productType',
      width: 190,
      render: (val) => productTypeLabel(val),
      ellipsis: true,
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'productGroup',
      key: 'productGroup',
      width: 230,
      render: (val) => productGroupLabel(val),
      ellipsis: true,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'subjectType',
      key: 'subjectType',
      width: 200,
      render: (vals: string[]) => (
        <>
          {vals.map((v) => (
            <Tag key={v} style={{ marginBottom: 2 }}>
              {subjectTypeLabel(v)}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Phiên bản',
      dataIndex: 'version',
      key: 'version',
      width: 90,
      align: 'center',
    },
    {
      title: 'Ngày hiệu lực',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 130,
      align: 'center',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 120,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <ActionMenu
          items={[
            {
              key: 'view',
              label: 'Xem chi tiết',
              icon: <EyeOutlined />,
              onClick: () => router.push(`/product-mgmt/catalog/products/${record.id}`),
            },
            {
              key: 'edit',
              label: 'Chỉnh sửa',
              icon: <EditOutlined />,
              onClick: () => router.push(`/product-mgmt/catalog/products/${record.id}`),
            },
            { type: 'divider' },
            {
              key: 'toggle',
              label: record.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt',
              icon: record.status === 'ACTIVE' ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => onToggleStatus(record),
            },
            {
              key: 'delete',
              label: 'Xóa',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => onDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <SectionCard flex>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="middle"
        loading={loading}
        pagination={tablePagination()}
        scroll={{ x: 1500, y: 'calc(100vh - 400px)' }}
        onRow={(record) => ({
          onDoubleClick: () => router.push(`/product-mgmt/catalog/products/${record.id}`),
          style: { cursor: 'default' },
        })}
      />
    </SectionCard>
  );
};

export default ProductList;
