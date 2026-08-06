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
import { colors, typography } from '@/design-system';
import CodeText from './CodeText';

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
    <div style={{ fontSize: typography.fontSize.xs }}>
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
            style={{ color: colors.primary[500], display: 'inline-flex', alignItems: 'center', gap: 4 }}
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
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
      render: (_, record) => {
        const dateObj = new Date(record.timestamp || Date.now());
        const dateStr =
          record.dateStr ||
          dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const fullStr =
          record.fullTimeStr ||
          `${dateStr} ${dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

        return (
          <Tooltip title={fullStr} placement="top">
            <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>
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
            <UserOutlined style={{ color: colors.primary[500], fontSize: 12 }} />
            <Text style={{ fontSize: typography.fontSize.xs }}>{record.updatedBy}</Text>
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
        <Tag color="blue" style={{ margin: 0, fontSize: typography.fontSize.xs }}>
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
          <CodeText style={{ fontSize: 11, color: colors.neutral[600] }}>
            {val}
          </CodeText>
        ) : (
          <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
        ),
    },
    {
      title: 'Giá trị mới',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 220,
      render: (val?: string) =>
        val ? (
          <CodeText style={{ fontSize: 11, color: colors.success.base }}>
            {val}
          </CodeText>
        ) : (
          <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
        ),
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (ip?: string) => (
        <CodeText style={{ fontSize: 11 }}>{ip || '192.168.1.100'}</CodeText>
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
                <HistoryOutlined style={{ color: colors.primary[500], fontSize: 16 }} />
                <Text strong style={{ fontSize: typography.fontSize.sm, textTransform: 'uppercase' }}>
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
