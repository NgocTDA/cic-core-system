import React from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Switch,
  Tooltip,
  Typography,
  Card,
  Dropdown,
  message
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  LockOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
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
      width: 180,
      render: (text, record) => (
        <Space>
          {record.isInUse && (
            <Tooltip title="Biến đang được sử dụng trong mẫu tin">
              <LockOutlined style={{ color: '#fa8c16' }} />
            </Tooltip>
          )}
          <Text strong style={{ color: '#1677ff', fontFamily: 'monospace' }}>{`{{${text}}}`}</Text>
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
      title: 'Nhóm',
      dataIndex: 'group',
      key: 'group',
      width: 140,
      render: (group) => <Tag color="blue">{group}</Tag>
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
          <Tag
            color={status === 'ACTIVE' ? 'success' : 'default'}
            style={{ minWidth: 100, textAlign: 'center', margin: 0 }}
            bordered={false}
          >
            {status === 'ACTIVE' ? 'Hoạt động' : 'Vô hiệu hóa'}
          </Tag>
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
        <Dropdown
          menu={{
            items: [
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
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  return (
    <Card bordered={false}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} bản ghi`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        scroll={{ x: 900 }}
        size="middle"
      />
    </Card>
  );
};

export default VariableTable;

