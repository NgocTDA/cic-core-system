// ─── Quản lý Job 2 (Job Console Engine) — Mock Data ──────────────────
import type { IJobConsoleItem } from './types';

export const mockConsoleJobs: Record<string, IJobConsoleItem> = {
  'JOB_EXCHANGE_RATE_SYNC': {
    code: 'JOB_EXCHANGE_RATE_SYNC',
    name: 'Đồng bộ tỷ giá ngoại tệ tự động',
    type: 'SPRING_BEAN',
    target: 'exchangeRateSyncService.syncDailyRates',
    targetLabel: 'Spring Bean & Method Target',
    cron: '0 0 17 * * MON-FRI',
    cronDesc: 'Chạy lúc 17:00:00 từ Thứ 2 đến Thứ 6 hàng tuần',
    misfire: 'FIRE_NOW',
    timeout: 300,
    concurrent: true,
    status: 'ACTIVE',
    params: `sourceApi: "https://api.bank.com/v1/rates"
currencyList: ["USD", "EUR", "JPY", "GBP"]
autoApproveDiffPercentage: 1.5`,
    maxRetries: 3,
    retryInterval: 60,
    backoff: 'EXPONENTIAL',
    backoffMultiplier: '2x',
    enableNotify: true,
    notifyEmails: 'devops-team@bank.com, sysadmin@bank.com',
    notificationMatrix: {
      onStart: { sms: false, push: false, email: true },
      onSuccess: { sms: false, push: false, email: true },
      onFailure: { sms: true, push: true, email: true },
      onRetry: { sms: false, push: true, email: false },
    },
    logs: [
      { id: 'log-1', time: '2026-07-23 17:00:00', duration: '2.4s', status: 'SUCCESS', node: '10.0.4.12', detail: 'Đồng bộ thành công 4 ngoại tệ.' },
      { id: 'log-2', time: '2026-07-22 17:00:00', duration: '2.1s', status: 'SUCCESS', node: '10.0.4.12', detail: 'Đồng bộ thành công 4 ngoại tệ.' },
      { id: 'log-3', time: '2026-07-21 17:00:00', duration: '15.0s', status: 'FAILED', node: '10.0.4.11', detail: 'HTTP 504 Gateway Timeout từ Bank API.' }
    ]
  },
  'JOB_NOTIF_RETRY': {
    code: 'JOB_NOTIF_RETRY',
    name: 'Gửi lại thông báo Push/Email bị lỗi',
    type: 'REST_API',
    target: 'https://notif-service.internal/api/v1/retry-failed',
    targetLabel: 'REST API Endpoint URL',
    cron: '0 */15 * * * *',
    cronDesc: 'Lặp lại mỗi 15 phút một lần (vào các phút 0, 15, 30, 45)',
    misfire: 'DO_NOTHING',
    timeout: 120,
    concurrent: true,
    status: 'ACTIVE',
    params: `httpMethod: "POST"
headers:
  Authorization: "Bearer eyJhbGciOiJIUzI1Ni..."
  Content-Type: "application/json"
payload:
  batchSize: 100
  channels: ["PUSH", "EMAIL"]`,
    maxRetries: 5,
    retryInterval: 30,
    backoff: 'FIXED',
    enableNotify: true,
    notifyEmails: 'notif-admin@company.com',
    notificationMatrix: {
      onStart: { sms: false, push: false, email: false },
      onSuccess: { sms: false, push: false, email: true },
      onFailure: { sms: true, push: true, email: true },
      onRetry: { sms: false, push: true, email: false },
    },
    logs: [
      { id: 'log-1', time: '2026-07-23 14:15:00', duration: '0.8s', status: 'SUCCESS', node: '10.0.4.15', detail: 'Đã xử lý 12 tin nhắn tồn đọng.' },
      { id: 'log-2', time: '2026-07-23 14:00:00', duration: '0.5s', status: 'SUCCESS', node: '10.0.4.15', detail: 'Không có tin nhắn lỗi.' }
    ]
  },
  'JOB_CLEANUP_AUDIT_LOG': {
    code: 'JOB_CLEANUP_AUDIT_LOG',
    name: 'Dọn dẹp nhật ký hệ thống cũ (> 90 ngày)',
    type: 'SQL_SCRIPT',
    target: 'CALL proc_purge_audit_logs(?);',
    targetLabel: 'Stored Procedure / SQL Command',
    cron: '0 0 1 * * *',
    cronDesc: 'Chạy vào 01:00:00 AM mỗi ngày',
    misfire: 'DO_NOTHING',
    timeout: 3600,
    concurrent: true,
    status: 'PAUSED',
    params: `retentionDays: 90
batchDeleteSize: 5000
targetTables:
  - "sys_audit_log"
  - "sys_login_history"`,
    maxRetries: 0,
    retryInterval: 0,
    backoff: 'FIXED',
    enableNotify: false,
    notifyEmails: '',
    notificationMatrix: {
      onStart: { sms: false, push: false, email: false },
      onSuccess: { sms: false, push: false, email: false },
      onFailure: { sms: false, push: false, email: false },
      onRetry: { sms: false, push: false, email: false },
    },
    logs: [
      { id: 'log-1', time: '2026-07-20 01:00:00', duration: '142.5s', status: 'SUCCESS', node: '10.0.4.20', detail: 'Đã xóa 45,210 bản ghi cũ.' }
    ]
  }
};
