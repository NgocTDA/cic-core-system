// Luồng trạng thái báo cáo cân đối:
//   TAO_MOI       — TCTD soạn / lưu nháp (TCTD sửa được)
//   DA_GUI_CIC    — đã gửi, chờ CIC kiểm tra (CIC có thể sửa hộ)
//   DANG_KIEM_TRA — CIC đang kiểm tra, khóa toàn bộ chỉnh sửa
//   YEU_CAU_SUA   — CIC trả lại TCTD sửa (kèm lý do; TCTD sửa được)
//   DA_TIEP_NHAN  — kiểm tra đạt, trạng thái cuối
export type TrangThaiTep =
  | 'TAO_MOI'
  | 'DA_GUI_CIC'
  | 'DANG_KIEM_TRA'
  | 'YEU_CAU_SUA'
  | 'DA_TIEP_NHAN';

export interface BalanceReport {
  key: string;
  stt: number;
  ngayBaoCao: string;
  ngayGui: string;
  tenTep: string;
  phanLoaiTep: string;
  moTaTep: string;
  trangThai: TrangThaiTep;
  maDauMoi: string; // Mã đầu mối báo cáo
  lyDoTuChoi?: string; // Lý do CIC yêu cầu sửa (khi báo cáo bị trả về YEU_CAU_SUA)
}

// Interface của từng hàng đối chiếu số liệu chi tiết
export interface ReconciliationDetailRow {
  key: string;
  loaiFile: string;
  tenTep: string;
  nghiepVu: string;
  nguonDuLieu: string;

  soLuongKhachHang: string | null;
  soLuongKhachHangRule: string | null;
  soLuongHopDong: string | null;
  soLuongHopDongRule: string | null;

  maTienTe: string | null;
  maTienTeRule: string | null;
  nhomNo: string | null;
  nhomNoRule: string | null;
  duNo: string | null;
  duNoRule: string | null;
  tongDuNo: string | null;
  tongDuNoRule: string | null;
  phatSinhGiaiNgan: string | null;
  phatSinhGiaiNganRule: string | null;
  phatSinhTraNo: string | null;
  phatSinhTraNoRule: string | null;
  tongGiaTriBaoDam: string | null;
  tongGiaTriBaoDamRule: string | null;
  giaTriBaoDamKhoanVay: string | null;
  giaTriBaoDamKhoanVayRule: string | null;
  doanhSoGiamNo: string | null;
  doanhSoGiamNoRule: string | null;
  duPhongPhaiTrich: string | null;
  duPhongPhaiTrichRule: string | null;
  duPhongDaTrich: string | null;
  duPhongDaTrichRule: string | null;

  // Metadata tệp cha
  stt?: number;
  parentKey: string;
  ngayBaoCao: string;
  trangThai: TrangThaiTep;
  moTaTep: string;
  maDauMoi: string;
  isParent: boolean;
  children?: ReconciliationDetailRow[]; // Chứa các dòng đối soát con
}

// Cấu trúc thô của 11 file quy tắc để tự động sinh dòng
export interface FileRule {
  loaiFile: string;
  tenLoaiFile: string;
  nghiepVuRaw: string;
  nguon: string;
  soLuongKhachHangRule: string | null;
  soLuongHopDongRule: string | null;
  maTienTeRule: string | null;
  nhomNoRule: string | null;
  duNoRule: string | null;
  tongDuNoRule: string | null;
  phatSinhGiaiNganRule: string | null;
  phatSinhTraNoRule: string | null;
  tongGiaTriBaoDamRule: string | null;
  giaTriBaoDamKhoanVayRule: string | null;
  doanhSoGiamNoRule: string | null;
  duPhongPhaiTrichRule: string | null;
  duPhongDaTrichRule: string | null;
}

// ─── Nhãn + nhóm StatusTag cho từng trạng thái ───────────────
// Một nguồn sự thật duy nhất, dùng chung Portal và CIC.

// status key của <StatusTag> (xem STATUS_CONFIG)
export const TRANG_THAI_TAG: Record<TrangThaiTep, { statusKey: string; label: string }> = {
  TAO_MOI:       { statusKey: 'RUNNING',  label: 'Tạo mới' },
  DA_GUI_CIC:    { statusKey: 'PENDING',  label: 'Chờ kiểm tra' },
  DANG_KIEM_TRA: { statusKey: 'REVIEWING', label: 'Đang kiểm tra' },
  YEU_CAU_SUA:   { statusKey: 'FAILED',   label: 'Yêu cầu sửa' },
  DA_TIEP_NHAN:  { statusKey: 'APPROVED', label: 'Đã tiếp nhận' },
};

// TCTD (Portal) được sửa số liệu khi báo cáo ở nháp hoặc bị trả lại.
export const canTctdEdit = (status: TrangThaiTep): boolean =>
  status === 'TAO_MOI' || status === 'YEU_CAU_SUA';

// CIC được sửa hộ khi báo cáo đang chờ kiểm tra (chưa khóa).
// Khi DANG_KIEM_TRA hoặc DA_TIEP_NHAN thì khóa.
export const canCicEdit = (status: TrangThaiTep): boolean =>
  status === 'DA_GUI_CIC';
