
import React from 'react';
import { Table, Tag, Button, Dropdown, Typography, Space, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { 
  MoreOutlined, 
  EyeOutlined, 
  PlayCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { Job } from './mockData';

const { Text } = Typography;

interface Props {
  data: Job[];
  onRowClick: (record: Job) => void;
  onRun: (id: string) => void;
  onEdit: (record: Job) => void;
}

const JobList: React.FC<Props> = ({ data, onRowClick, onRun, onEdit }) => {

  const columns: TableProps<Job>['columns'] = [
    {
      title: 'Mã Job',
      dataIndex: 'id',
      key: 'id',
      width: 130,
      render: (text) => (
        <Text strong style={{ color: '#1677ff', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
            {text}
        </Text>
      )
    },
    {
      title: 'Tên Job nghiệp vụ',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      ellipsis: true,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Hệ thống',
      dataIndex: 'system',
      key: 'system',
      width: 140,
      render: (system) => <Tag color="blue" bordered={false}>{system}</Tag>
    },
    {
      title: 'Phân loại',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      align: 'center',
      render: (priority) => (
        <Tag color={priority === 'High' ? 'red' : priority === 'Medium' ? 'gold' : 'default'} style={{ margin: 0 }}>
          {priority}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status) => {
        const statusMap: Record<string, { color: string, label: string }> = {
          RUNNING: { color: 'processing', label: 'Đang chạy' },
          IDLE: { color: 'default', label: 'Chờ (Idle)' },
          SCHEDULED: { color: 'warning', label: 'Đã đặt lịch' },
          FAILED: { color: 'error', label: 'Lỗi' },
        };
        const config = statusMap[status] || { color: 'default', label: status };
        return (
          <Tag color={config.color} bordered={false} style={{ minWidth: 90, textAlign: 'center', fontWeight: 500 }}>
            {config.label.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Phát kỳ gần nhất',
      dataIndex: 'lastRun',
      key: 'lastRun',
      width: 160,
      render: (text) => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text>
    },
    {
        title: 'Thao tác',
        key: 'action',
        align: 'center',
        width: 80,
        fixed: 'right',
        render: (_, record) => (
          <Dropdown
            menu={{
              items: [
                { 
                  key: 'view', 
                  icon: <EyeOutlined />, 
                  label: 'Giám sát chi tiết', 
                  onClick: () => onRowClick(record) 
                },
                { 
                  key: 'run', 
                  icon: <PlayCircleOutlined />, 
                  label: 'Kích hoạt chạy ngay', 
                  onClick: () => onRun(record.id) 
                },
                { 
                  key: 'edit', 
                  icon: <EditOutlined />, 
                  label: 'Chỉnh sửa cấu hình', 
                  onClick: () => onEdit(record) 
                },
                { 
                  key: 'history', 
                  icon: <HistoryOutlined />, 
                  label: 'Lịch sử vận hành', 
                  onClick: () => message.info(`Lịch sử: ${record.id}`)
                },
                { type: 'divider' },
                { 
                  key: 'delete', 
                  danger: true, 
                  icon: <DeleteOutlined />, 
                  label: 'Gỡ bỏ Job' 
                },
              ]
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        )
      },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} bản ghi`,
        pageSizeOptions: ['10', '20', '50']
      }}
      scroll={{ x: 1200 }}
      size="middle"
      onRow={(record) => ({
        onClick: () => onRowClick(record),
      })}
    />
  );
};

export default JobList;
