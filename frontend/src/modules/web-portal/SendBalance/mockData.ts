import { BalanceReport, FileRule, ReconciliationDetailRow, TrangThaiTep } from './types';

export const getLoaiToChucByMaDauMoi = (maDauMoi: string): string => {
  if (!maDauMoi) return 'TCTD';
  if (maDauMoi.startsWith('04')) {
    return 'Chi nhánh NH nước ngoài';
  }
  if (maDauMoi.startsWith('05')) {
    return 'Công ty tài chính';
  }
  return 'TCTD';
};

export const getFormattedDonViGui = (maDauMoi: string): string => {
  const code = maDauMoi || '31358001';
  let tenDonVi = 'Ngân hàng TMCP Tiên phong - Hội sở';
  if (code === '01201001') {
    tenDonVi = 'Ngân hàng TMCP Ngoại thương Việt Nam - Hội sở';
  } else if (code === '01203002') {
    tenDonVi = 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam - Hội sở';
  }
  return `${code} - ${tenDonVi}`;
};

export const RAW_FILE_RULES: FileRule[] = [
  {
    loaiFile: 'D10',
    tenLoaiFile: 'D10 — Thông tin định danh khách hàng vay phát sinh',
    nghiepVuRaw: 'D10',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL010',
    soLuongHopDongRule: null,
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D11',
    tenLoaiFile: 'D11 — Thông tin định danh khách hàng vay cuối tháng',
    nghiepVuRaw: 'D11',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL011',
    soLuongHopDongRule: null,
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D12',
    tenLoaiFile: 'D12 — Thông tin về người có liên quan của khách hàng vay',
    nghiepVuRaw: 'D12',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL012',
    soLuongHopDongRule: null,
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: 'KU010',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D20',
    tenLoaiFile: 'D20 — Thông tin tài chính khách hàng vay là doanh nghiệp',
    nghiepVuRaw: 'D20',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL020',
    soLuongHopDongRule: null,
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D31',
    tenLoaiFile: 'D31 — Thông tin quan hệ tín dụng rút gọn',
    nghiepVuRaw: 'CHOVAY/CAMKETNB/NOXLRR/XUATTOAN/NHANUT',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL031',
    soLuongHopDongRule: 'HD031',
    maTienTeRule: 'KU009',
    nhomNoRule: null,
    duNoRule: 'KU010',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D32',
    tenLoaiFile: 'D32 — Thông tin quan hệ tín dụng cuối tháng',
    nghiepVuRaw: 'CHOVAY/CAMKETNB/NOXLRR/XUATTOAN/NHANUT',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL032',
    soLuongHopDongRule: 'HD032',
    maTienTeRule: 'KU009',
    nhomNoRule: null,
    duNoRule: 'KU010',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D33',
    tenLoaiFile: 'D33 — Thông tin thẻ tín dụng rút gọn',
    nghiepVuRaw: 'HOPDONG/THETDXLRR',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL033',
    soLuongHopDongRule: 'HD033',
    maTienTeRule: 'KU009',
    nhomNoRule: null,
    duNoRule: 'KU010',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D34',
    tenLoaiFile: 'D34 — Thông tin thẻ tín dụng cuối tháng',
    nghiepVuRaw: 'HOPDONG/THETDXLRR',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL034',
    soLuongHopDongRule: 'HD034',
    maTienTeRule: 'KU009',
    nhomNoRule: null,
    duNoRule: 'KU010',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D35',
    tenLoaiFile: 'D35 — Thông tin thống kê tình hình giải ngân, trả nợ của khách hàng',
    nghiepVuRaw: 'CHOVAY/NHANUT',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL035',
    soLuongHopDongRule: 'HD035',
    maTienTeRule: 'KU009',
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: 'KU0281',
    phatSinhTraNoRule: 'KU0291',
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D36',
    tenLoaiFile: 'D36 — Thông tin trích lập dự phòng rủi ro cuối quý',
    nghiepVuRaw: 'CHOVAY/THE/TRAIPHIEU',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL036',
    soLuongHopDongRule: 'HD036',
    maTienTeRule: 'KU009',
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: 'KU026',
    duPhongDaTrichRule: 'KU027',
  },
  {
    loaiFile: 'D40',
    tenLoaiFile: 'D40 — Thông tin về biện pháp bảo đảm cấp tín dụng',
    nghiepVuRaw: 'D40',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL040',
    soLuongHopDongRule: 'HD040',
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: 'TS005',
    giaTriBaoDamKhoanVayRule: 'TS006',
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D50',
    tenLoaiFile: 'D50 — Thông tin mua và ủy thác mua trái phiếu doanh nghiệp (không bao gồm TCTD)',
    nghiepVuRaw: 'TRAIPHIEU/TRAIPHIEUXLRR',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL050',
    soLuongHopDongRule: 'HD050',
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: 'TP011',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D60',
    tenLoaiFile: 'D60 — Thông tin hoạt động xử lý nợ xấu nội bảng',
    nghiepVuRaw: 'D60',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL060',
    soLuongHopDongRule: null,
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: 'XLN02',
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'D70',
    tenLoaiFile: 'D70 — Thông tin dư nợ tại VAMC',
    nghiepVuRaw: 'D70',
    nguon: 'TCTD',
    soLuongKhachHangRule: 'SL070',
    soLuongHopDongRule: null,
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: 'VM005',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  },
  {
    loaiFile: 'DKQ',
    tenLoaiFile: 'DKQ — Báo cáo phân loại nợ & cam kết ngoại bảng',
    nghiepVuRaw: 'TAISANCO/CAMKETNGB',
    nguon: 'TCTD',
    soLuongKhachHangRule: null,
    soLuongHopDongRule: null,
    maTienTeRule: 'PL004',
    nhomNoRule: null,
    duNoRule: 'PL005',
    tongDuNoRule: null,
    phatSinhGiaiNganRule: null,
    phatSinhTraNoRule: null,
    tongGiaTriBaoDamRule: null,
    giaTriBaoDamKhoanVayRule: null,
    doanhSoGiamNoRule: null,
    duPhongPhaiTrichRule: null,
    duPhongDaTrichRule: null,
  }
];

