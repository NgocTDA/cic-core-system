// ─── Enum constants ──────────────────────────────────────────

export const PRODUCT_TYPE_OPTIONS = [
  { value: 'TRADITIONAL',      label: 'Sản phẩm truyền thống' },
  { value: 'PERIODIC',         label: 'Sản phẩm định kỳ' },
  { value: 'ON_DEMAND',        label: 'Sản phẩm theo yêu cầu' },
  { value: 'CUSTOM',           label: 'Sản phẩm tùy biến' },
  { value: 'ANALYSIS_ARTICLE', label: 'Bài viết phân tích, cảnh báo' },
] as const;

export const PRODUCT_GROUP_OPTIONS = [
  { value: 'CREDIT_RELATION',  label: 'Sản phẩm thông tin quan hệ tín dụng khách hàng' },
  { value: 'SCORING_RATING',   label: 'Sản phẩm chấm điểm, xếp hạng tín dụng' },
  { value: 'ENTERPRISE_REPORT',label: 'Sản phẩm báo cáo thông tin doanh nghiệp' },
  { value: 'ALERT_MONTHLY',    label: 'Sản phẩm cảnh báo và sản phẩm theo user đang thực hiện hàng tháng' },
  { value: 'BORROWER',         label: 'Sản phẩm dành cho khách hàng vay' },
] as const;

export const SUBJECT_TYPE_OPTIONS = [
  { value: 'INDIVIDUAL',        label: 'Cá nhân' },
  { value: 'ORGANIZATION',      label: 'Tổ chức' },
  { value: 'GROUP_CORPORATION', label: 'Tập đoàn, Tổng công ty' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'VN', label: 'VN - Việt Nam' },
  { value: 'EN', label: 'EN - Tiếng Anh' },
] as const;

export const INQUIRY_CHANNEL_OPTIONS = [
  { value: 'WEB_FORM',     label: 'Web Form' },
  { value: 'FILE_UPLOAD',  label: 'File Upload' },
  { value: 'API',          label: 'API' },
  { value: 'SCHEDULER',    label: 'Scheduler' },
  { value: 'INTERNAL_JOB', label: 'Internal Job' },
] as const;

export const INQUIRY_MODE_OPTIONS = [
  { value: 'SINGLE_ITEM', label: 'Một đối tượng (Single Item)' },
  { value: 'MULTI_ITEMS', label: 'Nhiều đối tượng (Multi Items)' },
  { value: 'BATCH',       label: 'Hỏi theo lô (Batch)' },
] as const;

export const INPUT_FORMAT_OPTIONS = [
  { value: 'FORM',  label: 'Form' },
  { value: 'EXCEL', label: 'Excel (.XLS)' },
  { value: 'CSV',   label: 'CSV' },
  { value: 'JSON',  label: 'JSON' },
  { value: 'XML',   label: 'XML' },
] as const;

export const FULFILLMENT_MODE_OPTIONS = [
  { value: 'IMMEDIATE',           label: 'Immediate' },
  { value: 'ASYNC',               label: 'Async' },
  { value: 'BATCH',               label: 'Batch' },
  { value: 'PERIODIC_PRECOMPUTED',label: 'Periodic Precomputed' },
] as const;

export const DATA_MODE_OPTIONS = [
  { value: 'ON_DEMAND',   label: 'On Demand' },
  { value: 'PRECOMPUTED', label: 'Precomputed' },
] as const;

export const PENDING_REASON_OPTIONS = [
  { value: 'DATA_ADJUSTMENT',  label: 'Data Adjustment' },
  { value: 'INVALID_IDENTIFIER', label: 'Invalid Identifier' },
  { value: 'MANUAL_REVIEW',    label: 'Manual Review' },
  { value: 'DATA_NOT_READY',   label: 'Data Not Ready' },
] as const;

export const MANUAL_REVIEW_OPTIONS = [
  { value: 'always',      label: 'Luôn cần' },
  { value: 'conditional', label: 'Có điều kiện' },
  { value: 'never',       label: 'Không cần' },
] as const;

export const OUTPUT_TYPE_OPTIONS = [
  { value: 'REPORT',       label: 'Report' },
  { value: 'DATA_FILE',    label: 'Data File' },
  { value: 'API_RESPONSE', label: 'API Response' },
] as const;

export const OUTPUT_FORMAT_OPTIONS = [
  { value: 'PDF',   label: 'PDF' },
  { value: 'EXCEL', label: 'Excel' },
  { value: 'JSON',  label: 'JSON' },
  { value: 'XML',   label: 'XML' },
  { value: 'ZIP',   label: 'ZIP' },
] as const;

export const SIGNATURE_OPTIONS = [
  { value: 'required', label: 'Bắt buộc' },
  { value: 'optional', label: 'Tùy chọn' },
  { value: 'none',     label: 'Không cần' },
] as const;

export const ENCRYPTION_OPTIONS = [
  { value: 'required',    label: 'Bắt buộc' },
  { value: 'conditional', label: 'Có điều kiện' },
  { value: 'none',        label: 'Không cần' },
] as const;

export const DELIVERY_CHANNEL_OPTIONS = [
  { value: 'WEB_FORM',     label: 'Web Form' },
  { value: 'WEB_DOWNLOAD', label: 'Web Download' },
  { value: 'API_RESPONSE', label: 'API Response' },
  { value: 'API_CALLBACK', label: 'API Callback' },
  { value: 'NOTIFICATION', label: 'Notification' },
] as const;

export const CONSENT_OPTIONS = [
  { value: 'required',    label: 'Bắt buộc' },
  { value: 'conditional', label: 'Có điều kiện' },
  { value: 'none',        label: 'Không cần' },
] as const;

// ─── Interface ───────────────────────────────────────────────

export interface IProduct {
  id: string;
  code: string;
  name: string;
  productType: string;
  productGroup: string;
  subjectType: string[];
  language: string[];
  version: string;
  status: 'ACTIVE' | 'INACTIVE';
  effectiveDate: string;
  expiredDate: string;

  // Input
  inquiryChannels: string[];
  inquiryModes: string[];
  inputFormats: string[];
  maxRecordsWebUi: number;
  maxRecordsFileUpload: number;
  maxRecordsApi: number;

  // Processing
  fulfillmentModes: string[];
  dataMode: string;
  allowPartialResponse: boolean;
  allowRetry: boolean;
  allowReprocess: boolean;
  manualReviewRequired: string;
  pendingReasons: string[];

  // Output
  outputTypes: string[];
  outputFormats: string[];
  configurableFields: boolean;
  customAliasFields: boolean;
  templateBased: boolean;
  versionedTemplate: boolean;
  digitalSignatureRequired: string;
  encryptionRequired: string;

  // Delivery
  deliveryChannels: string[];
  partialDeliverySupported: boolean;
  deliveryAckRequired: boolean;

  // Governance
  permissionRequired: boolean;
  consentRequired: string;
  auditRequired: boolean;
  pricingRequired: boolean;
  slaRequired: boolean;
}

export interface IProductFilter {
  keyword?: string;
  productType?: string;
  productGroup?: string;
  subjectType?: string;
  status?: string;
  effectiveDateRange?: [string, string] | null;
}
