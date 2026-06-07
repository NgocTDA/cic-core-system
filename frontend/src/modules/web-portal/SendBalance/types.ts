export type TrangThaiTep = 'TAO_MOI' | 'DA_GUI_CIC' | 'DA_TIEP_NHAN';

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
