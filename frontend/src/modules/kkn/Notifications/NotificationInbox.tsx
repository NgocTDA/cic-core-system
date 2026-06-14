import React, { useState } from 'react';
import { List, Typography, Input, Avatar } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { colors, spacing, typography, zIndex } from '@/design-system';
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
    <div style={{ flex: 1, minHeight: 0, height: isMobile ? 'auto' : '100%', overflow: isMobile ? 'auto' : 'hidden', background: colors.bg.container, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* LEFT PANE - LIST */}
      <div style={{ width: isMobile ? '100%' : listWidth, borderRight: isMobile ? 'none' : `1px solid ${colors.border.split}`, borderBottom: isMobile ? `1px solid ${colors.border.split}` : 'none', display: 'flex', flexDirection: 'column', height: isMobile ? '40vh' : '100%', flexShrink: 0 }}>
        <div style={{ padding: spacing[4], borderBottom: `1px solid ${colors.border.split}`, background: colors.bg.subtle }}>
          <Input placeholder="Tìm kiếm nhanh..." prefix={<MailOutlined style={{ color: colors.neutral[400] }} />} />
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
                    padding: `${spacing[3]} ${spacing[4]}`,
                    cursor: 'pointer',
                    background: isActive ? colors.primary[50] : (isUnread ? colors.bg.container : colors.bg.subtle),
                    borderLeft: isActive ? `3px solid ${colors.primary[500]}` : '3px solid transparent',
                    borderBottom: `1px solid ${colors.border.split}`
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: isUnread ? colors.primary[500] : colors.neutral[400] }} icon={<UserOutlined />} />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong={isUnread} style={{ fontSize: 13, color: isUnread ? colors.text.primary : colors.neutral[600] }} ellipsis>
                          {item.lastProcessor || 'Hệ thống'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{item.receivedAt.split(' ')[0]}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text strong={isUnread} style={{ display: 'block', fontSize: typography.fontSize.base, marginBottom: spacing[1], color: isUnread ? colors.text.primary : colors.neutral[700] }} ellipsis>
                          {item.title}
                        </Text>
                        <Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0, fontSize: 13, color: colors.neutral[500] }}>
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
          style={{ width: 5, cursor: 'col-resize', background: colors.border.split, transition: 'background 0.2s', zIndex: zIndex.raised, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = colors.primary[500]}
          onMouseLeave={e => e.currentTarget.style.background = colors.border.split}
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

