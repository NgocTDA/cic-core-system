import React, { useState } from 'react';
import { Typography, Button, Checkbox, Space, Tag, Avatar } from 'antd';
import { MailOutlined, LinkOutlined, UserOutlined, UndoOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { INotification } from '../types/notification';
import { useIsMobile } from '../hooks/useIsMobile';
import RichTextEditor from './RichTextEditor';

const { Title, Text, Paragraph } = Typography;

interface Props {
  selectedItem: INotification | null;
  onToggleRead: (id: string, isRead: boolean) => void;
  onSubmitFeedback: (id: string, content: string) => void;
}

const NotificationDetail: React.FC<Props> = ({ selectedItem, onToggleRead, onSubmitFeedback }) => {
  const isMobile = useIsMobile();
  const [replyText, setReplyText] = useState('');

  const handleSend = () => {
    if (!replyText.trim() || !selectedItem) return;
    onSubmitFeedback(selectedItem.id, replyText);
    setReplyText('');
  };

  if (!selectedItem) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#bfbfbf', height: '100%' }}>
        <Space direction="vertical" align="center">
          <MailOutlined style={{ fontSize: 48 }} />
          <Text>Chọn một thông báo để xem nội dung</Text>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>{selectedItem.title}</Title>
          <Space>
            <Button
              size="small"
              type="text"
              onClick={() => onToggleRead(selectedItem.id, selectedItem.status === 'UNREAD')}
              icon={selectedItem.status === 'UNREAD' ? <CheckCircleOutlined /> : <UndoOutlined />}
            >
              {selectedItem.status === 'UNREAD' ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
            </Button>
            <Tag color={selectedItem.status === 'UNREAD' ? 'error' : 'success'}>
              {selectedItem.status === 'UNREAD' ? 'Chưa đọc' : 'Đã đọc'}
            </Tag>
          </Space>
        </div>
        <Space size="large" style={{ color: '#595959' }}>
          <Text><Text strong>Người gửi:</Text> {selectedItem.lastProcessor}</Text>
          <Text><Text strong>Mã TB:</Text> {selectedItem.code}</Text>
          <Text><Text strong>Thời gian:</Text> {selectedItem.receivedAt}</Text>
          <Tag bordered={false} color={selectedItem.type === 'WARNING' ? 'warning' : 'processing'}>
            {selectedItem.type}
          </Tag>
        </Space>
      </div>

      <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', backgroundColor: '#fff' }}>
        <Paragraph style={{ fontSize: 15, lineHeight: 1.6, color: '#1a1c1c' }}>
          {selectedItem.content}
        </Paragraph>

        {selectedItem.links && selectedItem.links.length > 0 && (
          <div style={{ marginTop: 24, padding: 16, background: '#f9f9f9', borderRadius: 6, border: '1px solid #f0f0f0' }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Tệp đính kèm:</Text>
            <Space direction="vertical">
              {selectedItem.links.map((lnk, idx) => (
                <a key={idx} href={lnk.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LinkOutlined /> {lnk.name}
                </a>
              ))}
            </Space>
          </div>
        )}
        {selectedItem.feedbacks && selectedItem.feedbacks.length > 0 && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 15 }}>Lịch sử phản hồi:</Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selectedItem.feedbacks.map(fb => (
                <div key={fb.id} style={{ display: 'flex', gap: 12, flexDirection: fb.isMe ? 'row-reverse' : 'row' }}>
                  <Avatar style={{ backgroundColor: fb.isMe ? '#fa8c16' : '#bfbfbf', flexShrink: 0 }} icon={<UserOutlined />} />
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: 6,
                    background: fb.isMe ? '#e6f4ff' : '#f5f5f5',
                    border: fb.isMe ? '1px solid #91caff' : '1px solid #e8e8e8'
                  }}>
                    <div style={{ display: 'flex', justifyContent: fb.isMe ? 'flex-end' : 'space-between', marginBottom: 6, gap: 12 }}>
                      <Text strong style={{ fontSize: 13, color: fb.isMe ? '#0958d9' : '#595959' }}>{fb.senderName}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{fb.timestamp}</Text>
                    </div>
                    <div style={{ margin: 0, fontSize: 14, color: '#262626', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: fb.content }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 32px', borderTop: '1px solid #e8e8e8', background: '#f5f7fa', flexShrink: 0 }}>
        <Text strong style={{ display: 'block', marginBottom: 8, color: '#434343' }}>Phản hồi nhanh</Text>
        <RichTextEditor
          placeholder="Nhập nội dung phản hồi tại đây..."
          value={replyText}
          onChange={setReplyText}
        />
        <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
          <Checkbox>Gửi đồng thời qua Email</Checkbox>
          <Button type="primary" onClick={handleSend} style={{ width: isMobile ? '100%' : 'auto' }}>Gửi phản hồi</Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;

