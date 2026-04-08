import React, { useState } from 'react';
import { Button, Space, Card, Radio } from 'antd';
import { CheckSquareOutlined, TableOutlined, MailOutlined, BorderOutlined } from '@ant-design/icons';
import NotificationFilter from './NotificationFilter';
import NotificationList from './NotificationList';
import NotificationDetailDrawer from './NotificationDetailDrawer';
import NotificationInbox from './NotificationInbox';
import type { INotification } from './../../../types/notification';
import { useIsMobile } from './../../../hooks/useIsMobile';
import useHeaderActions from './../../../hooks/useHeaderActions';

// Removed unused typography destruct

const MOCK_NOTIFICATIONS: INotification[] = [
  {
    id: '1',
    code: 'TB-2024-001',
    title: 'Cảnh báo dịch vụ: Kết nối chậm tới Vietcombank',
    type: 'WARNING',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '02/04/2026 08:30',
    lastProcessor: 'Hệ thống',
    content: 'Hệ thống phát hiện thời gian phản hồi từ API đối tác Vietcombank đang cao hơn mức cho phép (> 2000ms). Vui lòng kiểm tra lại cấu hình kết nối hoặc liên hệ đối tác.',
    links: [{ name: 'Log_System_1020.txt', url: '#' }],
    feedbacks: [
      { id: 'f1', senderName: 'Admin DB', content: 'Máy chủ Database nhánh 2 đang quá tải, đã điều hướng sang cụm 3.', timestamp: '14:20:00 02/04/2026', isMe: false },
      { id: 'f2', senderName: 'Tôi', content: 'Xác nhận PING về mức bình thường (150ms). Sẽ tiếp tục theo dõi thêm 30 phút.', timestamp: '14:22:15 02/04/2026', isMe: true }
    ]
  },
  {
    id: '2',
    code: 'TB-2024-002',
    title: 'Phê duyệt: Tệp báo cáo D32_2025.xlsx',
    type: 'TASK',
    status: 'READ',
    statusApproval: 'PENDING',
    receivedAt: '01/04/2026 15:45',
    lastProcessor: 'nguyenthia',
    content: 'Cán bộ Nguyễn Thị A đang yêu cầu duyệt tệp báo cáo chất lượng tín dụng tháng 3. Tệp ở định dạng Excel đã tải lên hệ thống.',
    links: [{ name: 'Xem tệp đính kèm trên hệ thống', url: '#' }]
  },
  {
    id: '3',
    code: 'TB-2024-003',
    title: 'Hệ thống cập nhật phiên bản CIC Core v2.5',
    type: 'SYSTEM',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '01/04/2026 09:00',
    lastProcessor: 'Admin',
    content: 'Kính gửi người dùng, hệ thống sẽ bảo trì từ 22h00 đến 02h00 thứ Bảy tuần này để nâng cấp phiên bản bảo mật mới nhất.',
  },
  {
    id: '4',
    code: 'TB-2024-004',
    title: 'Phê duyệt cấu hình kết nối MSB',
    type: 'TASK',
    status: 'READ',
    statusApproval: 'APPROVED',
    receivedAt: '31/03/2026 14:20',
    lastProcessor: 'longnhb',
    content: 'Cấu hình API kết nối với MSB đã được phê duyệt và được giám sát hoạt động đầy đủ.',
  },
  {
    id: '5',
    code: 'TB-2024-005',
    title: 'Lỗi: Tải lên danh sách KH không thành công',
    type: 'WARNING',
    status: 'UNREAD',
    statusApproval: 'REJECTED',
    receivedAt: '30/03/2026 10:15',
    lastProcessor: 'Hệ thống',
    content: 'File upload_kh_batch1.csv bị thiếu cột "Mã Tham Chiếu". Đề nghị kiểm tra cấu trúc dữ liệu tệp gốc.',
  },
  {
    id: '6',
    code: 'TB-2024-006',
    title: 'Thông báo: Thay đổi chính sách phí kết nôi dữ liệu',
    type: 'SYSTEM',
    status: 'READ',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '29/03/2026 16:30',
    lastProcessor: 'Admin_Finance',
    content: 'Từ ngày 01/05/2026, mức phí truy xuất dữ liệu CIC sẽ tăng 5% đối với các yêu cầu ngoài giờ hành chính.',
  },
  {
    id: '7',
    code: 'TB-2024-007',
    title: 'Nhắc việc: Hoàn thiện báo cáo quý I/2026',
    type: 'TASK',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '28/03/2026 08:30',
    lastProcessor: 'Manager',
    content: 'Tất cả các bộ phận lưu ý hạn nộp báo cáo quý I là trước 17h00 ngày 31/03/2026.',
  },
  {
    id: '8',
    code: 'TB-2024-008',
    title: 'Cảnh báo: Phát hiện đăng nhập bất thường',
    type: 'WARNING',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '27/03/2026 22:15',
    lastProcessor: 'Security_Bot',
    content: 'Tài khoản của bạn vừa được đăng nhập từ một địa chỉ IP lạ tại Singapore. Nếu không phải bạn, hãy đổi mật khẩu ngay.',
  },
  {
    id: '9',
    code: 'TB-2024-009',
    title: 'Phê duyệt: Đăng ký quyền truy cập module Tín dụng cá nhân',
    type: 'TASK',
    status: 'READ',
    statusApproval: 'APPROVED',
    receivedAt: '26/03/2026 11:00',
    lastProcessor: 'nguyenvanb',
    content: 'Yêu cầu quyền truy cập module "Tín dụng cá nhân" của cán bộ Trần Văn C đã được phê duyệt.',
  },
  {
    id: '10',
    code: 'TB-2024-010',
    title: 'Thông báo: Bảo trì hệ thống Gateway MSB',
    type: 'SYSTEM',
    status: 'READ',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '25/03/2026 14:00',
    lastProcessor: 'IT_Dept',
    content: 'Hệ thống Gateway MSB sẽ tạm dừng dịch vụ từ 0h-2h sáng mai để bảo trì định kỳ.',
  },
  {
    id: '11',
    code: 'TB-2024-011',
    title: 'Lỗi: Đồng bộ dữ liệu Oracle bị lỗi (Timeout)',
    type: 'WARNING',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '24/03/2026 05:45',
    lastProcessor: 'Sync_Bot',
    content: 'Tiến trình đồng bộ dự liệu từ Core sang Data Warehouse bị gián đoạn do lỗi kết nối Database.',
  },
  {
    id: '12',
    code: 'TB-2024-012',
    title: 'Phê duyệt: Tệp log giao dịch hàng ngày 23/03',
    type: 'TASK',
    status: 'READ',
    statusApproval: 'PENDING',
    receivedAt: '23/03/2026 17:30',
    lastProcessor: 'Hệ thống',
    content: 'Tệp log giao dịch ngày 23/03 đã sẵn sàng, chờ cán bộ kiểm soát phê duyệt.',
  },
  {
    id: '13',
    code: 'TB-2024-013',
    title: 'Thông báo: Chào mừng nhân sự mới bộ phận CIC',
    type: 'SYSTEM',
    status: 'READ',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '22/03/2026 09:15',
    lastProcessor: 'HR',
    content: 'Chào mừng cán bộ Lê Thị D gia nhập đội ngũ vận hành hệ thống CIC Core.',
  },
  {
    id: '14',
    code: 'TB-2024-014',
    title: 'Nhắc việc: Kiểm tra log bảo mật tuần 12',
    type: 'TASK',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '21/03/2026 10:00',
    lastProcessor: 'Security_Team',
    content: 'Đề nghị cán bộ trực ca kiểm tra và ký xác nhận log bảo mật của tuần vừa qua.',
  },
  {
    id: '15',
    code: 'TB-2024-015',
    title: 'Phê duyệt: Đề nghị nâng cấp RAM máy chủ 10.0.1.5',
    type: 'TASK',
    status: 'READ',
    statusApproval: 'REJECTED',
    receivedAt: '20/03/2026 14:45',
    lastProcessor: 'CTO_Office',
    content: 'Yêu cầu nâng cấp phần cứng bị từ chối do kế hoạch tài chính đã được chốt.',
  },
  {
    id: '16',
    code: 'TB-2024-016',
    title: 'Cảnh báo: Dung lượng ổ cứng máy chủ LOG sắp đầy',
    type: 'WARNING',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '19/03/2026 23:50',
    lastProcessor: 'Monitor_System',
    content: 'Ổ đĩa /var/log trên máy chủ LOG-SVR chỉ còn lại 5% dung lượng trống.',
  },
  {
    id: '17',
    code: 'TB-2024-017',
    title: 'Thông báo: Nghỉ lễ 30/04 và 01/05',
    type: 'SYSTEM',
    status: 'READ',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '18/03/2026 16:00',
    lastProcessor: 'Admin',
    content: 'Lịch nghỉ lễ kéo dài từ ngày 30/04 đến hết ngày 03/05/2026.',
  },
  {
    id: '18',
    code: 'TB-2024-018',
    title: 'Nhắc việc: Cập nhật tài liệu API v2.6',
    type: 'TASK',
    status: 'UNREAD',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '17/03/2026 13:20',
    lastProcessor: 'Dev_Lead',
    content: 'Vui lòng hoàn thiện tài liệu Swagger cho các endpoint mới của Gateway.',
  },
  {
    id: '19',
    code: 'TB-2024-019',
    title: 'Lỗi: Tải tệp sao kê thất bại',
    type: 'WARNING',
    status: 'READ',
    statusApproval: 'NOT_APPLICABLE',
    receivedAt: '16/03/2026 11:30',
    lastProcessor: 'Hệ thống',
    content: 'Tệp sao kê tháng 2 của khách hàng 001920 không thể tải xuống do lỗi phân quyền thư mục.',
  },
  {
    id: '20',
    code: 'TB-2024-020',
    title: 'Phê duyệt: Danh sách người dùng mới (Batch 4)',
    type: 'TASK',
    status: 'UNREAD',
    statusApproval: 'PENDING',
    receivedAt: '15/03/2026 15:10',
    lastProcessor: 'Admin_Core',
    content: 'Danh sách 15 người dùng mới từ chi nhánh Hà Nội đang chờ admin tổng phê duyệt.',
  }
];

