export * from '@/modules/web-portal/SendBalance/types';

// ─── CIC-only: metadata xử lý phía tiếp nhận ─────────────────

export type ProcessingAction =
  | 'RECEIVED'       // vào hàng đợi CIC
  | 'EDITED'         // CIC sửa hộ số liệu
  | 'REVIEW_STARTED' // bắt đầu kiểm tra (khóa)
  | 'REVIEW_REOPENED'// mở lại để sửa
  | 'ACCEPTED'       // kiểm tra đạt → tiếp nhận
  | 'REVISION_REQUESTED' // trả lại TCTD sửa
  | 'REJECTED';      // (giữ tương thích dữ liệu cũ)

export interface ProcessingHistoryEntry {
  action: ProcessingAction;
  timestamp: string; // dd/MM/yyyy HH:mm:ss
  actor: string;
  reason?: string;
}

export interface ReportProcessingMeta {
  history: ProcessingHistoryEntry[];
  rejectReason?: string;
  editedBy?: string;
  // map rowKey → danh sách field đã sửa (khác giá trị gốc)
  editedFields?: Record<string, string[]>;
  acceptedAt?: string;
}

export type CicMetaMap = Record<string, ReportProcessingMeta>;
