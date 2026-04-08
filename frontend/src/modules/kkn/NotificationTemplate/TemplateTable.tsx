import {
  Table,
  Tag,
  Space,
  Button,
  Switch,
  Typography,
  Card,
  Dropdown,
  message
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SendOutlined,
  HistoryOutlined,
  MoreOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import type { INotificationTemplate, TemplateStatus, ChannelType } from './TemplateTypes';

const { Text } = Typography;

interface TemplateTableProps {
  data: INotificationTemplate[];
  onEdit: (template: INotificationTemplate) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: TemplateStatus) => void;
  onDuplicate: (template: INotificationTemplate) => void;
  onView?: (template: INotificationTemplate) => void;
}

const channelColorMap: Record<ChannelType, string> = {
  SMS: 'orange',
  EMAIL: 'blue',
  IN_APP: 'green',
  WEB_PUSH: 'purple',
};

const channelLabelMap: Record<ChannelType, string> = {
  SMS: 'SMS',
  EMAIL: 'Email',
  IN_APP: 'In-app',
  WEB_PUSH: 'Web Push',
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  HIGH: { color: 'red', label: 'Cao' },
  MEDIUM: { color: 'gold', label: 'Trung bình' },
  LOW: { color: 'default', label: 'Thấp' },
};

const TemplateTable: React.FC<TemplateTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onView,
}) => {
  const columns: TableProps<INotificationTemplate>['columns'] = [
    {
      title: 'Mã mẫu',
      dataIndex: 'code',
      key: 'code',
      width: 180,
      render: (text) => (
        <Text strong style={{ color: '#1677ff', fontFamily: 'monospace' }}>{`{{${text}}}`}</Text>
      )
    },
    {
      title: 'Tên mẫu',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Ngôn ngữ',
      dataIndex: 'languages',
      key: 'languages',
      width: 140,
      render: (langs: string[]) => (
        <Space size={[0, 4]} wrap>
          {langs.map(l => (
            <Tag key={l} color="cyan" style={{ textTransform: 'uppercase' }}>{l}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      key: 'group',
      width: 120,
      render: (group) => <Tag color="blue">{group}</Tag>
    },
    {
      title: 'Kênh gửi',
      dataIndex: 'channels',
      key: 'channels',
      width: 200,
      render: (channels: ChannelType[]) => (
        <Space size={[0, 4]} wrap>
          {channels.map(ch => (
            <Tag key={ch} color={channelColorMap[ch]} bordered={false}>
              {channelLabelMap[ch]}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      align: 'center',
      render: (priority: string) => {
        const cfg = priorityConfig[priority] || priorityConfig.LOW;
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      }
    },
    {
      title: 'Phiên bản',
      dataIndex: 'version',
      key: 'version',
      width: 90,
      align: 'center',
      render: (version: string) => (
        <Text type="secondary" style={{ fontFamily: 'monospace' }}>{version}</Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      align: 'left',
      render: (status: TemplateStatus, record) => (
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
                key: 'view',
                label: 'Xem chi tiết',
                icon: <EyeOutlined />,
                onClick: () => onView?.(record)
              },
              {
                key: 'edit',
                label: 'Chỉnh sửa',
                icon: <EditOutlined />,
                onClick: () => onEdit(record)
              },
              {
                key: 'duplicate',
                label: 'Sao chép mẫu',
                icon: <CopyOutlined />,
                onClick: () => onDuplicate(record)
              },
              {
                key: 'test-send',
                label: 'Gửi thử',
                icon: <SendOutlined />,
                onClick: () => message.info('Tính năng gửi thử đang được phát triển')
              },
              {
                key: 'history',
                label: 'Lịch sử phiên bản',
                icon: <HistoryOutlined />,
                onClick: () => message.info(`Xem lịch sử phiên bản: ${record.code}`)
              },
              { type: 'divider' as const },
              {
                key: 'delete',
                label: 'Xóa mẫu',
                icon: <DeleteOutlined />,
                danger: true,
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
        scroll={{ x: 1200 }}
        size="middle"
      />
    </Card>
  );
};

export default TemplateTable;

