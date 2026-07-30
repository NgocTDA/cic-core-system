// ─── Quản lý Job (bản đơn giản) — Types ──────────────────────

export type JobStatus = 'ACTIVE' | 'INACTIVE'; // bật / tắt
export type JobRunStatus = 'IDLE' | 'RUNNING' | 'SCHEDULED' | 'FAILED' | 'PAUSED';
export type JobExecutionStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELLED';

// ─── Các thuộc tính kỹ thuật bổ sung ──────────────────────────
export type JobType = 'SPRING_BEAN' | 'REST_API' | 'SQL_SCRIPT';
export type MisfirePolicy = 'FIRE_NOW' | 'DO_NOTHING';
export type BackoffStrategy = 'FIXED' | 'EXPONENTIAL';
export type BackoffMultiplier = 2 | 3; // 2x hoặc 3x

// ─── Thông báo & Cảnh báo Sự cố (3 kênh: SMS, PUSH, EMAIL) ────
export type NotificationChannel = 'SMS' | 'PUSH' | 'EMAIL';
export type NotificationEventType = 'ON_START' | 'ON_SUCCESS' | 'ON_FAILURE' | 'ON_FINAL_FAILURE';

export interface IEventNotificationConfig {
  enabled: boolean;
  channels: NotificationChannel[];
}

export interface IJobNotificationSettings {
  enableNotify: boolean;
  notifyEmails?: string;
  notifyPhoneNumbers?: string;
  events: {
    onStart?: IEventNotificationConfig;
    onSuccess?: IEventNotificationConfig;
    onFailure?: IEventNotificationConfig;
    onFinalFailure?: IEventNotificationConfig;
  };
}

export interface IJobSimple {
  id: string;
  code: string;
  name: string;
  description?: string;
  cron: string;                // biểu thức cron 5 trường, vd '0 2 * * *'
  timezone: string;            // vd 'Asia/Ho_Chi_Minh'
  maxRetries: number;          // số lần thử lại khi thất bại
  status: JobStatus;           // bật/tắt
  runStatus: JobRunStatus;     // trạng thái chạy hiện tại
  progress?: number;           // % (0-100), khi RUNNING
  currentStep?: string;        // bước hiện tại, khi RUNNING
  lastRunTime?: string;
  nextRunTime?: string;
  // thống kê cơ bản
  successCount: number;
  failureCount: number;
  successRate: number;         // %
  avgDuration: number;         // ms

  // 🔹 Các thuộc tính mở rộng kỹ thuật & lập lịch
  jobType?: JobType;
  targetComponent?: string;    // Spring Bean / REST API URL / SQL Proc
  jobParamsYaml?: string;      // Payload YAML

  misfirePolicy?: MisfirePolicy;
  timeoutSeconds?: number;     // Thời gian chờ tối đa (s)
  disallowConcurrent?: boolean;// Chống chạy song song

  retryInterval?: number;      // Khoảng chờ giữa các lần thử lại (s)
  backoffStrategy?: BackoffStrategy;
  backoffMultiplier?: BackoffMultiplier; // 2x hoặc 3x

  // 🔹 Cấu hình Cảnh báo & Thông báo theo Sự kiện
  notificationSettings?: IJobNotificationSettings;
}

export interface IJobRunSimple {
  id: string;
  jobId: string;
  status: JobExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: number;           // ms
  triggeredBy: string;
  errorMessage?: string;
  nodeIp?: string;             // IP nút/pod thực thi (vd: 10.0.4.12)
}

// Lịch sử thay đổi cấu hình job (audit log)
export interface IJobChangeLog {
  id: string;
  jobId: string;
  time: string;
  user: string;
  action: string;              // vd 'Tạo mới' | 'Cập nhật' | 'Kích hoạt' | 'Vô hiệu hóa'
  field?: string;              // trường bị thay đổi (nếu có)
  oldValue?: string;
  newValue?: string;
  note?: string;
}

// Dữ liệu nhập/sửa từ form
export interface IJobFormValues {
  code: string;
  name: string;
  description?: string;
  cron: string;
  timezone: string;
  maxRetries: number;
  status: JobStatus;

  // Thuộc tính mở rộng
  jobType?: JobType;
  targetComponent?: string;
  jobParamsYaml?: string;

  misfirePolicy?: MisfirePolicy;
  timeoutSeconds?: number;
  disallowConcurrent?: boolean;

  retryInterval?: number;
  backoffStrategy?: BackoffStrategy;
  backoffMultiplier?: BackoffMultiplier;

  notificationSettings?: IJobNotificationSettings;
}

