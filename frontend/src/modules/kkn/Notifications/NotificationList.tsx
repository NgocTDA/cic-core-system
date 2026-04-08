import React from 'react';
import { Table, Tag, Button, Dropdown } from 'antd';
import type { TableProps } from 'antd';
import { MoreOutlined, EyeOutlined, CheckCircleOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import type { INotification } from './../../../types/notification';

interface Props {
  data: INotification[];
  onRowClick: (record: INotification) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
}

const NotificationList: React.FC<Props> = ({ data, onRowClick, onToggleRead }) => {

  const columns: TableProps<INotification>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã thông báo',
      dataIndex: 'code',
      key: 'code',
      width: 130,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.code.toLowerCase().includes((value as string).toLowerCase()),
      render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      onFilter: (value, record) => record.title.toLowerCase().includes((value as string).toLowerCase()),
      render: (text, record) => (
        <span style={{ fontWeight: record.status === 'UNREAD' ? 600 : 400 }}>
          {text}
        </span>
      )
    },
    {
      title: 'Phân loại',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      filters: [
        { text: 'Hệ thống', value: 'SYSTEM' },
        { text: 'Cảnh báo', value: 'WARNING' },
        { text: 'Nhắc việc', value: 'TASK' },
        { text: 'Khuyến mãi', value: 'PROMOTION' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        const typeMap: Record<string, { color: string, label: string }> = {
          SYSTEM: { color: 'default', label: 'Hệ thống' },
          WARNING: { color: 'warning', label: 'Cảnh báo' },
          TASK: { color: 'processing', label: 'Nhắc việc' },
          PROMOTION: { color: 'success', label: 'Khuyến mãi' }
        };
        const config = typeMap[type] || { color: 'default', label: type };
        return <Tag bordered={false} color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Chưa đọc', value: 'UNREAD' },
        { text: 'Đã đọc', value: 'READ' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        if (status === 'UNREAD') return <Tag color="error">Chưa đọc</Tag>;
        return <Tag color="success">Đã đọc</Tag>;
      }
    },
    {
      title: 'Chờ duyệt',
      dataIndex: 'statusApproval',
      key: 'statusApproval',
      width: 120,
      filters: [
        { text: 'Chờ duyệt', value: 'PENDING' },
        { text: 'Đã duyệt', value: 'APPROVED' },
        { text: 'Từ chối', value: 'REJECTED' },
        { text: 'Không áp dụng', value: 'NOT_APPLICABLE' },
      ],
      onFilter: (value, record) => record.statusApproval === value,
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">Chờ duyệt</Tag>;
        if (status === 'NOT_APPLICABLE') return '-';
        if (status === 'APPROVED') return <Tag color="green">Đã duyệt</Tag>;
        if (status === 'REJECTED') return <Tag color="red">Từ chối</Tag>;
        return <Tag color="default">{status}</Tag>;
      }
    },
    {
      title: 'Thời gian đến',
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      width: 160,
      sorter: (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime(),
    },
    {
      title: 'Người xử lý',
      dataIndex: 'lastProcessor',
      key: 'lastProcessor',
      width: 120,
      onFilter: (value, record) => record.lastProcessor.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 90,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', icon: <EyeOutlined />, label: 'Xem chi tiết', onClick: () => onRowClick(record) },
              {
                key: '2',
                icon: record.status === 'UNREAD' ? <CheckCircleOutlined /> : <UndoOutlined />,
                label: record.status === 'UNREAD' ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc',
                onClick: () => onToggleRead(record.id, record.status === 'UNREAD')
              },
              { key: '3', danger: true, icon: <DeleteOutlined />, label: 'Xóa' },
            ]
          }}
          trigger={['click']}
        >
          <Button shape="circle" icon={<MoreOutlined />} size="small" onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      )
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} bản ghi`
      }}
      size="middle"
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' }
      })}
    />
  );
};

export default NotificationList;

