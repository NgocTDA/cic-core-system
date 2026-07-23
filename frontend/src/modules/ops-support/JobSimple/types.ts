// ─── Quản lý Job (bản đơn giản) — Types ──────────────────────
// Mô hình dữ liệu tối giản, chỉ phục vụ: danh sách job, tiến trình,
// bật/dừng + số lần retry khi thất bại. Bỏ notification/schema so với bản cũ.

export type JobStatus = 'ACTIVE' | 'INACTIVE'; // bật / tắt
export type JobRunStatus = 'IDLE' | 'RUNNING' | 'SCHEDULED' | 'FAILED' | 'PAUSED';
export type JobExecutionStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELLED';

export interface IJobSimple {
  id: string;
  code: string;
  name: string;
  description?: string;
  cron: string;                // biểu thức cron 5 trường, vd '0 2 * * *' (nguồn sự thật của lịch)
  timezone: string;            // vd 'Asia/Ho_Chi_Minh'
  maxRetries: number;          // số lần thử lại khi thất bại (mặc định 3)
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
}

// Lịch sử thay đổi cấu hình job (audit log) — bắt buộc theo chuẩn màn chi tiết
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

// Dữ liệu nhập/sửa từ form (chỉ các trường người dùng chỉnh được)
export interface IJobFormValues {
  code: string;
  name: string;
  description?: string;
  cron: string;
  timezone: string;
  maxRetries: number;
  status: JobStatus;
}