// Hàm sinh mã nhóm nợ giả lập ổn định
/* export */ const generateMockNhomNo = (op: string, currency: string | null): string => {
  const sumChar = op.length + (currency ? currency.length : 0);
  const num = (sumChar % 5) + 1;
  return `Nhóm ${num}`;
};

// Hàm sinh số tiền giả lập ổn định chuyên nghiệp (XAU đo bằng Lượng, VND/USD định dạng chuẩn)
/* export */ const generateMockAmount = (min: number, max: number, op: string, currency: string | null): string => {
  const actualCurrency = currency || 'VND';
  const salt = op.charCodeAt(0) || 42;
  const factor = (salt % 10) / 10;
  const rawVal = min + (max - min) * factor;

  if (actualCurrency === 'XAU') {
    const goldTaels = Math.round(rawVal / 40000000);
    return goldTaels.toLocaleString('vi-VN');
  }
  if (actualCurrency === 'USD') {
    const usdVal = Math.round(rawVal / 25000);
    return usdVal.toLocaleString('vi-VN');
  }
  return Math.round(rawVal).toLocaleString('vi-VN');
};

// Hàm sinh cấu trúc JSON giả lập đẹp mắt cho Modal Xem chi tiết
/* export */ const generateMockJsonContent = (report: BalanceReport): string => {
  const baseJson = {
    Header: {
      PhanLoaiTep: report.phanLoaiTep,
      TenTep: report.tenTep,
      NgayGui: report.ngayGui,
      NgayBaoCao: report.ngayBaoCao,
      NguonDuLieu: "TCTD",
      MaDonVi: report.maDauMoi,
      TenDonVi: "NGÂN HÀNG TMCP TIÊN PHONG (TPBANK - Hội sở)"
    },
    DataPayload: {
      MoTa: report.moTaTep,
      TrangThai: report.trangThai,
      ChiTietDoiSoat: {
        QuyTacApDung: report.phanLoaiTep === 'D40' ? ['TS005', 'TS006'] : report.phanLoaiTep === 'D12' ? ['LQ001'] : ['KU009', 'KU010', 'KU012'],
        TongDoiSoatGiaoDich: 148,
        TrongNguongDungSai: true,
        DungSaiChoPhep: "0.01%"
      }
    }
  };
  return JSON.stringify(baseJson, null, 2);
};