const NotificationsPage: React.FC = () => {
  const isMobile = useIsMobile();

  const [data, setData] = useState<INotification[]>(MOCK_NOTIFICATIONS);
  const [selectedItem, setSelectedItem] = useState<INotification | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'inbox'>('table');

  // Register this page's header title and actions
  useHeaderActions({
    title: 'Thông báo hệ thống',
    actions: [
      { key: 'common', label: '', icon: null, onClick: () => { } },
    ]
  }, []);

  const handleFeedback = (notificationId: string, content: string) => {
    const newFeedback = {
      id: `f_${Date.now()}`,
      senderName: 'Tôi',
      content,
      timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
      isMe: true
    };

    setData(prev => prev.map(item => item.id === notificationId ? { ...item, feedbacks: [...(item.feedbacks || []), newFeedback] } : item));
    setSelectedItem(prev => prev && prev.id === notificationId ? { ...prev, feedbacks: [...(prev.feedbacks || []), newFeedback] } : prev);
  };

  const handleRowClick = (record: INotification) => {
    setSelectedItem(record);
    if (viewMode === 'table') {
      setDrawerVisible(true);
    }
    // Mark as read optionally when clicked
    if (record.status === 'UNREAD') {
      setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'READ' } : item));
    }
  };

  const markAllAsRead = () => {
    setData(prev => prev.map(item => ({ ...item, status: 'READ' })));
  };

  const markAllAsUnread = () => {
    setData(prev => prev.map(item => ({ ...item, status: 'UNREAD' })));
  };

  const toggleReadStatus = (id: string, isRead: boolean) => {
    const status = isRead ? 'READ' : 'UNREAD';
    setData(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (selectedItem?.id === id) {
      setSelectedItem(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div style={{ padding: isMobile ? '8px' : '16px 24px 24px', background: '#f5f5f5', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>

      {/* Card 1: Filter (only in table mode) */}
      {viewMode === 'table' && (
        <Card
          bordered={false}
          style={{ marginBottom: 16, flexShrink: 0 }}
        >
          <NotificationFilter />
        </Card>
      )}

      {/* Card 2: Data Content */}
      <Card
        bordered={false}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: viewMode === 'inbox' ? 0 : '8px 20px 20px', overflow: 'hidden', minHeight: 0 } }}
        title={
          viewMode === 'table' && (
            <Space size="small">
              <Button size="small" icon={<CheckSquareOutlined />} onClick={markAllAsRead}>Đánh dấu tất cả đã đọc</Button>
              <Button size="small" icon={<BorderOutlined />} onClick={markAllAsUnread}>Đánh dấu tất cả chưa đọc</Button>
            </Space>
          )
        }
        extra={
          <Radio.Group
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="table"><TableOutlined /> Danh sách</Radio.Button>
            <Radio.Button value="inbox"><MailOutlined /> Hộp thư</Radio.Button>
          </Radio.Group>
        }
      >
        {viewMode === 'table' ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <NotificationList data={data} onRowClick={handleRowClick} onToggleRead={toggleReadStatus} />
          </div>
        ) : (
          <NotificationInbox data={data} selectedItem={selectedItem} onSelect={handleRowClick} onSubmitFeedback={handleFeedback} onToggleRead={toggleReadStatus} />
        )}
      </Card>

      <NotificationDetailDrawer
        visible={drawerVisible && viewMode === 'table'}
        notification={selectedItem}
        onClose={() => setDrawerVisible(false)}
        onSubmitFeedback={handleFeedback}
        onToggleRead={toggleReadStatus}
      />
    </div>
  );
};

export default NotificationsPage;

