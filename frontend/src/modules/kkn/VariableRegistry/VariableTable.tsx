import React from 'react';
import {
  Table,
  Tag,
  Space,
  Switch,
  Tooltip,
  Typography,
  message
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import { ActionMenu, CodeText, SectionCard, StatusTag, tablePagination } from '@/components/ui';
import { colors } from '@/design-system';
import type { IVariable, VariableStatus } from './VariableTypes';

const { Text } = Typography;

interface VariableTableProps {
  data: IVariable[];
  onEdit: (variable: IVariable) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: VariableStatus) => void;
  onDuplicate: (variable: IVariable) => void;
}

const VariableTable: React.FC<VariableTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const columns: TableProps<IVariable>['columns'] = [
    {
      title: 'Mã biến',
      dataIndex: 'code',
      key: 'code',
      width: 250,
      render: (text, record) => (
        <Space>
          {record.isInUse && (
            <Tooltip title="Biến đang được sử dụng trong mẫu tin">
              <LockOutlined style={{ color: colors.subsystem.kkn }} />
            </Tooltip>
          )}
          <CodeText template>{text}</CodeText>
        </Space>
      )
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 200,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type) => <Tag color="geekblue">{type}</Tag>
    },
    {
      title: 'Giá trị mẫu',
      dataIndex: 'sampleValue',
      key: 'sampleValue',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text type="secondary" style={{ fontFamily: 'monospace' }}>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      align: 'left',
      render: (status, record) => (
        <Space size="middle">
          <StatusTag status={status} minWidth={100} />
          <Switch
            checked={status === 'ACTIVE'}
            onChange={() => onToggleStatus(record.id, status)}
            size="small"
          />
        </Space>
      )
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
              key: 'preview',
              label: 'Xem giá trị mẫu',
              icon: <EyeOutlined />,
              onClick: () => message.info(`${record.displayName}: ${record.sampleValue}`)
            },
            {
              key: 'edit',
              label: 'Chỉnh sửa',
              icon: <EditOutlined />,
              onClick: () => onEdit(record)
            },
            {
              key: 'duplicate',
              label: 'Sao chép biến',
              icon: <CopyOutlined />,
              onClick: () => onDuplicate(record)
            },
            { type: 'divider' },
            {
              key: 'delete',
              label: 'Xóa biến',
              icon: <DeleteOutlined />,
              danger: true,
              disabled: record.isInUse,
              onClick: () => onDelete(record.id)
            },
          ]}
        />
      )
    }
  ];

  return (
    <SectionCard title="Danh mục biến" count={data.length}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={tablePagination({ pageSize: 10 })}
        scroll={{ x: 900 }}
        size="middle"
      />
    </SectionCard>
  );
};

export default VariableTable;

