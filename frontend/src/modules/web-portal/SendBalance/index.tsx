'use client';

import React, { useState } from 'react';
import {
  Tabs,
  Typography,
  Space,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Tooltip,
  Modal,
  Upload,
  message,
  Dropdown,
  Pagination,
  Alert,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
  InboxOutlined,
  MoreOutlined,
  EyeOutlined,
  DeleteOutlined,
  UndoOutlined,
  RightOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { colors, radius, shadows } from '@/design-system';
import PageLayout from '@/components/ui/PageLayout';
import SectionCard from '@/components/ui/SectionCard';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

// ─── TYPES & DATA MOCKS ─────────────────────────────────────────────

type TrangThaiTep = 'TAO_MOI' | 'DA_GUI_CIC' | 'DA_TIEP_NHAN';

interface BalanceReport {
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
interface ReconciliationDetailRow {
  key: string;
  loaiFile: string;
  tenTep: string;
  nghiepVu: string;
  nguonDuLieu: string;
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

// Cấu trúc thô của 11 file quy tắc trong ảnh để tự động sinh 68 dòng
interface FileRule {
  loaiFile: string;
  nghiepVuRaw: string;
  nguon: string;
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

const RAW_FILE_RULES: FileRule[] = [
  {
    loaiFile: 'D12',
    nghiepVuRaw: 'D12',
    nguon: 'TCTD',
    maTienTeRule: null,
    nhomNoRule: null,
    duNoRule: null,
    tongDuNoRule: 'LQ001',
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
    nghiepVuRaw: 'CHOVAY/CAMKETNB/NOXLRR/XUATTOAN/NHANUT',
    nguon: 'TCTD',
    maTienTeRule: 'KU009',
    nhomNoRule: 'KU012',
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
    nghiepVuRaw: 'CHOVAY/CAMKETNB/NOXLRR/XUATTOAN/NHANUT',
    nguon: 'TCTD',
    maTienTeRule: 'KU010',
    nhomNoRule: 'KU012',
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
    nghiepVuRaw: 'HOPDONG/THETDXLRR',
    nguon: 'TCTD',
    maTienTeRule: null,
    nhomNoRule: 'TH015',
    duNoRule: 'TH008',
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
    nghiepVuRaw: 'HOPDONG/THETDXLRR',
    nguon: 'TCTD',
    maTienTeRule: null,
    nhomNoRule: 'TH015',
    duNoRule: 'TH008',
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
    nghiepVuRaw: 'CHOVAY/NHANUT',
    nguon: 'TCTD',
    maTienTeRule: 'KU010',
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
    loaiFile: 'D40',
    nghiepVuRaw: 'D40',
    nguon: 'TCTD',
    maTienTeRule: 'VND',
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
    nghiepVuRaw: 'TRAIPHIEU/TRAIPHIEUXLRR',
    nguon: 'TCTD',
    maTienTeRule: 'TP010',
    nhomNoRule: 'TP024',
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
    nghiepVuRaw: 'D60',
    nguon: 'TCTD',
    maTienTeRule: 'VND',
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
    loaiFile: 'D36',
    nghiepVuRaw: 'CHOVAY/THE/TRAIPHIEU',
    nguon: 'TCTD',
    maTienTeRule: 'Mã tiền tệ',
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
    loaiFile: 'DKQ',
    nghiepVuRaw: 'TAISANCO/CAMKETNGB',
    nguon: 'TCTD',
    maTienTeRule: 'PL004',
    nhomNoRule: 'PL006',
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
const generateMockNhomNo = (op: string, currency: string | null): string => {
  const sumChar = op.length + (currency ? currency.length : 0);
  const num = (sumChar % 5) + 1;
  return `Nhóm ${num}`;
};

// Hàm sinh số tiền giả lập ổn định chuyên nghiệp (XAU đo bằng Lượng, VND/USD định dạng chuẩn)
const generateMockAmount = (min: number, max: number, op: string, currency: string | null): string => {
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
const generateMockJsonContent = (report: BalanceReport): string => {
  const baseJson = {
    Header: {
      PhanLoaiTep: report.phanLoaiTep,
      TenTep: report.tenTep,
      NgayGui: report.ngayGui,
      NgayBaoCao: report.ngayBaoCao,
      NguonDuLieu: "TCTD",
      MaDonVi: report.maDauMoi,
      TenDonVi: "NGÂN HÀNG TMCP ĐẦU TƯ VÀ PHÁT TRIỂN VIỆT NAM (BIDV)"
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
const generateTreeReconciliationData = (reports: BalanceReport[]): ReconciliationDetailRow[] => {
  const result: ReconciliationDetailRow[] = [];

  reports.forEach(report => {
    // 1. Tạo các dòng con cho report này
    const subRows: ReconciliationDetailRow[] = [];
    let keyIdx = 1;

    // Tìm cấu hình quy tắc tương ứng với loại tệp
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === report.phanLoaiTep) || {
      loaiFile: report.phanLoaiTep,
      nghiepVuRaw: report.phanLoaiTep,
      nguon: 'TCTD',
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

    // Tách nghiệp vụ (Quy tắc 1 & Quy tắc 2)
    const isNoDetails = rule.loaiFile === 'D12' || rule.loaiFile === 'D40' || rule.loaiFile === 'D60';
    const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

    operations.forEach(op => {
      // Tách tiền tệ (Quy tắc 3)
      const hasCurrency = rule.maTienTeRule !== null;
      const currencies = hasCurrency ? ['VND', 'USD', 'XAU'] : [null];

      currencies.forEach(currency => {
        subRows.push({
          key: `child_${report.key}_${keyIdx++}`,
          loaiFile: rule.loaiFile,
          tenTep: report.tenTep,
          nghiepVu: op,
          nguonDuLieu: rule.nguon,
          maTienTe: currency,
          maTienTeRule: rule.maTienTeRule,
          
          nhomNo: rule.nhomNoRule ? generateMockNhomNo(op, currency) : null,
          nhomNoRule: rule.nhomNoRule,

          duNo: rule.duNoRule ? generateMockAmount(5000000000, 120000000000, op, currency) : null,
          duNoRule: rule.duNoRule,

          tongDuNo: rule.tongDuNoRule ? generateMockAmount(100000000000, 950000000000, op, currency) : null,
          tongDuNoRule: rule.tongDuNoRule,

          phatSinhGiaiNgan: rule.phatSinhGiaiNganRule ? generateMockAmount(1000000000, 50000000000, op, currency) : null,
          phatSinhGiaiNganRule: rule.phatSinhGiaiNganRule,

          phatSinhTraNo: rule.phatSinhTraNoRule ? generateMockAmount(500000000, 30000000000, op, currency) : null,
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

          // Metadata tệp con (liên kết với tệp cha)
          parentKey: report.key,
          ngayBaoCao: report.ngayBaoCao,
          trangThai: report.trangThai,
          moTaTep: report.moTaTep,
          maDauMoi: report.maDauMoi || '31358001',
          isParent: false
        });
      });
    });

    // 2. Tạo dòng cha chứa các dòng con
    result.push({
      key: `parent_${report.key}`,
      loaiFile: report.phanLoaiTep,
      tenTep: report.tenTep,
      nghiepVu: `[Bấm mở rộng xem đối soát chi tiết]`,
      nguonDuLieu: "TCTD",
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

const INITIAL_DATA: BalanceReport[] = [
  {
    key: '1',
    stt: 1,
    ngayBaoCao: '31/08/2025',
    ngayGui: '31/08/2025 09:10:20',
    tenTep: 'D403135800120250831.001.JSON',
    phanLoaiTep: 'D40',
    moTaTep: 'Báo cáo cân đối tài chính BIDV kỳ tháng 8/2025',
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
  }
];


const SendBalanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [data, setData] = useState<BalanceReport[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);

  // Form states cho bộ lọc
  const [tenTepFilter, setTenTepFilter] = useState('');
  const [loaiTepFilter, setLoaiTepFilter] = useState<string[]>([]);
  const [trangThaiFilter, setTrangThaiFilter] = useState<string>('');

  // Upload states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadPhanLoai, setUploadPhanLoai] = useState('D40');
  const [uploadMoTa, setUploadMoTa] = useState('');
  const [jsonPreview, setJsonPreview] = useState<string | null>(null);

  // ─── ĐỐI CHIẾU SỐ LIỆU DETAIL MODAL STATES ──────────────────────────

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BalanceReport | null>(null);

  // ─── EVENT HANDLERS ────────────────────────────────────────────────

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...INITIAL_DATA];

      // Lọc theo Tên tệp (text field)
      if (tenTepFilter) {
        filtered = filtered.filter(item => 
          item.tenTep.toLowerCase().includes(tenTepFilter.toLowerCase())
        );
      }

      // Lọc theo Loại tệp (multi select)
      if (loaiTepFilter && loaiTepFilter.length > 0) {
        filtered = filtered.filter(item => 
          loaiTepFilter.includes(item.phanLoaiTep)
        );
      }

      // Lọc theo Trạng thái (droplist)
      if (trangThaiFilter) {
        filtered = filtered.filter(item => 
          item.trangThai === trangThaiFilter
        );
      }

      setData(filtered);
      setLoading(false);
      message.success('Đã hoàn tất tìm kiếm tệp báo cáo');
    }, 300);
  };

  const handleReset = () => {
    setTenTepFilter('');
    setLoaiTepFilter([]);
    setTrangThaiFilter('');
    setData(INITIAL_DATA);
    message.info('Đã xóa tất cả bộ lọc');
  };

  // ─── ACTION IMPLEMENTATION ─────────────────────────────────────────

  const handleViewDetail = (record: ReconciliationDetailRow) => {
    const parentReport = data.find(item => item.key === record.parentKey);
    if (parentReport) {
      setSelectedReport(parentReport);
      setDetailModalVisible(true);
    }
  };

  const handleRevoke = (record: BalanceReport) => {
    Modal.confirm({
      title: 'Xác nhận thu hồi tệp báo cáo',
      content: `Bạn có chắc chắn muốn thu hồi tệp ${record.tenTep}? Trạng thái tệp sẽ chuyển về "Tạo mới" để bạn chỉnh sửa hoặc xóa.`,
      okText: 'Thu hồi',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        setData(prev => prev.map(item => {
          if (item.key === record.key) {
            return { ...item, trangThai: 'TAO_MOI' };
          }
          return item;
        }));
        message.success(`Đã thu hồi tệp ${record.tenTep} thành công!`);
      }
    });
  };

  const handleDelete = (record: BalanceReport) => {
    Modal.confirm({
      title: 'Xác nhận xóa tệp báo cáo',
      content: `Bạn có chắc chắn muốn xóa vĩnh viễn tệp nháp ${record.tenTep}? Hành động này không thể hoàn tác.`,
      okText: 'Xóa vĩnh viễn',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        setData(prev => prev.filter(item => item.key !== record.key).map((item, idx) => ({ ...item, stt: idx + 1 })));
        message.success(`Đã xóa tệp báo cáo ${record.tenTep} thành công!`);
      }
    });
  };

  const handleUploadSubmit = (saveAsDraft: boolean) => {
    if (!selectedFile) {
      message.error('Vui lòng chọn hoặc kéo thả tệp JSON vào vùng tải lên!');
      return;
    }

    setUploadLoading(true);
    setTimeout(() => {
      const targetStatus: TrangThaiTep = saveAsDraft ? 'TAO_MOI' : 'DA_GUI_CIC';
      const newReport: BalanceReport = {
        key: String(data.length + 1),
        stt: data.length + 1,
        ngayBaoCao: '31/08/2025',
        ngayGui: saveAsDraft ? '-' : '02/06/2026 17:57:00',
        tenTep: selectedFile.name,
        phanLoaiTep: uploadPhanLoai,
        moTaTep: uploadMoTa || `Báo cáo nộp qua Portal - ${uploadPhanLoai}`,
        trangThai: targetStatus,
        maDauMoi: '31358001'
      };

      setData([newReport, ...data].map((item, idx) => ({ ...item, stt: idx + 1 })));
      setUploadLoading(false);
      setSelectedFile(null);
      setJsonPreview(null);
      setUploadMoTa('');
      
      Modal.success({
        title: saveAsDraft ? 'Đã lưu nháp báo cáo!' : 'Gửi báo cáo cân đối thành công!',
        content: saveAsDraft 
          ? `Tệp ${newReport.tenTep} đã được lưu dưới dạng "Tạo mới". Bạn có thể thu hồi hoặc xóa bất cứ lúc nào.`
          : `Tệp ${newReport.tenTep} đã được gửi lên CIC và đang chờ xử lý tiếp nhận.`,
        okText: 'Xem danh sách',
        onOk: () => {
          setActiveTab('search');
        }
      });
    }, 1200);
  };

  // ─── RENDER HELPERS FOR STATUS ────────────────────────────────────

  const renderTrangThaiText = (status: TrangThaiTep) => {
    if (status === 'TAO_MOI') return 'Tạo mới';
    if (status === 'DA_GUI_CIC') return 'Đã gửi CIC';
    return 'Đã tiếp nhận';
  };

  const renderTrangThaiTag = (status: TrangThaiTep) => {
    if (status === 'TAO_MOI') {
      return (
        <span style={{
          color: colors.primary[600],
          border: `1px solid ${colors.primary[300]}`,
          background: colors.primary[50],
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 650,
          whiteSpace: 'nowrap'
        }}>
          Tạo mới
        </span>
      );
    }
    if (status === 'DA_GUI_CIC') {
      return (
        <span style={{
          color: colors.warning.dark,
          border: `1px solid ${colors.warning.base}`,
          background: colors.warning.light,
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 650,
          whiteSpace: 'nowrap'
        }}>
          Đã gửi CIC
        </span>
      );
    }
    return (
      <span style={{
        color: '#ffffff',
        background: colors.success.base,
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 650,
        whiteSpace: 'nowrap'
      }}>
        Đã tiếp nhận
      </span>
    );
  };

  // ─── TABLE COLUMN DEFINITION WITH CONDITION ACTIONS ──────────────

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center' as const,
      fixed: 'left' as const,
      render: (_: any, record: ReconciliationDetailRow) => record.isParent ? record.stt : ""
    },
    {
      title: 'Tên tệp',
      dataIndex: 'tenTep',
      key: 'tenTep',
      width: 220,
      fixed: 'left' as const,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <span 
            style={{ 
              fontFamily: 'monospace', 
              fontSize: 12, 
              color: colors.subsystem.portal, 
              fontWeight: 600, 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
            onClick={() => handleViewDetail(record)}
          >
            {text}
          </span>
        );
      }
    },
    {
      title: 'Mã đầu mối báo cáo',
      dataIndex: 'maDauMoi',
      key: 'maDauMoi',
      width: 160,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => record.isParent ? <span style={{ color: colors.text.primary, fontWeight: 600 }}>{text}</span> : ""
    },
    {
      title: 'Ngày báo cáo',
      dataIndex: 'ngayBaoCao',
      key: 'ngayBaoCao',
      width: 120,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => record.isParent ? <span style={{ color: colors.text.secondary }}>{text}</span> : ""
    },
    {
      title: 'Loại file',
      dataIndex: 'loaiFile',
      key: 'loaiFile',
      width: 90,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => record.isParent ? <strong style={{ color: colors.text.primary }}>{text}</strong> : ""
    },
    {
      title: 'Nghiệp vụ',
      dataIndex: 'nghiepVu',
      key: 'nghiepVu',
      width: 140,
      render: (text: string, record: ReconciliationDetailRow) => record.isParent ? <span style={{ color: colors.text.placeholder, fontStyle: 'italic' }}>-</span> : <span style={{ fontWeight: 650, color: colors.primary[700] }}>{text}</span>
    },
    {
      title: 'Nguồn',
      dataIndex: 'nguonDuLieu',
      key: 'nguonDuLieu',
      width: 90,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => record.isParent ? "-" : text
    },
    {
      title: 'Mã tiền tệ',
      dataIndex: 'maTienTe',
      key: 'maTienTe',
      width: 100,
      align: 'center' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        if (!val) return <span style={{ color: '#bfbfbf' }}>-</span>;
        return (
          <Tooltip title={record.maTienTeRule || null}>
            <span style={{ 
              fontWeight: 700, 
              color: val === 'VND' ? colors.success.dark : val === 'USD' ? colors.primary[650] : '#d4b106',
              borderBottom: record.maTienTeRule ? '1px dashed #fa8c16' : 'none',
              cursor: record.maTienTeRule ? 'help' : 'default'
            }}>
              {val}
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: 'Nhóm nợ',
      dataIndex: 'nhomNo',
      key: 'nhomNo',
      width: 110,
      align: 'center' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.nhomNoRule)
    },
    {
      title: 'Dư nợ',
      dataIndex: 'duNo',
      key: 'duNo',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.duNoRule)
    },
    {
      title: 'Tổng dư nợ cấp tín dụng...',
      dataIndex: 'tongDuNo',
      key: 'tongDuNo',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.tongDuNoRule)
    },
    {
      title: 'Số tiền phát sinh giải ngân',
      dataIndex: 'phatSinhGiaiNgan',
      key: 'phatSinhGiaiNgan',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.phatSinhGiaiNganRule)
    },
    {
      title: 'Số tiền phát sinh trả nợ',
      dataIndex: 'phatSinhTraNo',
      key: 'phatSinhTraNo',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.phatSinhTraNoRule)
    },
    {
      title: 'Tổng giá trị bảo đảm',
      dataIndex: 'tongGiaTriBaoDam',
      key: 'tongGiaTriBaoDam',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.tongGiaTriBaoDamRule)
    },
    {
      title: 'Giá trị bảo đảm khoản vay',
      dataIndex: 'giaTriBaoDamKhoanVay',
      key: 'giaTriBaoDamKhoanVay',
      width: 170,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.giaTriBaoDamKhoanVayRule)
    },
    {
      title: 'Doanh số giảm nợ gốc...',
      dataIndex: 'doanhSoGiamNo',
      key: 'doanhSoGiamNo',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.doanhSoGiamNoRule)
    },
    {
      title: 'Dự phòng cụ thể phải trích',
      dataIndex: 'duPhongPhaiTrich',
      key: 'duPhongPhaiTrich',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.duPhongPhaiTrichRule)
    },
    {
      title: 'Dự phòng cụ thể đã trích',
      dataIndex: 'duPhongDaTrich',
      key: 'duPhongDaTrich',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => record.isParent ? "-" : renderReconciliationCell(val, record.duPhongDaTrichRule)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      align: 'center' as const,
      render: (status: TrangThaiTep, record: ReconciliationDetailRow) => record.isParent ? renderTrangThaiTag(status) : "",
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 95,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";

        const menuItems = [
          { key: 'view', label: 'Xem chi tiết', icon: <EyeOutlined /> }
        ];

        // Thu hồi (Chỉ hiển thị nếu trạng thái là Đã gửi CIC)
        if (record.trangThai === 'DA_GUI_CIC') {
          menuItems.push({
            key: 'revoke',
            label: 'Thu hồi',
            icon: <UndoOutlined style={{ color: colors.warning.dark }} />
          });
        }

        // Xóa (Chỉ hiển thị nếu trạng thái là Tạo mới)
        if (record.trangThai === 'TAO_MOI') {
          menuItems.push({
            key: 'delete',
            label: 'Xóa tệp nháp',
            icon: <DeleteOutlined style={{ color: colors.error.base }} />,
            // @ts-ignore
            danger: true
          });
        }

        const handleMenuClick = ({ key }: { key: string }) => {
          const parentReport = data.find(item => item.key === record.parentKey);
          if (!parentReport) return;

          if (key === 'view') handleViewDetail(record);
          if (key === 'revoke') handleRevoke(parentReport);
          if (key === 'delete') handleDelete(parentReport);
        };

        return (
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
            <Button type="text" shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        );
      }
    }
  ];

  // ─── RECONCILIATION CELL RENDERER ─────────────────

  const renderReconciliationCell = (value: string | null, ruleCode: string | null) => {
    if (!value) return <span style={{ color: '#bfbfbf' }}>-</span>;
    if (!ruleCode) return <span>{value}</span>;

    return (
      <Tooltip 
        title={ruleCode}
        placement="top"
        arrow
      >
        <span style={{ 
          cursor: 'help', 
          borderBottom: '1px dashed #fa8c16',
          color: colors.text.primary,
          fontWeight: 500,
          paddingBottom: 2
        }}>
          {value}
        </span>
      </Tooltip>
    );
  };

  // ─── DRAG AND DROP CONFIG ──────────────────────────────────────────

  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: '.json',
    showUploadList: false,
    beforeUpload: (file: any) => {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          setJsonPreview(JSON.stringify(content, null, 2));
          message.success(`Đọc cấu trúc file JSON ${file.name} thành công!`);
        } catch (err) {
          setJsonPreview(`[LỖI ĐỊNH DẠNG JSON]\nFile ${file.name} chứa cú pháp JSON không hợp lệ!`);
          message.warning('File tải lên không đúng chuẩn JSON. Vui lòng kiểm tra lại!');
        }
      };
      reader.readAsText(file);
      return false;
    }
  };

  return (
    <PageLayout noPadding>
      
      {/* CỤM TIÊU ĐỀ NGHIỆP VỤ */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.subsystem.portal}15 0%, rgba(255,255,255,0) 100%)`,
        padding: '24px 24px 8px',
        borderBottom: `1px solid ${colors.border.split}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Space direction="vertical" size={2}>
          <Title level={3} style={{ margin: 0, color: colors.subsystem.portal, fontWeight: 800 }}>
            GỬI THÔNG TIN CÂN ĐỐI
          </Title>
          <Text type="secondary">
            Cổng quản lý nộp và đối chiếu số liệu báo cáo tín dụng cân đối dành cho các Tổ chức tín dụng.
          </Text>
        </Space>
        
        {/* Cụm Tabs chuyển đổi nhanh */}
        <div style={{
          background: '#ffffff',
          padding: '4px',
          borderRadius: radius.lg,
          boxShadow: shadows.xs,
          border: `1px solid ${colors.border.split}`
        }}>
          <Button 
            type={activeTab === 'search' ? 'primary' : 'text'}
            style={{ 
              borderRadius: radius.md,
              background: activeTab === 'search' ? colors.subsystem.portal : 'transparent',
              borderColor: activeTab === 'search' ? colors.subsystem.portal : 'transparent',
            }}
            onClick={() => setActiveTab('search')}
          >
            Tra cứu tệp đã nộp
          </Button>
          <Button 
            type={activeTab === 'upload' ? 'primary' : 'text'}
            style={{ 
              borderRadius: radius.md,
              background: activeTab === 'upload' ? colors.subsystem.portal : 'transparent',
              borderColor: activeTab === 'upload' ? colors.subsystem.portal : 'transparent',
              marginLeft: 4
            }}
            onClick={() => setActiveTab('upload')}
            icon={<CloudUploadOutlined />}
          >
            Gửi báo cáo mới
          </Button>
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* ─── TAB 1: TRA CỨU BÁO CÁO ĐÃ NHẬP ──────────────────────────────── */}
        {activeTab === 'search' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            {/* Bộ lọc Tìm kiếm - Xếp đúng thứ tự từ trái qua phải */}
            <div style={{
              background: '#ffffff',
              borderRadius: radius.lg,
              border: `1px solid ${colors.border.split}`,
              boxShadow: shadows.xs,
              padding: 20,
              marginBottom: 16
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 16px',
                alignItems: 'center'
              }}>
                
                {/* 1. Tên tệp: text field */}
                <div style={{ flex: '2 1 200px', minWidth: 200 }}>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: colors.text.secondary, display: 'block', marginBottom: 4 }}>
                    Tên tệp
                  </Text>
                  <Input 
                    placeholder="Tìm theo tên tệp..." 
                    value={tenTepFilter} 
                    onChange={e => setTenTepFilter(e.target.value)} 
                    style={{ width: '100%' }}
                  />
                </div>

                {/* 2. Loại tệp: droplist, multi select */}
                <div style={{ flex: '2 1 220px', minWidth: 220 }}>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: colors.text.secondary, display: 'block', marginBottom: 4 }}>
                    Loại tệp
                  </Text>
                  <Select 
                    mode="multiple"
                    placeholder="Chọn loại tệp (chọn nhiều)..." 
                    value={loaiTepFilter} 
                    onChange={setLoaiTepFilter} 
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                  >
                    <Select.Option value="D12">D12 — Báo cáo dư nợ cấp tín dụng</Select.Option>
                    <Select.Option value="D31">D31 — Báo cáo dư nợ chi tiết TCTD</Select.Option>
                    <Select.Option value="D33">D33 — Báo cáo hợp đồng bảo đảm</Select.Option>
                    <Select.Option value="D35">D35 — Báo cáo doanh số giải ngân & trả nợ</Select.Option>
                    <Select.Option value="D40">D40 — Báo cáo cân đối tài chính</Select.Option>
                    <Select.Option value="D50">D50 — Báo cáo đầu tư trái phiếu</Select.Option>
                    <Select.Option value="D60">D60 — Báo cáo doanh số giảm nợ ngoại bảng</Select.Option>
                    <Select.Option value="D36">D36 — Báo cáo trích lập dự phòng</Select.Option>
                    <Select.Option value="DKQ">DKQ — Báo cáo phân loại nợ</Select.Option>
                  </Select>
                </div>

                {/* 3. Ngày báo cáo (từ ngày đến ngày) */}
                <div style={{ flex: '2 1 220px', minWidth: 220 }}>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: colors.text.secondary, display: 'block', marginBottom: 4 }}>
                    Ngày báo cáo
                  </Text>
                  <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" />
                </div>

                {/* 4. Ngày gửi (từ ngày đến ngày) */}
                <div style={{ flex: '2 1 220px', minWidth: 220 }}>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: colors.text.secondary, display: 'block', marginBottom: 4 }}>
                    Ngày gửi
                  </Text>
                  <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" />
                </div>

                {/* 5. Trạng thái: droplist */}
                <div style={{ flex: '1.5 1 160px', minWidth: 160 }}>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: colors.text.secondary, display: 'block', marginBottom: 4 }}>
                    Trạng thái
                  </Text>
                  <Select value={trangThaiFilter} onChange={setTrangThaiFilter} style={{ width: '100%' }}>
                    <Select.Option value="">Tất cả</Select.Option>
                    <Select.Option value="TAO_MOI">Tạo mới</Select.Option>
                    <Select.Option value="DA_GUI_CIC">Đã gửi CIC</Select.Option>
                    <Select.Option value="DA_TIEP_NHAN">Đã tiếp nhận</Select.Option>
                  </Select>
                </div>

                {/* Cụm nút hành động tìm kiếm */}
                <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end', flexShrink: 0, paddingBottom: 2 }}>
                  <Tooltip title="Tải lại bảng dữ liệu">
                    <Button icon={<ReloadOutlined />} onClick={handleReset} />
                  </Tooltip>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={handleSearch}
                    loading={loading}
                    style={{
                      background: colors.subsystem.portal,
                      borderColor: colors.subsystem.portal
                    }}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </div>

            {/* Bảng danh sách rút gọn */}
            <SectionCard 
              flex 
              noPadding
              title="Danh sách tệp thông tin cân đối"
              count={`Hiển thị ${data.length} tệp tin nộp (Mở rộng dòng để xem chi tiết đối soát)`}
              extra={
                <Space>
                  <Button icon={<SettingOutlined />}>Cài đặt hiển thị</Button>
                  <Button 
                    icon={<FileExcelOutlined />} 
                    style={{ color: colors.success.dark, borderColor: colors.success.dark }}
                    onClick={() => message.success('Xuất dữ liệu Excel đối soát thành công!')}
                  >
                    Kết xuất Excel
                  </Button>
                </Space>
              }
            >
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <Table
                  dataSource={generateTreeReconciliationData(data)}
                  columns={columns}
                  pagination={false}
                  loading={loading}
                  size="middle"
                  scroll={{ x: 2500, y: 500 }}
                  bordered
                />
              </div>

              {/* Phân trang */}
              <div style={{
                padding: '16px 20px',
                borderTop: `1px solid ${colors.border.split}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13 }}>Hiển thị:</Text>
                  <Select defaultValue="10" style={{ width: 70 }} size="small">
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="20">20</Select.Option>
                    <Select.Option value="50">50</Select.Option>
                  </Select>
                  <Text style={{ fontSize: 13, color: colors.text.secondary, marginLeft: 8 }}>
                    kết quả | Từ 1 đến {data.length} trong tổng số {data.length} tệp tin báo cáo
                  </Text>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Pagination 
                    total={data.length} 
                    pageSize={20} 
                    current={1} 
                    showSizeChanger={false}
                    size="small"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: `1px solid ${colors.border.base}`, paddingLeft: 12 }}>
                    <Text style={{ fontSize: 13 }}>Go to:</Text>
                    <Input defaultValue="1" style={{ width: 45, textAlign: 'center' }} size="small" />
                    <Button 
                      type="primary" 
                      icon={<RightOutlined style={{ fontSize: 10 }} />} 
                      size="small"
                      style={{ 
                        width: 24, 
                        height: 24, 
                        padding: 0,
                        background: colors.subsystem.portal,
                        borderColor: colors.subsystem.portal
                      }} 
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ─── TAB 2: GỬI BÁO CÁO CÂN ĐỐI MỚI ─────────────────────────────── */}
        {activeTab === 'upload' && (
          <div style={{ 
            background: '#ffffff',
            borderRadius: radius.lg,
            border: `1px solid ${colors.border.split}`,
            boxShadow: shadows.xs,
            padding: '32px 40px',
            maxWidth: 800,
            margin: '0 auto',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <InboxOutlined style={{ fontSize: 48, color: colors.subsystem.portal }} />
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                Nộp tệp cân đối thông tin tín dụng mới
              </Title>
              <Text type="secondary">
                Vui lòng nộp các tệp cấu trúc chuẩn hóa (.JSON). Dung lượng tối đa hỗ trợ 50MB.
              </Text>
            </div>

            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Phân loại / Loại tệp báo cáo
                </Text>
                <Select value={uploadPhanLoai} onChange={setUploadPhanLoai} style={{ width: '100%' }} size="large">
                  <Select.Option value="D40">D40 — Báo cáo cân đối số liệu báo cáo tài chính</Select.Option>
                  <Select.Option value="D31">D31 — Báo cáo dư nợ chi tiết TCTD</Select.Option>
                  <Select.Option value="D12">D12 — Báo cáo dư nợ cấp tín dụng</Select.Option>
                  <Select.Option value="D33">D33 — Báo cáo hợp đồng bảo đảm</Select.Option>
                </Select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Mô tả thông tin gửi
              </Text>
              <Input 
                placeholder="Nhập mô tả tệp nộp (ví dụ: Báo cáo cân đối tài chính BIDV Kỳ báo cáo Tháng 08/2025)" 
                value={uploadMoTa}
                onChange={e => setUploadMoTa(e.target.value)}
                size="large"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Chọn tệp JSON cân đối tải lên
              </Text>
              <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined style={{ color: colors.subsystem.portal }} />
                </p>
                <p className="ant-upload-text">Nhấp để chọn tệp hoặc kéo thả file JSON vào đây</p>
                <p className="ant-upload-hint">Tên tệp mẫu chuẩn: D401135800120250831.001.JSON</p>
              </Dragger>

              {selectedFile && (
                <div style={{ 
                  marginTop: 12, 
                  padding: '8px 16px', 
                  background: colors.neutral[100], 
                  borderRadius: radius.md,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Space>
                    <Text strong>{selectedFile.name}</Text>
                    <Text type="secondary">({(selectedFile.size / 1024 / 1024).toFixed(3)} MB)</Text>
                  </Space>
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => {
                      setSelectedFile(null);
                      setJsonPreview(null);
                    }}
                  />
                </div>
              )}
            </div>

            {jsonPreview && (
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Cấu trúc file JSON đã nạp:
                </Text>
                <div style={{ 
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: 14,
                  borderRadius: radius.md,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  maxHeight: 180,
                  overflowY: 'auto',
                  border: '1px solid #334155',
                  whiteSpace: 'pre-wrap'
                }}>
                  {jsonPreview}
                </div>
              </div>
            )}

            {/* Lựa chọn Gửi hoặc Lưu nháp */}
            <div style={{ display: 'flex', gap: 16 }}>
              <Button 
                size="large" 
                onClick={() => handleUploadSubmit(true)}
                loading={uploadLoading}
                style={{
                  flex: 1,
                  height: 48,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: radius.md
                }}
              >
                LƯU NHÁP (TẠO MỚI)
              </Button>
              <Button 
                type="primary" 
                size="large" 
                icon={<CloudUploadOutlined />} 
                onClick={() => handleUploadSubmit(false)}
                loading={uploadLoading}
                style={{
                  flex: 2,
                  background: colors.subsystem.portal,
                  borderColor: colors.subsystem.portal,
                  height: 48,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: radius.md
                }}
              >
                GỬI NGAY (ĐÃ GỬI CIC)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL CẤU TRÚC TỆP TIN JSON GỐC ──────── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: colors.subsystem.portal, textTransform: 'uppercase' }}>
              Cấu trúc tệp dữ liệu báo cáo cân đối gốc (JSON)
            </span>
            {selectedReport && renderTrangThaiTag(selectedReport.trangThai)}
          </div>
        }
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)} style={{ background: colors.subsystem.portal, borderColor: colors.subsystem.portal }}>
            Đóng cửa sổ
          </Button>
        ]}
        bodyStyle={{ padding: '8px 24px 20px' }}
        style={{ top: 50 }}
        destroyOnClose
      >
        {selectedReport && (
          <div>
            {/* Thanh metadata của tệp */}
            <div style={{
              background: '#f8fafc',
              border: `1px solid ${colors.border.split}`,
              borderRadius: radius.md,
              padding: '12px 18px',
              marginBottom: 16,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16
            }}>
              <div>
                <Text style={{ fontSize: 13, color: colors.text.secondary }}>Tên tệp báo cáo nguồn: </Text>
                <strong style={{ fontFamily: 'monospace', color: colors.primary[700] }}>{selectedReport.tenTep}</strong>
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <Text style={{ fontSize: 13, color: colors.text.secondary }}>Kỳ báo cáo: </Text>
                  <strong>{selectedReport.ngayBaoCao}</strong>
                </div>
                <div>
                  <Text style={{ fontSize: 13, color: colors.text.secondary }}>Đơn vị gửi: </Text>
                  <strong>BIDV Hub (31358001)</strong>
                </div>
              </div>
            </div>

            {/* Trạng thái hợp lệ Alert */}
            <Alert
              message={
                <span style={{ fontWeight: 650, color: colors.success.dark }}>
                  CẤU TRÚC HỢP LỆ — Tệp dữ liệu đã vượt qua vòng kiểm duyệt cấu trúc JSON chuẩn hóa của CIC.
                </span>
              }
              type="success"
              showIcon
              style={{ marginBottom: 16, borderRadius: radius.md }}
            />

            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
              Xem nội dung tệp tin JSON gốc:
            </Text>
            <div style={{
              background: '#0f172a',
              color: '#38bdf8',
              padding: 18,
              borderRadius: radius.md,
              fontFamily: 'monospace',
              fontSize: 12,
              maxHeight: 400,
              overflowY: 'auto',
              border: '1px solid #334155',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6
            }}>
              {generateMockJsonContent(selectedReport)}
            </div>
          </div>
        )}
      </Modal>

    </PageLayout>
  );
};

export default SendBalanceModule;
