// ─── Quản lý Job (bản đơn giản) — Types ──────────────────────
// Mô hình dữ liệu tối giản, chỉ phục vụ: danh sách job, tiến trình,
// bật/dừng. Bỏ dependency/retry/notification/schema so với bản cũ.

export type JobStatus = 'ACTIVE' | 'INACTIVE'; // bật / tắt
export type JobRunStatus = 'IDLE' | 'RUNNING' | 'SCHEDULED' | 'FAILED' | 'PAUSED';
export type JobExecutionStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELLED';

export interface IJobSimple {
  id: string;
  code: string;
  name: string;
  description?: string;
  scheduleText: string;        // mô tả lịch dạng cron/text, vd '0 2 * * *' hoặc 'Hằng ngày 2h'
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

// Dữ liệu nhập/sửa từ form (chỉ các trường người dùng chỉnh được)
export interface IJobFormValues {
  code: string;
  name: string;
  description?: string;
  scheduleText: string;
  status: JobStatus;
}
