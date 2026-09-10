import type { IChangeHistoryItem } from '@/components/ui';

export type IndustryProductStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RECALLED';

export interface IIndustryProduct {
  id: string;
  code: string;               // Mã sản phẩm
  name: string;               // Tên sản phẩm
  fiscalYear: number;         // Năm tài chính
  industryCode: string;       // Mã ngành nghề
  industryName: string;       // Tên ngành nghề
  createdAt: string;          // Ngày tạo lập (dd/MM/yyyy)
  createdBy: string;          // Username người tạo
  creatorFullName: string;    // Họ và tên người tạo (hiển thị tooltip)
  status: IndustryProductStatus; // Trạng thái
  approvedBy?: string;        // Username người duyệt
  approverFullName?: string;  // Họ và tên người duyệt (tooltip)
  approvedAt?: string;        // Ngày duyệt (dd/MM/yyyy)
  rejectReason?: string;      // Lý do từ chối
  recallReason?: string;      // Lý do thu hồi
  approvalNote?: string;      // Ý kiến duyệt
  fileName?: string;          // Tên file báo cáo
  fileSize?: string;          // Dung lượng file
  notes?: string;             // Ghi chú
  history?: IChangeHistoryItem[]; // Lịch sử thay đổi theo Rule 8
}

export interface IIndustryProductFilter {
  productCode?: string;
  fiscalYear?: number;
  industryCode?: string;
  createdBy?: string;
  status?: IndustryProductStatus;
  approvalDateRange?: [string, string];
}

export const STATUS_LABELS: Record<IndustryProductStatus, string> = {
  DRAFT: 'Tạo mới',
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối duyệt',
  RECALLED: 'Thu hồi',
};

export const FISCAL_YEAR_OPTIONS = [
  { value: 2026, label: '2026' },
  { value: 2025, label: '2025' },
  { value: 2024, label: '2024' },
  { value: 2023, label: '2023' },
  { value: 2022, label: '2022' },
  { value: 2021, label: '2021' },
];

export const INDUSTRY_OPTIONS = [
  { value: 'G47', label: 'G47 - Bán lẻ (trừ ô tô, mô tô, xe máy)', name: 'Bán lẻ (trừ ô tô, mô tô, xe máy)' },
  { value: 'F41', label: 'F41 - Xây dựng nhà các loại', name: 'Xây dựng nhà các loại' },
  { value: 'C10', label: 'C10 - Chế biến thực phẩm', name: 'Chế biến thực phẩm' },
  { value: 'K64', label: 'K64 - Hoạt động dịch vụ tài chính', name: 'Hoạt động dịch vụ tài chính' },
  { value: 'H52', label: 'H52 - Kho bãi và các hoạt động hỗ trợ vận tải', name: 'Kho bãi và các hoạt động hỗ trợ vận tải' },
  { value: 'A01', label: 'A01 - Nông nghiệp và hoạt động dịch vụ liên quan', name: 'Nông nghiệp và hoạt động dịch vụ liên quan' },
  { value: 'I55', label: 'I55 - Dịch vụ lưu trú', name: 'Dịch vụ lưu trú' },
  { value: 'J62', label: 'J62 - Lập trình máy vi tính, tư vấn và quản trị', name: 'Lập trình máy vi tính, tư vấn và quản trị' },
];

export const PRODUCT_CATALOG_OPTIONS = [
  { value: 'SP-PTN-01', label: 'SP-PTN-01 - Báo cáo phân tích ngành Bán lẻ', name: 'Báo cáo phân tích ngành Bán lẻ', defaultIndustry: 'G47' },
  { value: 'SP-PTN-02', label: 'SP-PTN-02 - Báo cáo trung bình ngành Xây dựng nhà', name: 'Báo cáo trung bình ngành Xây dựng nhà', defaultIndustry: 'F41' },
  { value: 'SP-PTN-03', label: 'SP-PTN-03 - Báo cáo phân tích ngành Chế biến thực phẩm', name: 'Báo cáo phân tích ngành Chế biến thực phẩm', defaultIndustry: 'C10' },
  { value: 'SP-PTN-04', label: 'SP-PTN-04 - Báo cáo trung bình ngành Dịch vụ tài chính', name: 'Báo cáo trung bình ngành Dịch vụ tài chính', defaultIndustry: 'K64' },
  { value: 'SP-PTN-05', label: 'SP-PTN-05 - Báo cáo phân tích Logistics và kho bãi', name: 'Báo cáo phân tích Logistics và kho bãi', defaultIndustry: 'H52' },
  { value: 'SP-PTN-06', label: 'SP-PTN-06 - Báo cáo trung bình ngành Nông nghiệp công nghệ cao', name: 'Báo cáo trung bình ngành Nông nghiệp công nghệ cao', defaultIndustry: 'A01' },
  { value: 'SP-PTN-07', label: 'SP-PTN-07 - Báo cáo phân tích ngành Khách sạn - Dịch vụ lưu trú', name: 'Báo cáo phân tích ngành Khách sạn - Dịch vụ lưu trú', defaultIndustry: 'I55' },
  { value: 'SP-PTN-08', label: 'SP-PTN-08 - Báo cáo phân tích ngành Công nghệ thông tin', name: 'Báo cáo phân tích ngành Công nghệ thông tin', defaultIndustry: 'J62' },
];

export const CREATOR_OPTIONS = [
  { value: 'admin', label: 'admin - Quản trị hệ thống', fullName: 'Quản trị hệ thống' },
  { value: 'nguyenvana', label: 'nguyenvana - Nguyễn Văn An', fullName: 'Nguyễn Văn An' },
  { value: 'tranthib', label: 'tranthib - Trần Thị Bình', fullName: 'Trần Thị Bình' },
  { value: 'lethic', label: 'lethic - Lê Thị Cúc', fullName: 'Lê Thị Cúc' },
  { value: 'phamvand', label: 'phamvand - Phạm Văn Dũng', fullName: 'Phạm Văn Dũng' },
  { value: 'hoangthie', label: 'hoangthie - Hoàng Thị Em', fullName: 'Hoàng Thị Em' },
];

export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Tạo mới' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Từ chối duyệt' },
  { value: 'RECALLED', label: 'Thu hồi' },
];
