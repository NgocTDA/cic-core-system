import type { INotificationTemplate } from './TemplateTypes';

export const mockTemplates: INotificationTemplate[] = [
  {
    id: '1',
    code: 'OTP_LOGIN',
    name: 'Mã OTP đăng nhập',
    group: 'Bảo mật',
    channels: ['SMS', 'IN_APP'],
    priority: 'HIGH',
    languages: ['vi', 'en'],
    contentMap: {
      vi: {
        SMS: {
          body: 'Kính gửi {{customer_name}}, mã OTP đăng nhập của bạn là {{otp_code}}. Mã có hiệu lực trong 5 phút.',
          actionType: 'NONE',
          quietHours: false,
          retryCount: 3
        },
        IN_APP: {
          subject: 'Mã xác thực OTP',
          body: 'Chào {{customer_name}}, mã OTP đăng nhập là {{otp_code}}.',
          actionType: 'NONE',
          quietHours: false,
          retryCount: 0
        }
      },
      en: {
        SMS: {
          body: 'Dear {{customer_name}}, your login OTP is {{otp_code}}. Valid for 5 minutes.',
          actionType: 'NONE',
          quietHours: false,
          retryCount: 3
        }
      }
    },
    throttling: { maxPerDay: 5, minIntervalMinutes: 1 },
    status: 'ACTIVE',
    version: '1.2.0',
    updatedBy: 'admin_01',
    updatedAt: '2026-04-01 14:20:00',
  },
  {
    id: '2',
    code: 'TXN_SUCCESS',
    name: 'Giao dịch thành công',
    group: 'Giao dịch',
    channels: ['SMS', 'EMAIL', 'IN_APP'],
    priority: 'HIGH',
    languages: ['vi'],
    contentMap: {
      vi: {
        SMS: {
          body: 'GD chuyển tiền {{transaction_amount}} tới TK {{account_number}} thành công lúc {{datetime_log}}.',
          actionType: 'NONE',
          quietHours: true, // Tránh gửi SMS vào đêm khuya
          retryCount: 2
        },
        EMAIL: {
          subject: 'Thông báo giao dịch thành công',
          body: 'Kính gửi {{customer_name}},\nGiao dịch chuyển tiền {{transaction_amount}} của bạn đã thành công.\nSố dư hiện tại: {{balance_current}}.',
          actionType: 'OPEN_URL',
          actionValue: 'https://cic-vietnam.vn/tx/{{id}}',
          quietHours: false, // Email có thể gửi lúc nào cũng được
          retryCount: 5
        }
      }
    },
    throttling: { maxPerDay: 100, minIntervalMinutes: 0 },
    status: 'ACTIVE',
    version: '2.0.0',
    updatedBy: 'system',
    updatedAt: '2026-04-03 10:00:00',
  }
];
