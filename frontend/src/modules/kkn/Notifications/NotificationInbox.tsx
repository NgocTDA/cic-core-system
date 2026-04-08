import React, { useState } from 'react';
import { Row, List, Typography, Input, Avatar } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import type { INotification } from './../../../types/notification';
import { useIsMobile } from './../../../hooks/useIsMobile';
import NotificationDetail from './../../../components/NotificationDetail';

const { Text, Paragraph } = Typography;

interface Props {
  data: INotification[];
  selectedItem: INotification | null;
  onSelect: (item: INotification) => void;
  onSubmitFeedback: (id: string, content: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
}

const NotificationInbox: React.FC<Props> = ({ data, selectedItem, onSelect, onSubmitFeedback, onToggleRead }) => {
  const [listWidth, setListWidth] = useState(350);
  const isMobile = useIsMobile();

  return (
    <div style={{ flex: 1, minHeight: 0, height: isMobile ? 'auto' : '100%', overflow: isMobile ? 'auto' : 'hidden', background: '#fff', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* LEFT PANE - LIST */}
      <div style={{ width: isMobile ? '100%' : listWidth, borderRight: isMobile ? 'none' : '1px solid #f0f0f0', borderBottom: isMobile ? '1px solid #f0f0f0' : 'none', display: isMobile && selectedItem ? 'none' : 'flex', flexDirection: 'column', height: isMobile ? '40vh' : '100%', flexShrink: 0 }}>
        <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
          <Input placeholder="Tìm kiếm nhanh..." prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => {
              const isActive = selectedItem?.id === item.id;
              const isUnread = item.status === 'UNREAD';
              return (
                <List.Item
                  onClick={() => onSelect(item)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: isActive ? '#e6f4ff' : (isUnread ? '#fff' : '#fafafa'),
                    borderLeft: isActive ? '3px solid #1677ff' : '3px solid transparent',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: isUnread ? '#1677ff' : '#bfbfbf' }} icon={<UserOutlined />} />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong={isUnread} style={{ fontSize: 13, color: isUnread ? '#1a1c1c' : '#595959' }} ellipsis>
                          {item.lastProcessor || 'Hệ thống'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{item.receivedAt.split(' ')[0]}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text strong={isUnread} style={{ display: 'block', fontSize: 14, marginBottom: 4, color: isUnread ? '#1a1c1c' : '#414755' }} ellipsis>
                          {item.title}
                        </Text>
                        <Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0, fontSize: 13, color: '#8c8c8c' }}>
                          {item.content}
                        </Paragraph>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </div>

      {!isMobile && (
        <div
          style={{ width: 5, cursor: 'col-resize', background: '#f0f0f0', transition: 'background 0.2s', zIndex: 10, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = '#1677ff'}
          onMouseLeave={e => e.currentTarget.style.background = '#f0f0f0'}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = listWidth;
            const doDrag = (ev: MouseEvent) => {
              setListWidth(Math.max(250, Math.min(800, startWidth + ev.clientX - startX)));
            };
            const stopDrag = () => {
              document.removeEventListener('mousemove', doDrag);
              document.removeEventListener('mouseup', stopDrag);
            };
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
          }}
        />
      )}

      {/* RIGHT PANE - DETAIL */}
      <div style={{ flex: 1, display: isMobile && !selectedItem ? 'none' : 'flex', flexDirection: 'column', height: isMobile ? 'auto' : '100%', minHeight: isMobile ? '60vh' : 'auto', overflow: 'hidden' }}>
        <NotificationDetail
          selectedItem={selectedItem}
          onToggleRead={onToggleRead}
          onSubmitFeedback={onSubmitFeedback}
        />
      </div>
    </div>
  );
};

export default NotificationInbox;