// Hàm tạo Tree Data (dòng cha và dòng con) cho bảng chính
export const generateTreeReconciliationData = (reports: BalanceReport[]): ReconciliationDetailRow[] => {
  const result: ReconciliationDetailRow[] = [];

  reports.forEach(report => {
    const subRows: ReconciliationDetailRow[] = [];
    let keyIdx = 1;

    const rule = RAW_FILE_RULES.find(r => r.loaiFile === report.phanLoaiTep) || {
      loaiFile: report.phanLoaiTep,
      tenLoaiFile: report.phanLoaiTep,
      nghiepVuRaw: report.phanLoaiTep,
      nguon: 'TCTD',
      soLuongKhachHangRule: null,
      soLuongHopDongRule: null,
      maTienTeRule: null,
      nhomNoRule: null,
      duNoRule: null,
      tongDuNoRule: null,
      phatSinhGiaiNganRule: null,
      phatSinhTraNoRule: null,
      tongGiaTriBaoDamRule: null,
      giaTriBaoDamKhoanVayRule: null,
      doanhSoGiamNoRule: null,
      duPhongPhaiTrichRule: null,
      duPhongDaTrichRule: null,
    };

    const isNoDetails = ['D10', 'D11', 'D12', 'D20', 'D40', 'D60', 'D70'].includes(rule.loaiFile);
    const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

    operations.forEach(op => {
      const hasCurrency = rule.maTienTeRule !== null;
      const currencies = hasCurrency ? ['VND', 'USD', 'XAU'] : [null];

      currencies.forEach(currency => {
        subRows.push({
          key: `child_${report.key}_${keyIdx++}`,
          loaiFile: rule.loaiFile,
          tenTep: report.tenTep,
          nghiepVu: op,
          nguonDuLieu: getLoaiToChucByMaDauMoi(report.maDauMoi),

          soLuongKhachHang: rule.soLuongKhachHangRule ? String(100 + (op.length % 5) * 20) : null,
          soLuongKhachHangRule: rule.soLuongKhachHangRule,
          soLuongHopDong: rule.soLuongHopDongRule ? String(150 + (op.length % 5) * 40) : null,
          soLuongHopDongRule: rule.soLuongHopDongRule,

          maTienTe: currency,
          maTienTeRule: rule.maTienTeRule,

          nhomNo: null,
          nhomNoRule: null,

          duNo: rule.duNoRule ? generateMockAmount(5000000000, 120000000000, op, currency) : null,
          duNoRule: rule.duNoRule,

          tongDuNo: rule.tongDuNoRule ? generateMockAmount(100000000000, 950000000000, op, currency) : null,
          tongDuNoRule: rule.tongDuNoRule,

          phatSinhGiaiNgan: rule.phatSinhGiaiNganRule ? generateMockAmount(1000000000, 50000000000, op, currency) : null,
          phatSinhGiaiNganRule: rule.phatSinhGiaiNganRule,

          phatSinhTraNo: rule.phatSinhTraNoRule ? generateMockAmount(5000000500, 30000000000, op, currency) : null,
          phatSinhTraNoRule: rule.phatSinhTraNoRule,

          tongGiaTriBaoDam: rule.tongGiaTriBaoDamRule ? generateMockAmount(80000000000, 800000000000, op, currency) : null,
          tongGiaTriBaoDamRule: rule.tongGiaTriBaoDamRule,

          giaTriBaoDamKhoanVay: rule.giaTriBaoDamKhoanVayRule ? generateMockAmount(50000000000, 500000000000, op, currency) : null,
          giaTriBaoDamKhoanVayRule: rule.giaTriBaoDamKhoanVayRule,

          doanhSoGiamNo: rule.doanhSoGiamNoRule ? generateMockAmount(200000000, 15000000000, op, currency) : null,
          doanhSoGiamNoRule: rule.doanhSoGiamNoRule,

          duPhongPhaiTrich: rule.duPhongPhaiTrichRule ? generateMockAmount(10000000, 1500000000, op, currency) : null,
          duPhongPhaiTrichRule: rule.duPhongPhaiTrichRule,

          duPhongDaTrich: rule.duPhongDaTrichRule ? generateMockAmount(10000000, 1500000000, op, currency) : null,
          duPhongDaTrichRule: rule.duPhongDaTrichRule,

          parentKey: report.key,
          ngayBaoCao: report.ngayBaoCao,
          trangThai: report.trangThai,
          moTaTep: report.moTaTep,
          maDauMoi: report.maDauMoi || '31358001',
          isParent: false
        });
      });
    });

    result.push({
      key: `parent_${report.key}`,
      loaiFile: report.phanLoaiTep,
      tenTep: report.tenTep,
      nghiepVu: `[Bấm mở rộng xem đối soát chi tiết]`,
      nguonDuLieu: getLoaiToChucByMaDauMoi(report.maDauMoi),

      soLuongKhachHang: null,
      soLuongKhachHangRule: null,
      soLuongHopDong: null,
      soLuongHopDongRule: null,

      maTienTe: null,
      maTienTeRule: null,
      nhomNo: null,
      nhomNoRule: null,
      duNo: null,
      duNoRule: null,
      tongDuNo: null,
      tongDuNoRule: null,
      phatSinhGiaiNgan: null,
      phatSinhGiaiNganRule: null,
      phatSinhTraNo: null,
      phatSinhTraNoRule: null,
      tongGiaTriBaoDam: null,
      tongGiaTriBaoDamRule: null,
      giaTriBaoDamKhoanVay: null,
      giaTriBaoDamKhoanVayRule: null,
      doanhSoGiamNo: null,
      doanhSoGiamNoRule: null,
      duPhongPhaiTrich: null,
      duPhongPhaiTrichRule: null,
      duPhongDaTrich: null,
      duPhongDaTrichRule: null,

      stt: report.stt,
      parentKey: report.key,
      ngayBaoCao: report.ngayBaoCao,
      trangThai: report.trangThai,
      moTaTep: report.moTaTep,
      maDauMoi: report.maDauMoi || '31358001',
      isParent: true,
      children: subRows
    });
  });

  return result;
};

