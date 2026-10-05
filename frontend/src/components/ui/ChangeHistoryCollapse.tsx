'use client';

import React, { useState } from 'react';
import { Collapse, Table, Typography, Tooltip, Tag, Space, Button } from 'antd';
import type { TableProps } from 'antd';
import {
  HistoryOutlined,
  UserOutlined,
  PaperClipOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export interface IChangeHistoryItem {
  id: string;
  timestamp: string; // ISO date string
  dateStr?: string;
  fullTimeStr?: string;
  updatedBy: string;
  updatedByFullName?: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  description?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

interface ChangeHistoryCollapseProps {
  data?: IChangeHistoryItem[];
  defaultActive?: boolean;
  style?: React.CSSProperties;
}

// Sub-component to render Description with "Xem tiếp" toggle and file link
const ExpandableDescription: React.FC<{ item: IChangeHistoryItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const text = item.description || '';
  const isLong = text.length > 60;

  return (
    <div style={{ fontSize: '11px' }}>
      <div>
        <span>
          {isLong && !expanded ? `${text.slice(0, 60)}...` : text}
        </span>
        {isLong && (
          <Button
            type="link"
            size="small"
            style={{ padding: '0 0 0 4px', fontSize: 11, height: 'auto' }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <>Thu gọn <UpOutlined style={{ fontSize: 9 }} /></> : <>Xem tiếp <DownOutlined style={{ fontSize: 9 }} /></>}
          </Button>
        )}
      </div>

      {item.attachmentUrl && (
        <div style={{ marginTop: 4 }}>
          <a
            href={item.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <PaperClipOutlined />
            <span>{item.attachmentName || 'Tệp đính kèm'}</span>
          </a>
        </div>
      )}
    </div>
  );
};

export const ChangeHistoryCollapse: React.FC<ChangeHistoryCollapseProps> = ({
  data = [],
  defaultActive = false,
  style,
}) => {
  // Sort newest first & limit to 20 records
  const displayData = [...data]
    .sort((a, b) => (Date.parse(b.timestamp) || 0) - (Date.parse(a.timestamp) || 0))
    .slice(0, 20);

  const columns: TableProps<IChangeHistoryItem>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Thời gian',
      key: 'timestamp',
      width: 170,
      align: 'center',
      render: (_, record) => {
        const dateObj = new Date(record.timestamp);
        if (!record.timestamp || Number.isNaN(dateObj.getTime())) return <Text type="secondary">—</Text>;
        const dateStr =
          record.dateStr ||
          dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const fullStr =
          record.fullTimeStr ||
          `${dateStr} ${dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

        return (
          <Tooltip title={fullStr} placement="top">
            <span style={{ fontSize: '11px' }}>
              {dateStr}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      key: 'updatedBy',
      width: 160,
      render: (_, record) => (
        <Tooltip title={record.updatedByFullName || record.updatedBy} placement="top">
          <Space size={4}>
            <UserOutlined style={{ color: 'var(--primary)', fontSize: 12 }} />
            <Text style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{record.updatedBy || '—'}</Text>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      render: (action: string) => (
        <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Giá trị cũ',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 220,
      render: (val?: string) =>
        val ? (
          <Text style={{ fontSize: '11px', color: 'var(--color-neutral-700)' }}>
            {val}
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: '11px' }}>—</Text>
        ),
    },
    {
      title: 'Giá trị mới',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 220,
      render: (val?: string) =>
        val ? (
          <Text strong style={{ fontSize: '11px', color: 'var(--success-ink)' }}>
            {val}
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: '11px' }}>—</Text>
        ),
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (ip?: string) => (
        <Text style={{ fontSize: '11px', color: 'var(--color-neutral-700)' }}>
          {ip || '—'}
        </Text>
      ),
    },
    {
      title: 'Mô tả',
      key: 'description',
      width: 240,
      render: (_, record) => <ExpandableDescription item={record} />,
    },
  ];

  return (
    <div style={{ marginTop: 16, ...style }}>
      <Collapse
        defaultActiveKey={defaultActive ? ['history'] : []}
        items={[
          {
            key: 'history',
            label: (
              <Space size={8}>
                <HistoryOutlined style={{ color: 'var(--primary)', fontSize: 16 }} />
                <Text strong style={{ fontSize: '12px', textTransform: 'uppercase' }}>
                  Lịch sử thay đổi
                </Text>
                <Tag style={{ margin: 0, borderRadius: 10, fontSize: 11 }}>
                  {displayData.length} lần cập nhật
                </Tag>
              </Space>
            ),
            children: (
              <Table
                columns={columns}
                dataSource={displayData}
                rowKey="id"
                pagination={false}
                scroll={{ y: 250, x: 1300 }}
                size="small"
                bordered
              />
            ),
          },
        ]}
      />
    </div>
  );
};
