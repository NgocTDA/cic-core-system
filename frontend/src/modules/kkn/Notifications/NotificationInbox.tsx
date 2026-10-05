import React, { useState } from 'react';
import { List, Typography, Input, Avatar } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { zIndex } from '@/config/layout';
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
    <div style={{ flex: 1, minHeight: 0, height: isMobile ? 'auto' : '100%', overflow: isMobile ? 'auto' : 'hidden', background: 'var(--surface)', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* LEFT PANE - LIST */}
      <div style={{ width: isMobile ? '100%' : listWidth, borderRight: isMobile ? 'none' : `1px solid var(--color-neutral-100)`, borderBottom: isMobile ? `1px solid var(--color-neutral-100)` : 'none', display: 'flex', flexDirection: 'column', height: isMobile ? '40vh' : '100%', flexShrink: 0 }}>
        <div style={{ padding: 'var(--spacing-16)', borderBottom: `1px solid var(--color-neutral-100)`, background: 'var(--bg-subtle)' }}>
          <Input placeholder="Tìm kiếm nhanh..." prefix={<MailOutlined style={{ color: 'var(--text-subtle)' }} />} />
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
                    padding: `var(--spacing-12) var(--spacing-16)`,
                    cursor: 'pointer',
                    background: isActive ? 'var(--primary-subtle)' : (isUnread ? 'var(--surface)' : 'var(--bg-subtle)'),
                    borderLeft: isActive ? `3px solid var(--primary)` : '3px solid transparent',
                    borderBottom: `1px solid var(--color-neutral-100)`
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: isUnread ? 'var(--primary)' : 'var(--text-subtle)' }} icon={<UserOutlined />} />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong={isUnread} style={{ fontSize: 13, color: isUnread ? 'var(--text)' : 'var(--text-muted)' }} ellipsis>
                          {item.lastProcessor || 'Hệ thống'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{item.receivedAt.split(' ')[0]}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text strong={isUnread} style={{ display: 'block', fontSize: '14px', marginBottom: 'var(--spacing-4)', color: isUnread ? 'var(--text)' : 'var(--color-neutral-700)' }} ellipsis>
                          {item.title}
                        </Text>
                        <Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
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
          style={{ width: 5, cursor: 'col-resize', background: 'var(--color-neutral-100)', transition: 'background 0.2s', zIndex: zIndex.raised, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-neutral-100)'}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : '100%', minHeight: isMobile ? '60vh' : 'auto', overflow: 'hidden' }}>
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