export const INITIAL_DATA: BalanceReport[] = [
  {
    key: '1',
    stt: 1,
    ngayBaoCao: '31/08/2025',
    ngayGui: '31/08/2025 09:10:20',
    tenTep: 'D403135800120250831.001.JSON',
    phanLoaiTep: 'D40',
    moTaTep: 'Báo cáo cân đối tài chính TPBANK kỳ tháng 8/2025',
    trangThai: 'TAO_MOI',
    maDauMoi: '31358001'
  },
  {
    key: '2',
    stt: 2,
    ngayBaoCao: '31/08/2025',
    ngayGui: '31/08/2025 10:20:15',
    tenTep: 'D313135800120250831.002.JSON',
    phanLoaiTep: 'D31',
    moTaTep: 'Báo cáo dư nợ chi tiết TCTD kỳ tháng 8/2025',
    trangThai: 'DA_GUI_CIC',
    maDauMoi: '31358001'
  },
  {
    key: '3',
    stt: 3,
    ngayBaoCao: '31/08/2025',
    ngayGui: '31/08/2025 08:30:00',
    tenTep: 'D123135800120250831.001.JSON',
    phanLoaiTep: 'D12',
    moTaTep: 'Báo cáo dư nợ cấp tín dụng kỳ tháng 8/2025',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '31358001'
  },
  {
    key: '4',
    stt: 4,
    ngayBaoCao: '15/08/2025',
    ngayGui: '15/08/2025 14:10:05',
    tenTep: 'D330120100120250815.001.JSON',
    phanLoaiTep: 'D33',
    moTaTep: 'Báo cáo hợp đồng bảo đảm kỳ phát sinh tháng 8/2025 (VCB)',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '01201001'
  },
  {
    key: '5',
    stt: 5,
    ngayBaoCao: '15/08/2025',
    ngayGui: '15/08/2025 14:15:20',
    tenTep: 'D353135800120250815.002.JSON',
    phanLoaiTep: 'D35',
    moTaTep: 'Báo cáo doanh số giải ngân và trả nợ - Bổ sung',
    trangThai: 'TAO_MOI',
    maDauMoi: '31358001'
  },
  {
    key: '6',
    stt: 6,
    ngayBaoCao: '31/05/2025',
    ngayGui: '31/05/2025 16:40:00',
    tenTep: 'D603135800120250531.001.JSON',
    phanLoaiTep: 'D60',
    moTaTep: 'Báo cáo doanh số giảm nợ ngoại bảng kỳ tháng 5/2025',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '31358001'
  },
  {
    key: '7',
    stt: 7,
    ngayBaoCao: '30/06/2025',
    ngayGui: '30/06/2025 11:15:00',
    tenTep: 'D500120300220250630.001.JSON',
    phanLoaiTep: 'D50',
    moTaTep: 'Báo cáo đầu tư trái phiếu doanh nghiệp kỳ tháng 6/2025',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '01203002'
  },
  {
    key: '8',
    stt: 8,
    ngayBaoCao: '15/07/2025',
    ngayGui: '15/07/2025 09:20:00',
    tenTep: 'D363135800120250715.001.JSON',
    phanLoaiTep: 'D36',
    moTaTep: 'Báo cáo trích lập dự phòng cụ thể kỳ tháng 7/2025',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '31358001'
  },
  {
    key: '9',
    stt: 9,
    ngayBaoCao: '30/04/2025',
    ngayGui: '30/04/2025 15:10:00',
    tenTep: 'DKQ3135800120250430.001.JSON',
    phanLoaiTep: 'DKQ',
    moTaTep: 'Báo cáo phân loại nợ & cam kết ngoại bảng kỳ tháng 4/2025',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '31358001'
  },
  {
    key: '10',
    stt: 10,
    ngayBaoCao: '31/08/2025',
    ngayGui: '31/08/2025 11:30:22',
    tenTep: 'D353135800120250831.003.JSON',
    phanLoaiTep: 'D35',
    moTaTep: 'Báo cáo doanh số giải ngân kỳ tháng 8/2025',
    trangThai: 'DA_GUI_CIC',
    maDauMoi: '31358001'
  },
  {
    key: '11',
    stt: 11,
    ngayBaoCao: '31/08/2025',
    ngayGui: '31/08/2025 14:05:44',
    tenTep: 'D400120100120250831.002.JSON',
    phanLoaiTep: 'D40',
    moTaTep: 'Báo cáo biện pháp bảo đảm kỳ tháng 8/2025 (VCB)',
    trangThai: 'DA_GUI_CIC',
    maDauMoi: '01201001'
  },
  {
    key: '12',
    stt: 12,
    ngayBaoCao: '30/09/2025',
    ngayGui: '30/09/2025 09:12:15',
    tenTep: 'D323135800120250930.001.JSON',
    phanLoaiTep: 'D32',
    moTaTep: 'Báo cáo quan hệ tín dụng kỳ tháng 9/2025',
    trangThai: 'TAO_MOI',
    maDauMoi: '31358001'
  },
  {
    key: '13',
    stt: 13,
    ngayBaoCao: '30/09/2025',
    ngayGui: '30/09/2025 10:15:30',
    tenTep: 'D100120300220250930.001.JSON',
    phanLoaiTep: 'D10',
    moTaTep: 'Báo cáo định danh khách hàng kỳ tháng 9/2025 (BIDV)',
    trangThai: 'DA_GUI_CIC',
    maDauMoi: '01203002'
  },
  {
    key: '14',
    stt: 14,
    ngayBaoCao: '15/09/2025',
    ngayGui: '15/09/2025 15:45:00',
    tenTep: 'D360120100120250915.001.JSON',
    phanLoaiTep: 'D36',
    moTaTep: 'Báo cáo dự phòng rủi ro kỳ tháng 9/2025 (VCB)',
    trangThai: 'DA_TIEP_NHAN',
    maDauMoi: '01201001'
  },
  {
    key: '15',
    stt: 15,
    ngayBaoCao: '15/09/2025',
    ngayGui: '15/09/2025 16:10:18',
    tenTep: 'D113135800120250915.001.JSON',
    phanLoaiTep: 'D11',
    moTaTep: 'Báo cáo định danh cuối tháng kỳ tháng 9/2025',
    trangThai: 'DA_GUI_CIC',
    maDauMoi: '31358001'
  }
];
