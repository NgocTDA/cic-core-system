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
  Popover,
  Checkbox,
  AutoComplete,
} from 'antd';
import dayjs from 'dayjs';
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
  InfoCircleOutlined,
  StopOutlined,
  PlusOutlined,
  HolderOutlined
} from '@ant-design/icons';
import { colors, radius, shadows } from '@/design-system';
import {
  PageLayout,
  FilterBar,
  FilterCol,
  SectionCard,
  StatusTag,
  ActionMenu,
  CodeText,
  tablePagination
} from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';

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

// Cấu trúc thô của 11 file quy tắc trong ảnh để tự động sinh 68 dòng
interface FileRule {
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

const getLoaiToChucByMaDauMoi = (maDauMoi: string): string => {
  if (!maDauMoi) return 'TCTD';
  if (maDauMoi.startsWith('04')) {
    return 'Chi nhánh NH nước ngoài';
  }
  if (maDauMoi.startsWith('05')) {
    return 'Công ty tài chính';
  }
  return 'TCTD';
};

const RAW_FILE_RULES: FileRule[] = [
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
const generateTreeReconciliationData = (reports: BalanceReport[]): ReconciliationDetailRow[] => {
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

const INITIAL_DATA: BalanceReport[] = [
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
  }
];

interface EditableCellProps {
  value: any;
  onChange: (val: any) => void;
  type?: 'text' | 'select';
  selectOptions?: { value: string; label: string }[];
  style?: React.CSSProperties;
  record: ReconciliationDetailRow;
  ruleCode?: string | null;
  renderDisplay?: (val: any) => React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  type = 'text',
  selectOptions = [],
  style = {},
  record,
  ruleCode = null,
  renderDisplay
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    onChange(tempValue);
  };

  const isEditable = record.trangThai === 'TAO_MOI';

  if (!editing) {
    return (
      <div
        style={{
          cursor: isEditable ? 'pointer' : 'default',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: style.textAlign === 'right' ? 'flex-end' : style.textAlign === 'center' ? 'center' : 'flex-start',
          width: '100%',
          padding: '2px 4px',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          ...style
        }}
        onClick={() => {
          if (isEditable) setEditing(true);
        }}
        className={isEditable ? "editable-cell-hover" : ""}
      >
        {renderDisplay ? renderDisplay(value) : (
          ruleCode ? (
            <Tooltip title={ruleCode} placement="top" arrow>
              <span style={{
                cursor: 'help',
                borderBottom: '1px dashed #fa8c16',
                color: colors.text.primary,
                fontWeight: 500,
                paddingBottom: 2
              }}>
                {value || <span style={{ color: '#bfbfbf' }}>-</span>}
              </span>
            </Tooltip>
          ) : (
            value || <span style={{ color: '#bfbfbf' }}>-</span>
          )
        )}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <Select
        value={tempValue}
        onChange={(val) => {
          setTempValue(val);
          onChange(val);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        autoFocus
        open
        style={{ width: '100%' }}
        size="small"
      >
        {selectOptions.map(opt => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    );
  }

  return (
    <Input
      value={tempValue || ''}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleSave}
      onPressEnter={handleSave}
      autoFocus
      size="small"
      style={{ width: '100%', ...style }}
    />
  );
};

const columnOptions = [
  { key: 'stt', label: 'STT', disabled: true },
  { key: 'nguonDuLieu', label: 'Nguồn', disabled: false },
  { key: 'tenTep', label: 'Tên tệp', disabled: false },
  { key: 'maDauMoi', label: 'Mã đầu mối', disabled: true },
  { key: 'ngayBaoCao', label: 'Ngày báo cáo', disabled: true },
  { key: 'loaiFile', label: 'Loại file', disabled: true },
  { key: 'nghiepVu', label: 'Nghiệp vụ', disabled: false },
  { key: 'soLuongKhachHang', label: 'Số lượng khách hàng', disabled: false },
  { key: 'soLuongHopDong', label: 'Số lượng hợp đồng', disabled: false },
  { key: 'maTienTe', label: 'Mã tiền tệ', disabled: false },
  { key: 'duNo', label: 'Dư nợ', disabled: false },
  { key: 'tongDuNo', label: 'Tổng dư nợ', disabled: false },
  { key: 'phatSinhGiaiNgan', label: 'Số tiền giải ngân', disabled: false },
  { key: 'phatSinhTraNo', label: 'Số tiền trả nợ', disabled: false },
  { key: 'tongGiaTriBaoDam', label: 'Giá trị tài sản bảo đảm', disabled: false },
  { key: 'giaTriBaoDamKhoanVay', label: 'Giá trị bảo đảm khoản vay', disabled: false },
  { key: 'doanhSoGiamNo', label: 'Doanh số giảm', disabled: false },
  { key: 'duPhongPhaiTrich', label: 'Dự phòng phải trích nội bảng', disabled: false },
  { key: 'duPhongDaTrich', label: 'Dự phòng đã trích nội bảng', disabled: false },
  { key: 'trangThai', label: 'Trạng thái', disabled: false },
];

const SendBalanceModule: React.FC = () => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [data, setData] = useState<BalanceReport[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);

  useHeaderActions({
    title: 'Danh sách báo cáo thông tin cân đối',
    actions: [
      {
        key: 'add',
        label: 'Gửi báo cáo mới',
        icon: <CloudUploadOutlined />,
        type: 'primary',
        onClick: () => {
          setUploadModalVisible(true);
          handleResetForm();
        }
      }
    ]
  }, []);

  // States cho thứ tự cột của 3 bảng
  const [mainColumnOrder, setMainColumnOrder] = useState<string[]>([
    'stt', 'nguonDuLieu', 'tenTep', 'maDauMoi', 'ngayBaoCao', 'loaiFile', 'nghiepVu',
    'soLuongKhachHang', 'soLuongHopDong', 'maTienTe', 'duNo', 'tongDuNo', 'phatSinhGiaiNgan',
    'phatSinhTraNo', 'tongGiaTriBaoDam', 'giaTriBaoDamKhoanVay', 'doanhSoGiamNo',
    'duPhongPhaiTrich', 'duPhongDaTrich', 'trangThai', 'action'
  ]);

  const [editColumnOrder, setEditColumnOrder] = useState<string[]>([
    'stt', 'nguonDuLieu', 'nghiepVu', 'soLuongKhachHang', 'soLuongHopDong', 'maTienTe',
    'duNo', 'tongDuNo', 'phatSinhGiaiNgan', 'phatSinhTraNo', 'tongGiaTriBaoDam',
    'giaTriBaoDamKhoanVay', 'doanhSoGiamNo', 'duPhongPhaiTrich', 'duPhongDaTrich', 'action'
  ]);

  const [detailColumnOrder, setDetailColumnOrder] = useState<string[]>([
    'stt', 'nguonDuLieu', 'nghiepVu', 'soLuongKhachHang', 'soLuongHopDong', 'maTienTe',
    'duNo', 'tongDuNo', 'phatSinhGiaiNgan', 'phatSinhTraNo', 'tongGiaTriBaoDam',
    'giaTriBaoDamKhoanVay', 'doanhSoGiamNo', 'duPhongPhaiTrich', 'duPhongDaTrich'
  ]);

  const handleMainColumnReorder = (sourceKey: string, targetKey: string) => {
    setMainColumnOrder(prev => {
      const next = [...prev];
      const sourceIdx = next.indexOf(sourceKey);
      const targetIdx = next.indexOf(targetKey);
      if (sourceIdx !== -1 && targetIdx !== -1) {
        const [dragged] = next.splice(sourceIdx, 1);
        next.splice(targetIdx, 0, dragged);
      }
      return next;
    });
  };

  const handleEditColumnReorder = (sourceKey: string, targetKey: string) => {
    setEditColumnOrder(prev => {
      const next = [...prev];
      const sourceIdx = next.indexOf(sourceKey);
      const targetIdx = next.indexOf(targetKey);
      if (sourceIdx !== -1 && targetIdx !== -1) {
        const [dragged] = next.splice(sourceIdx, 1);
        next.splice(targetIdx, 0, dragged);
      }
      return next;
    });
  };

  const handleDetailColumnReorder = (sourceKey: string, targetKey: string) => {
    setDetailColumnOrder(prev => {
      const next = [...prev];
      const sourceIdx = next.indexOf(sourceKey);
      const targetIdx = next.indexOf(targetKey);
      if (sourceIdx !== -1 && targetIdx !== -1) {
        const [dragged] = next.splice(sourceIdx, 1);
        next.splice(targetIdx, 0, dragged);
      }
      return next;
    });
  };

  const renderDraggableHeader = (title: React.ReactNode, key: string, onReorder: (src: string, tgt: string) => void) => {
    return (
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', key);
          e.currentTarget.style.opacity = '0.5';
        }}
        onDragEnd={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          const sourceKey = e.dataTransfer.getData('text/plain');
          const targetKey = key;
          if (sourceKey !== targetKey) {
            onReorder(sourceKey, targetKey);
          }
        }}
        style={{
          cursor: 'grab',
          userSelect: 'none',
          display: 'block',
          width: '100%',
          textAlign: 'center',
          padding: '4px 0'
        }}
        className="draggable-col-header"
      >
        {title}
      </div>
    );
  };

  // Form states cho bộ lọc
  const [tenTepFilter, setTenTepFilter] = useState('');
  const [loaiTepFilter, setLoaiTepFilter] = useState<string[]>([]);
  const [trangThaiFilter, setTrangThaiFilter] = useState<string>('');
  const [columnSearchTerm, setColumnSearchTerm] = useState('');

  // Upload & Form Nhập thông tin cân đối states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMaDauMoi, setUploadMaDauMoi] = useState('31358001');
  const [uploadPhanLoai, setUploadPhanLoai] = useState('D40');
  const [uploadNgayBaoCao, setUploadNgayBaoCao] = useState<dayjs.Dayjs | null>(dayjs('31/08/2025', 'DD/MM/YYYY'));
  const [uploadTenTep, setUploadTenTep] = useState('');
  const [editDetails, setEditDetails] = useState<ReconciliationDetailRow[]>([]);
  const [customDetailsMap, setCustomDetailsMap] = useState<Record<string, ReconciliationDetailRow[]>>({});
  const [loadedExistingReport, setLoadedExistingReport] = useState<BalanceReport | null>(null);
  const isReadOnly = loadedExistingReport ? loadedExistingReport.trangThai !== 'TAO_MOI' : false;

  const getAutoGeneratedFileName = (
    loaiTep: string,
    maDauMoi: string,
    ngayBaoCao: dayjs.Dayjs | null,
    ext: string = 'JSON'
  ) => {
    if (!ngayBaoCao) return '';
    const dateStr = ngayBaoCao.format('YYYYMMDD');
    const prefix = `${loaiTep}${maDauMoi}${dateStr}`;

    const matching = data.filter(item =>
      item.phanLoaiTep === loaiTep &&
      item.maDauMoi === maDauMoi &&
      item.ngayBaoCao === ngayBaoCao.format('DD/MM/YYYY')
    );

    let nextSeq = 1;
    if (matching.length > 0) {
      const seqs = matching.map(item => {
        const parts = item.tenTep.split('.');
        if (parts.length >= 2) {
          const seqNum = parseInt(parts[parts.length - 2], 10);
          return isNaN(seqNum) ? 0 : seqNum;
        }
        return 0;
      });
      const maxSeq = Math.max(...seqs, 0);
      nextSeq = maxSeq + 1;
    }

    const seqStr = String(nextSeq).padStart(3, '0');
    return `${prefix}.${seqStr}.${ext}`;
  };

  const validateFileName = (fileName: string): string | null => {
    const name = fileName.trim();
    if (!name) return 'Vui lòng nhập hoặc chọn Tên tệp!';

    const parts = name.split('.');
    if (parts.length !== 3) {
      return 'Tên tệp phải gồm đúng 3 thành phần phân tách bởi dấu chấm: [Tên].[Số thứ tự zzz].[Định dạng (JSON/XLS/XLSX)]';
    }

    const [ten, zzz, ext] = parts;

    const expectedPrefix = `${uploadPhanLoai}${uploadMaDauMoi}${uploadNgayBaoCao ? uploadNgayBaoCao.format('YYYYMMDD') : ''}`;
    if (ten !== expectedPrefix) {
      return `Thành phần Tên tệp phải là "${expectedPrefix}" khớp với các thông tin chung đã chọn!`;
    }

    if (!/^\d{3}$/.test(zzz)) {
      return 'Thành phần Số thứ tự phải gồm đúng 3 chữ số (ví dụ: 001, 002)!';
    }

    const upperExt = ext.toUpperCase();
    if (upperExt !== 'JSON' && upperExt !== 'XLS' && upperExt !== 'XLSX') {
      return 'Định dạng tệp (đuôi tệp) phải là JSON, XLS hoặc XLSX!';
    }

    return null;
  };

  const isFixedColumn = (key: string) => {
    return ['stt', 'nguonDuLieu', 'tenTep', 'action'].includes(key);
  };

  // ─── ĐỐI CHIẾU SỐ LIỆU DETAIL MODAL STATES ──────────────────────────

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BalanceReport | null>(null);

  // ─── CUSTOM STATES FOR COLUMN VISIBILITY & INLINE EDITING ──────────
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'stt',
    'nguonDuLieu',
    'tenTep',
    'maDauMoi',
    'ngayBaoCao',
    'loaiFile',
    'nghiepVu',
    'soLuongKhachHang',
    'soLuongHopDong',
    'maTienTe',
    'duNo',
    'tongDuNo',
    'phatSinhGiaiNgan',
    'phatSinhTraNo',
    'tongGiaTriBaoDam',
    'giaTriBaoDamKhoanVay',
    'doanhSoGiamNo',
    'duPhongPhaiTrich',
    'duPhongDaTrich',
    'trangThai',
    'action'
  ]);

  const [treeData, setTreeData] = useState<ReconciliationDetailRow[]>([]);

  React.useEffect(() => {
    const generated = generateTreeReconciliationData(data);
    const finalTree = generated.map(parent => {
      const custom = customDetailsMap[parent.parentKey];
      if (custom) {
        return {
          ...parent,
          children: custom.map(child => ({
            ...child,
            parentKey: parent.parentKey,
            tenTep: parent.tenTep,
            ngayBaoCao: parent.ngayBaoCao,
            trangThai: parent.trangThai,
            maDauMoi: parent.maDauMoi,
          }))
        };
      }
      return parent;
    });
    setTreeData(finalTree);
  }, [data, customDetailsMap]);

  const handleCellEdit = (
    rowKey: string,
    dataIndex: keyof ReconciliationDetailRow,
    value: any
  ) => {
    if (rowKey.startsWith('parent_')) {
      const parentKey = rowKey.replace('parent_', '');
      setData(prev => prev.map(item => {
        if (item.key === parentKey) {
          let reportField: keyof BalanceReport | null = null;
          if (dataIndex === 'tenTep') reportField = 'tenTep';
          if (dataIndex === 'maDauMoi') reportField = 'maDauMoi';
          if (dataIndex === 'ngayBaoCao') reportField = 'ngayBaoCao';
          if (dataIndex === 'loaiFile') reportField = 'phanLoaiTep';
          if (dataIndex === 'trangThai') reportField = 'trangThai';

          if (reportField) {
            return { ...item, [reportField]: value };
          }
        }
        return item;
      }));
    } else {
      let foundParentKey = '';
      treeData.forEach(parent => {
        if (parent.children?.some(child => child.key === rowKey)) {
          foundParentKey = parent.parentKey;
        }
      });

      if (foundParentKey) {
        setCustomDetailsMap(prev => {
          let currentChildren = prev[foundParentKey];
          if (!currentChildren) {
            const parentRow = treeData.find(item => item.parentKey === foundParentKey && item.isParent);
            currentChildren = parentRow?.children ? [...parentRow.children] : [];
          }
          const updatedChildren = currentChildren.map(child => {
            if (child.key === rowKey) {
              return { ...child, [dataIndex]: value };
            }
            return child;
          });
          return { ...prev, [foundParentKey]: updatedChildren };
        });
      }
    }
  };

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
      message.success('Đã hoàn tất tìm kiếm');
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

  const generateEmptyEditDetails = (loaiFile: string): ReconciliationDetailRow[] => {
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === loaiFile);
    if (!rule) return [];

    const subRows: ReconciliationDetailRow[] = [];
    let keyIdx = 1;
    const isNoDetails = ['D10', 'D11', 'D12', 'D20', 'D40', 'D60', 'D70'].includes(rule.loaiFile);
    const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

    operations.forEach(op => {
      const hasCurrency = rule.maTienTeRule !== null;
      const currencies = hasCurrency ? ['VND'] : [null];

      currencies.forEach(currency => {
        subRows.push({
          key: `edit_child_${keyIdx++}`,
          loaiFile: rule.loaiFile,
          tenTep: '',
          nghiepVu: op,
          nguonDuLieu: getLoaiToChucByMaDauMoi(uploadMaDauMoi),

          soLuongKhachHang: null,
          soLuongKhachHangRule: rule.soLuongKhachHangRule,
          soLuongHopDong: null,
          soLuongHopDongRule: rule.soLuongHopDongRule,

          maTienTe: currency,
          maTienTeRule: rule.maTienTeRule,

          nhomNo: null,
          nhomNoRule: null,

          duNo: null,
          duNoRule: rule.duNoRule,

          tongDuNo: null,
          tongDuNoRule: rule.tongDuNoRule,

          phatSinhGiaiNgan: null,
          phatSinhGiaiNganRule: rule.phatSinhGiaiNganRule,

          phatSinhTraNo: null,
          phatSinhTraNoRule: rule.phatSinhTraNoRule,

          tongGiaTriBaoDam: null,
          tongGiaTriBaoDamRule: rule.tongGiaTriBaoDamRule,

          giaTriBaoDamKhoanVay: null,
          giaTriBaoDamKhoanVayRule: rule.giaTriBaoDamKhoanVayRule,

          doanhSoGiamNo: null,
          doanhSoGiamNoRule: rule.doanhSoGiamNoRule,

          duPhongPhaiTrich: null,
          duPhongPhaiTrichRule: rule.duPhongPhaiTrichRule,

          duPhongDaTrich: null,
          duPhongDaTrichRule: rule.duPhongDaTrichRule,

          parentKey: '',
          ngayBaoCao: '',
          trangThai: 'TAO_MOI',
          moTaTep: '',
          maDauMoi: '31358001',
          isParent: false
        });
      });
    });

    return subRows;
  };

  React.useEffect(() => {
    if (!uploadNgayBaoCao) {
      setLoadedExistingReport(null);
      setEditDetails(generateEmptyEditDetails(uploadPhanLoai));
      return;
    }

    const formattedDate = uploadNgayBaoCao.format('DD/MM/YYYY');
    const existing = data.find(item =>
      item.maDauMoi === uploadMaDauMoi &&
      item.phanLoaiTep === uploadPhanLoai &&
      item.ngayBaoCao === formattedDate
    );

    if (existing) {
      setLoadedExistingReport(existing);
      setUploadTenTep(existing.tenTep);

      const custom = customDetailsMap[existing.key];
      if (custom) {
        setEditDetails(custom);
      } else {
        const parentRow = generateTreeReconciliationData([existing]).find(item => item.isParent);
        if (parentRow && parentRow.children) {
          setEditDetails(parentRow.children);
        } else {
          setEditDetails(generateEmptyEditDetails(uploadPhanLoai));
        }
      }
    } else {
      setLoadedExistingReport(null);
      const generatedName = getAutoGeneratedFileName(uploadPhanLoai, uploadMaDauMoi, uploadNgayBaoCao);
      setUploadTenTep(generatedName);
      setEditDetails(generateEmptyEditDetails(uploadPhanLoai));
    }
  }, [uploadPhanLoai, uploadNgayBaoCao, data, uploadMaDauMoi]);

  const getFilteredFileNames = () => {
    const dateStr = uploadNgayBaoCao ? uploadNgayBaoCao.format('DD/MM/YYYY') : '';
    return data
      .filter(item =>
        item.maDauMoi === uploadMaDauMoi &&
        item.phanLoaiTep === uploadPhanLoai &&
        (!dateStr || item.ngayBaoCao === dateStr)
      )
      .map(item => ({ value: item.tenTep }));
  };

  const handleLoadLatestData = () => {
    const matchingReports = data.filter(item =>
      item.maDauMoi === uploadMaDauMoi &&
      item.phanLoaiTep === uploadPhanLoai
    );

    if (matchingReports.length === 0) {
      message.warning(`Không tìm thấy dữ liệu kỳ trước cho mã đầu mối ${uploadMaDauMoi} và loại tệp ${uploadPhanLoai}`);
      return;
    }

    let latestReport = matchingReports[0];
    let latestDate = dayjs(latestReport.ngayBaoCao, 'DD/MM/YYYY');

    for (let i = 1; i < matchingReports.length; i++) {
      const d = dayjs(matchingReports[i].ngayBaoCao, 'DD/MM/YYYY');
      if (d.isAfter(latestDate)) {
        latestDate = d;
        latestReport = matchingReports[i];
      }
    }

    const parentRow = treeData.find(item => item.parentKey === latestReport.key && item.isParent);
    if (parentRow && parentRow.children) {
      const newDetails = parentRow.children.map((child, index) => ({
        ...child,
        key: `edit_child_latest_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`,
        tenTep: uploadTenTep,
        parentKey: '',
        trangThai: 'TAO_MOI' as TrangThaiTep,
        maDauMoi: uploadMaDauMoi
      }));
      setEditDetails(newDetails);
      message.success(`Đã tải dữ liệu cân đối gần nhất từ kỳ báo cáo ngày ${latestReport.ngayBaoCao}`);
    } else {
      message.warning(`Không tìm thấy chi tiết đối soát của kỳ ngày ${latestReport.ngayBaoCao}`);
    }
  };

  const handleResetForm = () => {
    setUploadPhanLoai('D40');
    setUploadNgayBaoCao(dayjs('31/08/2025', 'DD/MM/YYYY'));
    setUploadTenTep('');
    setEditDetails(generateEmptyEditDetails('D40'));
  };

  const handleCancelUpload = () => {
    handleResetForm();
    setUploadModalVisible(false);
  };

  const handleSaveReport = (saveAsDraft: boolean) => {
    if (!uploadTenTep.trim()) {
      message.error('Vui lòng nhập hoặc chọn Tên tệp!');
      return;
    }
    if (!uploadNgayBaoCao) {
      message.error('Vui lòng chọn Ngày báo cáo!');
      return;
    }

    const validationError = validateFileName(uploadTenTep);
    if (validationError) {
      message.error(validationError);
      return;
    }

    setUploadLoading(true);
    setTimeout(() => {
      const targetStatus: TrangThaiTep = saveAsDraft ? 'TAO_MOI' : 'DA_GUI_CIC';
      const formattedDate = uploadNgayBaoCao.format('DD/MM/YYYY');

      if (loadedExistingReport) {
        // Update existing record
        const reportKey = loadedExistingReport.key;
        setData(prev => prev.map(item => {
          if (item.key === reportKey) {
            return {
              ...item,
              ngayGui: saveAsDraft ? item.ngayGui : dayjs().format('DD/MM/YYYY HH:mm:ss'),
              tenTep: uploadTenTep.trim(),
              trangThai: targetStatus,
            };
          }
          return item;
        }));

        setCustomDetailsMap(prev => ({
          ...prev,
          [reportKey]: editDetails.map((row, index) => ({
            ...row,
            key: `child_${reportKey}_${index + 1}`,
            parentKey: reportKey,
            tenTep: uploadTenTep.trim(),
            ngayBaoCao: formattedDate,
            trangThai: targetStatus,
            maDauMoi: uploadMaDauMoi
          }))
        }));
      } else {
        // Create new record
        const newReport: BalanceReport = {
          key: String(data.length + 1),
          stt: data.length + 1,
          ngayBaoCao: formattedDate,
          ngayGui: saveAsDraft ? '-' : dayjs().format('DD/MM/YYYY HH:mm:ss'),
          tenTep: uploadTenTep.trim(),
          phanLoaiTep: uploadPhanLoai,
          moTaTep: `Báo cáo cân đối thông tin tín dụng loại ${uploadPhanLoai}`,
          trangThai: targetStatus,
          maDauMoi: uploadMaDauMoi
        };

        setCustomDetailsMap(prev => ({
          ...prev,
          [newReport.key]: editDetails.map((row, index) => ({
            ...row,
            key: `child_${newReport.key}_${index + 1}`,
            parentKey: newReport.key,
            tenTep: newReport.tenTep,
            ngayBaoCao: newReport.ngayBaoCao,
            trangThai: newReport.trangThai,
            maDauMoi: newReport.maDauMoi
          }))
        }));

        setData([newReport, ...data].map((item, idx) => ({ ...item, stt: idx + 1 })));
      }
      setUploadLoading(false);

      message.success(saveAsDraft ? 'Đã lưu nháp báo cáo thành công!' : 'Đã lưu và gửi báo cáo lên CIC thành công!');
      handleResetForm();
      setUploadModalVisible(false);
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
      return <StatusTag status="RUNNING" label="Tạo mới" />;
    }
    if (status === 'DA_GUI_CIC') {
      return <StatusTag status="PENDING" label="Đã gửi CIC" />;
    }
    return <StatusTag status="APPROVED" label="Đã tiếp nhận" />;
  };

  // ─── TABLE COLUMN DEFINITION WITH CONDITION ACTIONS ──────────────

  const renderEditableReconciliationCell = (
    val: string | null,
    record: ReconciliationDetailRow,
    dataIndex: keyof ReconciliationDetailRow,
    ruleCode: string | null
  ) => {
    if (record.isParent) return "-";
    if (!ruleCode) {
      return (
        <Tooltip title="Chỉ tiêu không có giá trị đối với nghiệp vụ của loại tệp này">
          <StopOutlined style={{ color: colors.text.tertiary, fontSize: 14 }} />
        </Tooltip>
      );
    }
    return (
      <EditableCell
        value={val}
        onChange={(newVal) => handleCellEdit(record.key, dataIndex, newVal)}
        type="text"
        record={record}
        ruleCode={ruleCode}
        style={{ textAlign: 'right' }}
      />
    );
  };

  const renderEditableNhomNoCell = (
    val: string | null,
    record: ReconciliationDetailRow
  ) => {
    if (record.isParent) return "-";
    if (!record.nhomNoRule) {
      return (
        <Tooltip title="Chỉ tiêu không có giá trị đối với nghiệp vụ của loại tệp này">
          <StopOutlined style={{ color: colors.text.tertiary, fontSize: 14 }} />
        </Tooltip>
      );
    }
    return (
      <EditableCell
        value={val}
        onChange={(newVal) => handleCellEdit(record.key, 'nhomNo', newVal)}
        type="select"
        selectOptions={[
          { value: 'Nhóm 1', label: 'Nhóm 1' },
          { value: 'Nhóm 2', label: 'Nhóm 2' },
          { value: 'Nhóm 3', label: 'Nhóm 3' },
          { value: 'Nhóm 4', label: 'Nhóm 4' },
          { value: 'Nhóm 5', label: 'Nhóm 5' }
        ]}
        record={record}
        style={{ textAlign: 'center' }}
        ruleCode={record.nhomNoRule}
      />
    );
  };

  const handleAddRow = () => {
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === uploadPhanLoai);
    if (!rule) return;

    const isNoDetails = ['D10', 'D11', 'D12', 'D20', 'D40', 'D60', 'D70'].includes(rule.loaiFile);
    const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

    const newRow: ReconciliationDetailRow = {
      key: `edit_child_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      loaiFile: uploadPhanLoai,
      tenTep: uploadTenTep,
      nghiepVu: operations[0] || uploadPhanLoai,
      nguonDuLieu: getLoaiToChucByMaDauMoi(uploadMaDauMoi),

      soLuongKhachHang: null,
      soLuongKhachHangRule: rule.soLuongKhachHangRule,
      soLuongHopDong: null,
      soLuongHopDongRule: rule.soLuongHopDongRule,

      maTienTe: rule.maTienTeRule ? 'VND' : null,
      maTienTeRule: rule.maTienTeRule,

      nhomNo: null,
      nhomNoRule: null,

      duNo: null,
      duNoRule: rule.duNoRule,

      tongDuNo: null,
      tongDuNoRule: rule.tongDuNoRule,

      phatSinhGiaiNgan: null,
      phatSinhGiaiNganRule: rule.phatSinhGiaiNganRule,

      phatSinhTraNo: null,
      phatSinhTraNoRule: rule.phatSinhTraNoRule,

      tongGiaTriBaoDam: null,
      tongGiaTriBaoDamRule: rule.tongGiaTriBaoDamRule,

      giaTriBaoDamKhoanVay: null,
      giaTriBaoDamKhoanVayRule: rule.giaTriBaoDamKhoanVayRule,

      doanhSoGiamNo: null,
      doanhSoGiamNoRule: rule.doanhSoGiamNoRule,

      duPhongPhaiTrich: null,
      duPhongPhaiTrichRule: rule.duPhongPhaiTrichRule,

      duPhongDaTrich: null,
      duPhongDaTrichRule: rule.duPhongDaTrichRule,

      parentKey: '',
      ngayBaoCao: uploadNgayBaoCao ? uploadNgayBaoCao.format('DD/MM/YYYY') : '',
      trangThai: 'TAO_MOI',
      moTaTep: '',
      maDauMoi: uploadMaDauMoi,
      isParent: false
    };

    setEditDetails(prev => [...prev, newRow]);
  };

  const handleDeleteRow = (rowKey: string) => {
    setEditDetails(prev => prev.filter(row => row.key !== rowKey));
  };

  const handleEditCellChange = (rowKey: string, field: keyof ReconciliationDetailRow, value: any) => {
    setEditDetails(prev => prev.map(row => {
      if (row.key === rowKey) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const getEditTableColumns = () => {
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === uploadPhanLoai);
    if (!rule) return [];

    const isNoDetails = ['D10', 'D11', 'D12', 'D20', 'D40', 'D60', 'D70'].includes(rule.loaiFile);
    const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

    const baseCols = [
      {
        title: 'STT',
        key: 'stt',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index + 1
      },
      {
        title: 'Nguồn',
        dataIndex: 'nguonDuLieu',
        key: 'nguonDuLieu',
        width: 90,
        align: 'center' as const,
        filters: [
          { text: 'TCTD', value: 'TCTD' },
          { text: 'Chi nhánh NH nước ngoài', value: 'Chi nhánh NH nước ngoài' },
          { text: 'Công ty tài chính', value: 'Công ty tài chính' }
        ],
        onFilter: (value: any, record: any) => record.nguonDuLieu === value,
        render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>
      },
      {
        title: 'Nghiệp vụ',
        dataIndex: 'nghiepVu',
        key: 'nghiepVu',
        width: 180,
        filters: Array.from(new Set(editDetails.map(item => item.nghiepVu).filter(Boolean))).map(nv => ({ text: nv, value: nv })),
        onFilter: (value: any, record: any) => record.nghiepVu === value,
        render: (text: string, record: ReconciliationDetailRow) => {
          if (operations.length > 1) {
            return (
              <Select
                value={text}
                onChange={(newVal) => handleEditCellChange(record.key, 'nghiepVu', newVal)}
                style={{ width: '100%' }}
                size="small"
                disabled={isReadOnly}
              >
                {operations.map(op => (
                  <Select.Option key={op} value={op}>{op}</Select.Option>
                ))}
              </Select>
            );
          }
          return <span style={{ fontWeight: 650, color: colors.primary[600] }}>{text}</span>;
        }
      }
    ];

    const condCols = [];

    const renderNumericInput = (field: keyof ReconciliationDetailRow, ruleCode: string | null) => {
      const label = columnOptions.find(opt => opt.key === field)?.label || '';
      return {
        title: (
          <Tooltip title={ruleCode} placement="top" arrow>
            <span style={{ cursor: 'help', borderBottom: '1px dashed #fa8c16' }}>
              {label}
            </span>
          </Tooltip>
        ),
        dataIndex: field,
        key: field,
        width: 150,
        align: 'right' as const,
        render: (val: string | null, record: ReconciliationDetailRow) => (
          <Input
            value={val || ''}
            onChange={(e) => handleEditCellChange(record.key, field, e.target.value)}
            placeholder={ruleCode || undefined}
            size="small"
            style={{ textAlign: 'right', width: '100%' }}
            disabled={isReadOnly}
          />
        )
      };
    };

    if (rule.soLuongKhachHangRule !== null) condCols.push(renderNumericInput('soLuongKhachHang', rule.soLuongKhachHangRule));
    if (rule.soLuongHopDongRule !== null) condCols.push(renderNumericInput('soLuongHopDong', rule.soLuongHopDongRule));

    if (rule.maTienTeRule !== null) {
      condCols.push({
        title: 'Mã tiền tệ',
        dataIndex: 'maTienTe',
        key: 'maTienTe',
        width: 110,
        align: 'center' as const,
        filters: [
          { text: 'VND', value: 'VND' },
          { text: 'USD', value: 'USD' },
          { text: 'XAU', value: 'XAU' }
        ],
        onFilter: (value: any, record: any) => record.maTienTe === value,
        render: (val: string | null, record: ReconciliationDetailRow) => (
          <Select
            value={val || undefined}
            onChange={(newVal) => handleEditCellChange(record.key, 'maTienTe', newVal)}
            style={{ width: '100%' }}
            placeholder="Tiền tệ"
            size="small"
            disabled={isReadOnly}
          >
            <Select.Option value="VND">VND</Select.Option>
            <Select.Option value="USD">USD</Select.Option>
            <Select.Option value="XAU">XAU</Select.Option>
          </Select>
        )
      });
    }

    if (rule.duNoRule !== null) condCols.push(renderNumericInput('duNo', rule.duNoRule));
    if (rule.tongDuNoRule !== null) condCols.push(renderNumericInput('tongDuNo', rule.tongDuNoRule));
    if (rule.phatSinhGiaiNganRule !== null) condCols.push(renderNumericInput('phatSinhGiaiNgan', rule.phatSinhGiaiNganRule));
    if (rule.phatSinhTraNoRule !== null) condCols.push(renderNumericInput('phatSinhTraNo', rule.phatSinhTraNoRule));
    if (rule.tongGiaTriBaoDamRule !== null) condCols.push(renderNumericInput('tongGiaTriBaoDam', rule.tongGiaTriBaoDamRule));
    if (rule.giaTriBaoDamKhoanVayRule !== null) condCols.push(renderNumericInput('giaTriBaoDamKhoanVay', rule.giaTriBaoDamKhoanVayRule));
    if (rule.doanhSoGiamNoRule !== null) condCols.push(renderNumericInput('doanhSoGiamNo', rule.doanhSoGiamNoRule));
    if (rule.duPhongPhaiTrichRule !== null) condCols.push(renderNumericInput('duPhongPhaiTrich', rule.duPhongPhaiTrichRule));
    if (rule.duPhongDaTrichRule !== null) condCols.push(renderNumericInput('duPhongDaTrich', rule.duPhongDaTrichRule));

    // Thêm cột Thao tác ở cuối
    condCols.push({
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: ReconciliationDetailRow) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
          size="small"
          disabled={isReadOnly}
        />
      )
    });

    const preparedEditCols = [...baseCols, ...condCols]
      .map(col => {
        const colKey = col.key as string;
        const isFixed = ['stt', 'action'].includes(colKey);
        return {
          ...col,
          onHeaderCell: (column: any) => {
            if (isFixed) return {};
            return {
              draggable: true,
              onDragStart: (e: any) => {
                e.dataTransfer.setData('text/plain', colKey);
              },
              onDragOver: (e: any) => {
                e.preventDefault();
                e.currentTarget.classList.add('drag-over');
              },
              onDragLeave: (e: any) => {
                e.currentTarget.classList.remove('drag-over');
              },
              onDrop: (e: any) => {
                e.currentTarget.classList.remove('drag-over');
                const sourceKey = e.dataTransfer.getData('text/plain');
                const targetKey = colKey;
                if (sourceKey && targetKey && sourceKey !== targetKey && !['stt', 'action'].includes(sourceKey)) {
                  handleEditColumnReorder(sourceKey, targetKey);
                }
              },
              style: { cursor: 'grab' }
            };
          }
        };
      })
      .sort((a, b) => {
        const aKey = a.key as string;
        const bKey = b.key as string;
        const aIdx = editColumnOrder.indexOf(aKey);
        const bIdx = editColumnOrder.indexOf(bKey);
        return (aIdx !== -1 ? aIdx : 99) - (bIdx !== -1 ? bIdx : 99);
      });

    return preparedEditCols;
  };

  const getDetailTableColumns = (loaiFile: string, rows: ReconciliationDetailRow[] = []) => {
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === loaiFile);
    if (!rule) return [];

    const baseCols = [
      {
        title: 'STT',
        key: 'stt',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index + 1
      },
      {
        title: 'Nguồn',
        dataIndex: 'nguonDuLieu',
        key: 'nguonDuLieu',
        width: 90,
        align: 'center' as const,
        filters: [
          { text: 'TCTD', value: 'TCTD' },
          { text: 'Chi nhánh NH nước ngoài', value: 'Chi nhánh NH nước ngoài' },
          { text: 'Công ty tài chính', value: 'Công ty tài chính' }
        ],
        onFilter: (value: any, record: any) => record.nguonDuLieu === value,
        render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>
      },
      {
        title: 'Nghiệp vụ',
        dataIndex: 'nghiepVu',
        key: 'nghiepVu',
        width: 150,
        filters: Array.from(new Set(rows.map(item => item.nghiepVu).filter(Boolean))).map(nv => ({ text: nv, value: nv })),
        onFilter: (value: any, record: any) => record.nghiepVu === value,
        render: (text: string) => <span style={{ fontWeight: 650, color: colors.primary[700] }}>{text}</span>
      }
    ];

    const condCols = [];

    const renderReadOnlyCell = (field: keyof ReconciliationDetailRow, ruleCode: string | null) => {
      const label = columnOptions.find(opt => opt.key === field)?.label || '';
      return {
        title: ruleCode ? (
          <Tooltip title={ruleCode} placement="top" arrow>
            <span style={{ cursor: 'help', borderBottom: '1px dashed #fa8c16' }}>
              {label}
            </span>
          </Tooltip>
        ) : label,
        dataIndex: field,
        key: field,
        width: 150,
        align: 'right' as const,
        render: (val: string | null) => val ? (
          ruleCode ? (
            <Tooltip title={ruleCode} placement="top" arrow>
              <span style={{ borderBottom: '1px dashed #fa8c16', cursor: 'help', fontWeight: 500 }}>{val}</span>
            </Tooltip>
          ) : (
            <span>{val}</span>
          )
        ) : <span style={{ color: '#bfbfbf' }}>-</span>
      };
    };

    if (rule.soLuongKhachHangRule !== null) condCols.push(renderReadOnlyCell('soLuongKhachHang', rule.soLuongKhachHangRule));
    if (rule.soLuongHopDongRule !== null) condCols.push(renderReadOnlyCell('soLuongHopDong', rule.soLuongHopDongRule));

    if (rule.maTienTeRule !== null) {
      condCols.push({
        title: 'Mã tiền tệ',
        dataIndex: 'maTienTe',
        key: 'maTienTe',
        width: 110,
        align: 'center' as const,
        filters: [
          { text: 'VND', value: 'VND' },
          { text: 'USD', value: 'USD' },
          { text: 'XAU', value: 'XAU' }
        ],
        onFilter: (value: any, record: any) => record.maTienTe === value,
        render: (val: string | null) => (
          val ? (
            <span style={{
              fontWeight: 700,
              color: val === 'VND' ? colors.success.dark : val === 'USD' ? colors.primary[600] : '#d4b106'
            }}>{val}</span>
          ) : <span style={{ color: '#bfbfbf' }}>-</span>
        )
      });
    }

    if (rule.duNoRule !== null) condCols.push(renderReadOnlyCell('duNo', rule.duNoRule));
    if (rule.tongDuNoRule !== null) condCols.push(renderReadOnlyCell('tongDuNo', rule.tongDuNoRule));
    if (rule.phatSinhGiaiNganRule !== null) condCols.push(renderReadOnlyCell('phatSinhGiaiNgan', rule.phatSinhGiaiNganRule));
    if (rule.phatSinhTraNoRule !== null) condCols.push(renderReadOnlyCell('phatSinhTraNo', rule.phatSinhTraNoRule));
    if (rule.tongGiaTriBaoDamRule !== null) condCols.push(renderReadOnlyCell('tongGiaTriBaoDam', rule.tongGiaTriBaoDamRule));
    if (rule.giaTriBaoDamKhoanVayRule !== null) condCols.push(renderReadOnlyCell('giaTriBaoDamKhoanVay', rule.giaTriBaoDamKhoanVayRule));
    if (rule.doanhSoGiamNoRule !== null) condCols.push(renderReadOnlyCell('doanhSoGiamNo', rule.doanhSoGiamNoRule));
    if (rule.duPhongPhaiTrichRule !== null) condCols.push(renderReadOnlyCell('duPhongPhaiTrich', rule.duPhongPhaiTrichRule));
    if (rule.duPhongDaTrichRule !== null) condCols.push(renderReadOnlyCell('duPhongDaTrich', rule.duPhongDaTrichRule));

    const preparedDetailCols = [...baseCols, ...condCols]
      .map(col => {
        const colKey = col.key as string;
        const isFixed = ['stt'].includes(colKey);
        return {
          ...col,
          onHeaderCell: (column: any) => {
            if (isFixed) return {};
            return {
              draggable: true,
              onDragStart: (e: any) => {
                e.dataTransfer.setData('text/plain', colKey);
              },
              onDragOver: (e: any) => {
                e.preventDefault();
                e.currentTarget.classList.add('drag-over');
              },
              onDragLeave: (e: any) => {
                e.currentTarget.classList.remove('drag-over');
              },
              onDrop: (e: any) => {
                e.currentTarget.classList.remove('drag-over');
                const sourceKey = e.dataTransfer.getData('text/plain');
                const targetKey = colKey;
                if (sourceKey && targetKey && sourceKey !== targetKey && !['stt'].includes(sourceKey)) {
                  handleDetailColumnReorder(sourceKey, targetKey);
                }
              },
              style: { cursor: 'grab' }
            };
          }
        };
      })
      .sort((a, b) => {
        const aKey = a.key as string;
        const bKey = b.key as string;
        const aIdx = detailColumnOrder.indexOf(aKey);
        const bIdx = detailColumnOrder.indexOf(bKey);
        return (aIdx !== -1 ? aIdx : 99) - (bIdx !== -1 ? bIdx : 99);
      });

    return preparedDetailCols;
  };

  const getDetailRows = (report: BalanceReport): ReconciliationDetailRow[] => {
    const custom = customDetailsMap[report.key];
    if (custom) return custom;
    const parentRow = generateTreeReconciliationData([report]).find(item => item.isParent);
    return parentRow?.children || [];
  };

  const getModalStats = (report: BalanceReport, rows: ReconciliationDetailRow[]) => {
    const parseAmount = (val: string | null): number => {
      if (!val) return 0;
      const num = parseInt(val.replace(/\./g, ''), 10);
      return isNaN(num) ? 0 : num;
    };

    const sumField = (field: keyof ReconciliationDetailRow): number => {
      return rows.reduce((acc, row) => acc + parseAmount(row[field] as string | null), 0);
    };

    const formatSum = (val: number): string => {
      return val > 0 ? val.toLocaleString('vi-VN') + ' VND' : '-';
    };

    const loaiFile = report.phanLoaiTep;
    const stats: { label: string; value: string; color: string }[] = [];

    stats.push({
      label: 'Tổng số dòng nghiệp vụ',
      value: String(rows.length),
      color: colors.primary[600]
    });

    if (loaiFile === 'D35') {
      stats.push({
        label: 'Tổng số tiền giải ngân',
        value: formatSum(sumField('phatSinhGiaiNgan')),
        color: colors.success.dark
      });
      stats.push({
        label: 'Tổng số tiền trả nợ',
        value: formatSum(sumField('phatSinhTraNo')),
        color: colors.error.base
      });
    } else if (loaiFile === 'D36') {
      stats.push({
        label: 'Dự phòng phải trích',
        value: formatSum(sumField('duPhongPhaiTrich')),
        color: colors.warning.dark
      });
      stats.push({
        label: 'Dự phòng đã trích',
        value: formatSum(sumField('duPhongDaTrich')),
        color: colors.success.dark
      });
    } else if (loaiFile === 'D40') {
      stats.push({
        label: 'Giá trị tài sản bảo đảm',
        value: formatSum(sumField('tongGiaTriBaoDam')),
        color: colors.success.dark
      });
      stats.push({
        label: 'Giá trị bảo đảm khoản vay',
        value: formatSum(sumField('giaTriBaoDamKhoanVay')),
        color: colors.primary[600]
      });
    } else if (loaiFile === 'D60') {
      stats.push({
        label: 'Doanh số giảm nợ',
        value: formatSum(sumField('doanhSoGiamNo')),
        color: colors.error.base
      });
    } else {
      stats.push({
        label: 'Tổng dư nợ đối soát',
        value: formatSum(sumField('duNo')),
        color: colors.success.dark
      });
    }

    return stats;
  };

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
      title: 'Nguồn',
      dataIndex: 'nguonDuLieu',
      key: 'nguonDuLieu',
      width: 90,
      align: 'center' as const,
      fixed: 'left' as const,
      filters: [
        { text: 'TCTD', value: 'TCTD' },
        { text: 'Chi nhánh NH nước ngoài', value: 'Chi nhánh NH nước ngoài' },
        { text: 'Công ty tài chính', value: 'Công ty tài chính' }
      ],
      onFilter: (value: any, record: any) => record.nguonDuLieu === value,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "-";
        return (
          <EditableCell
            value={text}
            onChange={(val) => handleCellEdit(record.key, 'nguonDuLieu', val)}
            type="text"
            record={record}
            renderDisplay={(val) => <span>{val}</span>}
          />
        );
      }
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
          <EditableCell
            value={text}
            onChange={(val) => handleCellEdit(record.key, 'tenTep', val)}
            type="text"
            record={record}
            renderDisplay={(val) => (
              <span
                style={{
                  textDecoration: 'underline',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetail(record);
                }}
              >
                <CodeText muted style={{ fontSize: '11.5px', fontWeight: 500, color: colors.primary[500] }}>
                  {val}
                </CodeText>
              </span>
            )}
          />
        );
      }
    },
    {
      title: 'Mã đầu mối báo cáo',
      dataIndex: 'maDauMoi',
      key: 'maDauMoi',
      width: 160,
      align: 'center' as const,
      filters: [
        { text: '31358001', value: '31358001' },
        { text: '01201001', value: '01201001' },
        { text: '01203002', value: '01203002' }
      ],
      onFilter: (value: any, record: any) => record.maDauMoi === value,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <EditableCell
            value={text}
            onChange={(val) => handleCellEdit(record.key, 'maDauMoi', val)}
            type="text"
            record={record}
            renderDisplay={(val) => <span style={{ color: colors.text.primary, fontWeight: 600 }}>{val}</span>}
          />
        );
      }
    },
    {
      title: 'Ngày báo cáo',
      dataIndex: 'ngayBaoCao',
      key: 'ngayBaoCao',
      width: 120,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <EditableCell
            value={text}
            onChange={(val) => handleCellEdit(record.key, 'ngayBaoCao', val)}
            type="text"
            record={record}
            renderDisplay={(val) => <span style={{ color: colors.text.secondary }}>{val}</span>}
          />
        );
      }
    },
    {
      title: 'Loại file',
      dataIndex: 'loaiFile',
      key: 'loaiFile',
      width: 90,
      align: 'center' as const,
      filters: [
        { text: 'D10', value: 'D10' },
        { text: 'D11', value: 'D11' },
        { text: 'D12', value: 'D12' },
        { text: 'D20', value: 'D20' },
        { text: 'D31', value: 'D31' },
        { text: 'D32', value: 'D32' },
        { text: 'D33', value: 'D33' },
        { text: 'D34', value: 'D34' },
        { text: 'D35', value: 'D35' },
        { text: 'D36', value: 'D36' },
        { text: 'D40', value: 'D40' },
        { text: 'D50', value: 'D50' },
        { text: 'D60', value: 'D60' },
        { text: 'D70', value: 'D70' },
        { text: 'DKQ', value: 'DKQ' }
      ],
      onFilter: (value: any, record: any) => record.loaiFile === value,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <EditableCell
            value={text}
            onChange={(val) => handleCellEdit(record.key, 'loaiFile', val)}
            type="text"
            record={record}
            renderDisplay={(val) => <strong style={{ color: colors.text.primary }}>{val}</strong>}
          />
        );
      }
    },
    {
      title: 'Nghiệp vụ',
      dataIndex: 'nghiepVu',
      key: 'nghiepVu',
      width: 140,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (record.isParent) return <span style={{ color: colors.text.tertiary, fontStyle: 'italic' }}>-</span>;
        return (
          <EditableCell
            value={text}
            onChange={(val) => handleCellEdit(record.key, 'nghiepVu', val)}
            type="text"
            record={record}
            renderDisplay={(val) => <span style={{ fontWeight: 650, color: colors.primary[700] }}>{val}</span>}
          />
        );
      }
    },
    {
      title: 'Số lượng khách hàng',
      dataIndex: 'soLuongKhachHang',
      key: 'soLuongKhachHang',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'soLuongKhachHang', record.soLuongKhachHangRule)
    },
    {
      title: 'Số lượng hợp đồng',
      dataIndex: 'soLuongHopDong',
      key: 'soLuongHopDong',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'soLuongHopDong', record.soLuongHopDongRule)
    },
    {
      title: 'Mã tiền tệ',
      dataIndex: 'maTienTe',
      key: 'maTienTe',
      width: 100,
      align: 'center' as const,
      filters: [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
        { text: 'XAU', value: 'XAU' }
      ],
      onFilter: (value: any, record: ReconciliationDetailRow) => {
        if (record.isParent) {
          return record.children?.some(child => child.maTienTe === value) || false;
        }
        return record.maTienTe === value;
      },
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        if (!record.maTienTeRule) {
          return (
            <Tooltip title="Chỉ tiêu không có giá trị đối với nghiệp vụ của loại tệp này">
              <StopOutlined style={{ color: colors.text.tertiary, fontSize: 14 }} />
            </Tooltip>
          );
        }
        return (
          <EditableCell
            value={val}
            onChange={(newVal) => handleCellEdit(record.key, 'maTienTe', newVal)}
            type="select"
            selectOptions={[
              { value: 'VND', label: 'VND' },
              { value: 'USD', label: 'USD' },
              { value: 'XAU', label: 'XAU' }
            ]}
            record={record}
            renderDisplay={(currentVal) => {
              if (!currentVal) return <span style={{ color: '#bfbfbf' }}>-</span>;
              return (
                <Tooltip title={record.maTienTeRule || null}>
                  <span style={{
                    fontWeight: 700,
                    color: currentVal === 'VND' ? colors.success.dark : currentVal === 'USD' ? colors.primary[600] : '#d4b106',
                    borderBottom: record.maTienTeRule ? '1px dashed #fa8c16' : 'none',
                    cursor: record.maTienTeRule ? 'help' : 'default'
                  }}>
                    {currentVal}
                  </span>
                </Tooltip>
              );
            }}
          />
        );
      }
    },
    {
      title: 'Dư nợ',
      dataIndex: 'duNo',
      key: 'duNo',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'duNo', record.duNoRule)
    },
    {
      title: 'Tổng dư nợ',
      dataIndex: 'tongDuNo',
      key: 'tongDuNo',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'tongDuNo', record.tongDuNoRule)
    },
    {
      title: 'Số tiền giải ngân',
      dataIndex: 'phatSinhGiaiNgan',
      key: 'phatSinhGiaiNgan',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'phatSinhGiaiNgan', record.phatSinhGiaiNganRule)
    },
    {
      title: 'Số tiền trả nợ',
      dataIndex: 'phatSinhTraNo',
      key: 'phatSinhTraNo',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'phatSinhTraNo', record.phatSinhTraNoRule)
    },
    {
      title: 'Giá trị tài sản bảo đảm',
      dataIndex: 'tongGiaTriBaoDam',
      key: 'tongGiaTriBaoDam',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'tongGiaTriBaoDam', record.tongGiaTriBaoDamRule)
    },
    {
      title: 'Giá trị bảo đảm khoản vay',
      dataIndex: 'giaTriBaoDamKhoanVay',
      key: 'giaTriBaoDamKhoanVay',
      width: 170,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'giaTriBaoDamKhoanVay', record.giaTriBaoDamKhoanVayRule)
    },
    {
      title: 'Doanh số giảm',
      dataIndex: 'doanhSoGiamNo',
      key: 'doanhSoGiamNo',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'doanhSoGiamNo', record.doanhSoGiamNoRule)
    },
    {
      title: 'Dự phòng phải trích nội bảng',
      dataIndex: 'duPhongPhaiTrich',
      key: 'duPhongPhaiTrich',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'duPhongPhaiTrich', record.duPhongPhaiTrichRule)
    },
    {
      title: 'Dự phòng đã trích nội bảng',
      dataIndex: 'duPhongDaTrich',
      key: 'duPhongDaTrich',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => renderEditableReconciliationCell(val, record, 'duPhongDaTrich', record.duPhongDaTrichRule)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      align: 'center' as const,
      filters: [
        { text: 'Tạo mới', value: 'TAO_MOI' },
        { text: 'Đã gửi CIC', value: 'DA_GUI_CIC' },
        { text: 'Đã tiếp nhận', value: 'DA_TIEP_NHAN' }
      ],
      onFilter: (value: any, record: any) => record.trangThai === value,
      render: (status: TrangThaiTep, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <EditableCell
            value={status}
            onChange={(newVal) => handleCellEdit(record.key, 'trangThai', newVal)}
            type="select"
            selectOptions={[
              { value: 'TAO_MOI', label: 'Tạo mới' },
              { value: 'DA_GUI_CIC', label: 'Đã gửi CIC' },
              { value: 'DA_TIEP_NHAN', label: 'Đã tiếp nhận' }
            ]}
            record={record}
            renderDisplay={(val) => renderTrangThaiTag(val)}
          />
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 95,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";

        const menuItems: Array<{
          key: string;
          label: string;
          icon: React.ReactNode;
          onClick?: () => void;
          danger?: boolean;
        }> = [
            {
              key: 'view',
              label: 'Xem chi tiết',
              icon: <EyeOutlined />,
              onClick: () => {
                const parentReport = data.find(item => item.key === record.parentKey);
                if (parentReport) handleViewDetail(record);
              }
            }
          ];

        // Thu hồi (Chỉ hiển thị nếu trạng thái là Đã gửi CIC)
        if (record.trangThai === 'DA_GUI_CIC') {
          menuItems.push({
            key: 'revoke',
            label: 'Thu hồi',
            icon: <UndoOutlined style={{ color: colors.warning.dark }} />,
            onClick: () => {
              const parentReport = data.find(item => item.key === record.parentKey);
              if (parentReport) handleRevoke(parentReport);
            }
          });
        }

        // Xóa (Chỉ hiển thị nếu trạng thái là Tạo mới)
        if (record.trangThai === 'TAO_MOI') {
          menuItems.push({
            key: 'delete',
            label: 'Xóa tệp nháp',
            icon: <DeleteOutlined style={{ color: colors.error.base }} />,
            danger: true,
            onClick: () => {
              const parentReport = data.find(item => item.key === record.parentKey);
              if (parentReport) handleDelete(parentReport);
            }
          });
        }

        return <ActionMenu items={menuItems} />;
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

  const renderColumnSettings = () => {
    const sortedConfigureColumns = mainColumnOrder
      .map(key => columnOptions.find(opt => opt.key === key))
      .filter((opt): opt is typeof columnOptions[number] => opt !== undefined);

    const filteredConfigureColumns = sortedConfigureColumns.filter(opt =>
      opt.label.toLowerCase().includes(columnSearchTerm.toLowerCase())
    );

    const selectedCount = visibleColumns.filter(k => columnOptions.some(opt => opt.key === k)).length;
    const totalCount = columnOptions.length;

    return (
      <div style={{ width: 280, padding: '8px 4px 4px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: colors.text.primary, marginBottom: 10, paddingLeft: 8 }}>
          Cài đặt hiển thị
        </div>

        {/* Search Input */}
        <div style={{ padding: '0 8px 10px' }}>
          <Input
            placeholder="Tìm kiếm trường thông tin"
            prefix={<SearchOutlined style={{ color: colors.text.tertiary }} />}
            value={columnSearchTerm}
            onChange={e => setColumnSearchTerm(e.target.value)}
            allowClear
            size="small"
            style={{ borderRadius: radius.md }}
          />
        </div>

        {/* Scrollable List */}
        <div style={{
          maxHeight: 280,
          overflowY: 'auto',
          padding: '0 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }} className="popover-column-list">
          {filteredConfigureColumns.map((opt) => {
            const isFixed = isFixedColumn(opt.key);
            return (
              <div
                key={opt.key}
                draggable={!isFixed}
                onDragStart={(e) => {
                  if (!isFixed) {
                    e.dataTransfer.setData('text/plain', opt.key);
                  }
                }}
                onDragOver={(e) => {
                  if (!isFixed) {
                    e.preventDefault();
                    e.currentTarget.classList.add('popover-drag-over');
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('popover-drag-over');
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove('popover-drag-over');
                  const sourceKey = e.dataTransfer.getData('text/plain');
                  const targetKey = opt.key;
                  if (sourceKey && targetKey && sourceKey !== targetKey && !isFixedColumn(sourceKey) && !isFixedColumn(targetKey)) {
                    handleMainColumnReorder(sourceKey, targetKey);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 8px',
                  borderRadius: radius.sm,
                  cursor: isFixed ? 'default' : 'grab',
                  transition: 'background-color 0.2s',
                }}
                className="popover-column-item"
              >
                {/* Drag handle */}
                {!isFixed ? (
                  <HolderOutlined style={{ color: colors.text.tertiary, marginRight: 8, cursor: 'grab' }} />
                ) : (
                  <div style={{ width: 22 }} /> // spacing to align
                )}

                {/* Checkbox */}
                <Checkbox
                  disabled={opt.disabled}
                  checked={visibleColumns.includes(opt.key)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setVisibleColumns(prev => [...prev, opt.key]);
                    } else {
                      setVisibleColumns(prev => prev.filter(k => k !== opt.key));
                    }
                  }}
                >
                  <span style={{ fontSize: 13, color: colors.text.primary }}>{opt.label}</span>
                </Checkbox>
              </div>
            );
          })}
          {filteredConfigureColumns.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px 0', color: colors.text.tertiary, fontSize: 13 }}>
              Không tìm thấy trường thông tin
            </div>
          )}
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Footer */}
        <div style={{ padding: '0 8px 4px' }}>
          <div style={{ fontSize: 12, color: colors.text.secondary, marginBottom: 8, paddingLeft: 4 }}>
            Đã chọn {selectedCount}/{totalCount}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="link"
              size="small"
              style={{ padding: 0, fontSize: 13, fontWeight: 600, color: colors.primary[600] }}
              onClick={() => {
                const mandatoryKeys = columnOptions.filter(opt => opt.disabled).map(opt => opt.key);
                setVisibleColumns(mandatoryKeys);
              }}
            >
              Bỏ chọn
            </Button>
            <Button
              type="link"
              size="small"
              style={{ padding: 0, fontSize: 13, fontWeight: 600, color: colors.primary[600] }}
              onClick={() => {
                setVisibleColumns(columnOptions.map(opt => opt.key));
              }}
            >
              Chọn tất cả
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      {/* ─── TRA CỨU BÁO CÁO ĐÃ NHẬP ──────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Bộ lọc Tìm kiếm - Sử dụng FilterBar & FilterCol */}
        <FilterBar inCard onSearch={handleSearch} onReset={handleReset} loading={loading} showAddFilter={false}>
          {/* 1. Tên tệp: text field */}
          <FilterCol minWidth={200}>
            <Tooltip title="Tên tệp" placement="top" arrow>
              <Input
                placeholder="Tìm theo tên tệp..."
                value={tenTepFilter}
                onChange={e => setTenTepFilter(e.target.value)}
                style={{ width: '100%' }}
              />
            </Tooltip>
          </FilterCol>

          {/* 2. Loại tệp: droplist, multi select */}
          <FilterCol minWidth={220}>
            <Tooltip title="Loại tệp" placement="top" arrow>
              <Select
                mode="multiple"
                placeholder="Chọn loại tệp (chọn nhiều)..."
                value={loaiTepFilter}
                onChange={setLoaiTepFilter}
                style={{ width: '100%' }}
                maxTagCount="responsive"
              >
                <Select.Option value="D10">D10 — Thông tin định danh khách hàng vay phát sinh</Select.Option>
                <Select.Option value="D11">D11 — Thông tin định danh khách hàng vay cuối tháng</Select.Option>
                <Select.Option value="D12">D12 — Thông tin về người có liên quan của khách hàng vay</Select.Option>
                <Select.Option value="D20">D20 — Thông tin tài chính khách hàng vay là doanh nghiệp</Select.Option>
                <Select.Option value="D31">D31 — Thông tin quan hệ tín dụng rút gọn</Select.Option>
                <Select.Option value="D32">D32 — Thông tin quan hệ tín dụng cuối tháng</Select.Option>
                <Select.Option value="D33">D33 — Thông tin thẻ tín dụng rút gọn</Select.Option>
                <Select.Option value="D34">D34 — Thông tin thẻ tín dụng cuối tháng</Select.Option>
                <Select.Option value="D35">D35 — Thông tin thống kê tình hình giải ngân, trả nợ của khách hàng</Select.Option>
                <Select.Option value="D36">D36 — Thông tin trích lập dự phòng rủi ro cuối quý</Select.Option>
                <Select.Option value="D40">D40 — Thông tin về biện pháp bảo đảm cấp tín dụng</Select.Option>
                <Select.Option value="D50">D50 — Thông tin mua và ủy thác mua trái phiếu doanh nghiệp (không bao gồm TCTD)</Select.Option>
                <Select.Option value="D60">D60 — Thông tin hoạt động xử lý nợ xấu nội bảng</Select.Option>
                <Select.Option value="D70">D70 — Thông tin dư nợ tại VAMC</Select.Option>
                <Select.Option value="DKQ">DKQ — Báo cáo phân loại nợ & cam kết ngoại bảng</Select.Option>
              </Select>
            </Tooltip>
          </FilterCol>

          {/* 3. Ngày báo cáo (từ ngày đến ngày) */}
          <FilterCol minWidth={220}>
            <Tooltip title="Ngày báo cáo" placement="top" arrow>
              <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" />
            </Tooltip>
          </FilterCol>

          {/* 4. Ngày gửi (từ ngày đến ngày) */}
          <FilterCol minWidth={220}>
            <Tooltip title="Ngày gửi" placement="top" arrow>
              <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" />
            </Tooltip>
          </FilterCol>

          {/* 5. Trạng thái: droplist */}
          <FilterCol minWidth={160}>
            <Tooltip title="Trạng thái" placement="top" arrow>
              <Select value={trangThaiFilter} onChange={setTrangThaiFilter} style={{ width: '100%' }}>
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="TAO_MOI">Tạo mới</Select.Option>
                <Select.Option value="DA_GUI_CIC">Đã gửi CIC</Select.Option>
                <Select.Option value="DA_TIEP_NHAN">Đã tiếp nhận</Select.Option>
              </Select>
            </Tooltip>
          </FilterCol>
        </FilterBar>

        {/* Bảng danh sách rút gọn */}
        <SectionCard
          flex
          noPadding
          title="Danh sách báo cáo thông tin cân đối"
          count={`Mở rộng dòng để xem chi tiết đối soát`}
          extra={
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ background: colors.subsystem.portal, borderColor: colors.subsystem.portal }}
                onClick={() => {
                  setUploadModalVisible(true);
                  handleResetForm();
                }}
              >
                Gửi báo cáo mới
              </Button>
              <Popover
                content={renderColumnSettings()}
                trigger="click"
                placement="bottomRight"
              >
                <Button icon={<SettingOutlined />}>Cài đặt hiển thị</Button>
              </Popover>
              <Button
                icon={<FileExcelOutlined />}
                style={{ color: colors.success.dark, borderColor: colors.success.dark }}
                onClick={() => message.success('Xuất Excel thành công!')}
              >
                Xuất Excel
              </Button>
            </Space>
          }
        >
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {(() => {
              const preparedMainColumns = columns
                .map(col => {
                  const colKey = (col.key || col.dataIndex) as string;
                  const isFixed = ['stt', 'nguonDuLieu', 'tenTep', 'action'].includes(colKey);

                  const baseCol = {
                    ...col,
                    onHeaderCell: (column: any) => {
                      if (isFixed) return {};
                      return {
                        draggable: true,
                        onDragStart: (e: any) => {
                          e.dataTransfer.setData('text/plain', colKey);
                        },
                        onDragOver: (e: any) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('drag-over');
                        },
                        onDragLeave: (e: any) => {
                          e.currentTarget.classList.remove('drag-over');
                        },
                        onDrop: (e: any) => {
                          e.currentTarget.classList.remove('drag-over');
                          const sourceKey = e.dataTransfer.getData('text/plain');
                          const targetKey = colKey;
                          if (sourceKey && targetKey && sourceKey !== targetKey && !['stt', 'nguonDuLieu', 'tenTep', 'action'].includes(sourceKey)) {
                            handleMainColumnReorder(sourceKey, targetKey);
                          }
                        },
                        style: { cursor: 'grab' }
                      };
                    }
                  };

                  if (colKey === 'nghiepVu') {
                    const uniqueNghiepVus = Array.from(new Set(
                      treeData.flatMap(parent => parent.children || []).map(child => child.nghiepVu).filter(Boolean)
                    ));
                    return {
                      ...baseCol,
                      filters: uniqueNghiepVus.map(nv => ({ text: nv, value: nv })),
                      onFilter: (value: any, record: ReconciliationDetailRow) => {
                        if (record.isParent) {
                          return record.children?.some(child => child.nghiepVu === value) || false;
                        }
                        return record.nghiepVu === value;
                      }
                    };
                  }
                  return baseCol;
                })
                .sort((a, b) => {
                  const aKey = (a.key || a.dataIndex) as string;
                  const bKey = (b.key || b.dataIndex) as string;
                  const aIdx = mainColumnOrder.indexOf(aKey);
                  const bIdx = mainColumnOrder.indexOf(bKey);
                  return (aIdx !== -1 ? aIdx : 99) - (bIdx !== -1 ? bIdx : 99);
                })
                .filter(col => visibleColumns.includes(col.key || ''));

              return (
                <Table
                  dataSource={treeData}
                  columns={preparedMainColumns}
                  pagination={tablePagination({ pageSize: 10 })}
                  loading={loading}
                  size="middle"
                  scroll={{ x: 2500, y: 500 }}
                  bordered
                />
              );
            })()}
          </div>
        </SectionCard>
      </div>

      {/* ─── POPUP: GỬI BÁO CÁO CÂN ĐỐI MỚI ─────────────────────────────── */}
      <Modal
        title="Gửi báo cáo cân đối mới"
        open={uploadModalVisible}
        onCancel={handleCancelUpload}
        width="75%"
        style={{ top: '8vh' }}
        bodyStyle={{
          maxHeight: 'calc(80vh - 120px)',
          overflowY: 'auto',
          padding: '16px 24px 24px'
        }}
        maskClosable={false}
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button key="cancel" onClick={handleCancelUpload} style={{ minWidth: 100, borderRadius: radius.md }}>
              Hủy
            </Button>
            <Button
              key="save"
              onClick={() => handleSaveReport(true)}
              loading={uploadLoading}
              disabled={isReadOnly}
              style={{ minWidth: 100, borderRadius: radius.md }}
            >
              Lưu nháp
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => handleSaveReport(false)}
              loading={uploadLoading}
              disabled={isReadOnly}
              style={{
                minWidth: 150,
                borderRadius: radius.md,
                ...(!isReadOnly ? {
                  background: colors.subsystem.portal,
                  borderColor: colors.subsystem.portal,
                } : {})
              }}
            >
              Lưu và Gửi CIC
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>

          {/* Khối thông tin chung */}
          <div style={{
            background: '#ffffff',
            borderRadius: radius.lg,
            border: `1px solid ${colors.border.split}`,
            padding: '20px',
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.subsystem.portal, marginBottom: 16 }}>
              KHỐI THÔNG TIN CHUNG
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Mã đầu mối báo cáo
                </Text>
                <Input value={uploadMaDauMoi} disabled style={{ width: '100%', height: 36 }} />
              </div>

              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Loại tệp
                </Text>
                <Select
                  value={uploadPhanLoai}
                  onChange={setUploadPhanLoai}
                  style={{ width: '100%' }}
                  size="middle"
                >
                  <Select.Option value="D10">D10 — Thông tin định danh khách hàng vay phát sinh</Select.Option>
                  <Select.Option value="D11">D11 — Thông tin định danh khách hàng vay cuối tháng</Select.Option>
                  <Select.Option value="D12">D12 — Thông tin về người có liên quan của khách hàng vay</Select.Option>
                  <Select.Option value="D20">D20 — Thông tin tài chính khách hàng vay là doanh nghiệp</Select.Option>
                  <Select.Option value="D31">D31 — Thông tin quan hệ tín dụng rút gọn</Select.Option>
                  <Select.Option value="D32">D32 — Thông tin quan hệ tín dụng cuối tháng</Select.Option>
                  <Select.Option value="D33">D33 — Thông tin thẻ tín dụng rút gọn</Select.Option>
                  <Select.Option value="D34">D34 — Thông tin thẻ tín dụng cuối tháng</Select.Option>
                  <Select.Option value="D35">D35 — Thông tin thống kê tình hình giải ngân, trả nợ của khách hàng</Select.Option>
                  <Select.Option value="D36">D36 — Thông tin trích lập dự phòng rủi ro cuối quý</Select.Option>
                  <Select.Option value="D40">D40 — Thông tin về biện pháp bảo đảm cấp tín dụng</Select.Option>
                  <Select.Option value="D50">D50 — Thông tin mua và ủy thác mua trái phiếu doanh nghiệp (không bao gồm TCTD)</Select.Option>
                  <Select.Option value="D60">D60 — Thông tin hoạt động xử lý nợ xấu nội bảng</Select.Option>
                  <Select.Option value="D70">D70 — Thông tin dư nợ tại VAMC</Select.Option>
                  <Select.Option value="DKQ">DKQ — Báo cáo phân loại nợ & cam kết ngoại bảng</Select.Option>
                </Select>
              </div>

              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Ngày báo cáo
                </Text>
                <DatePicker
                  value={uploadNgayBaoCao}
                  onChange={setUploadNgayBaoCao}
                  format="DD/MM/YYYY"
                  style={{ width: '100%', height: 36 }}
                  disabledDate={(current) => {
                    return current && current.isAfter(dayjs().add(1, 'month').endOf('month'), 'day');
                  }}
                />
              </div>

              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                  Tên tệp
                </Text>
                <AutoComplete
                  value={uploadTenTep}
                  onChange={setUploadTenTep}
                  options={getFilteredFileNames()}
                  placeholder="Nhập hoặc chọn tên tệp..."
                  style={{ width: '100%' }}
                  filterOption={(inputValue, option) =>
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  disabled={isReadOnly}
                >
                  <Input style={{ height: 36 }} />
                </AutoComplete>
              </div>
            </div>
          </div>

          {/* Cảnh báo nếu đã có bản ghi tồn tại */}
          {loadedExistingReport && (
            <Alert
              message={
                loadedExistingReport.trangThai === 'TAO_MOI' ? (
                  <span>
                    <strong>Kỳ báo cáo này đã tồn tại bản ghi nháp!</strong> Trạng thái hiện tại: <strong style={{ color: colors.primary[600] }}>Tạo mới</strong>. Hệ thống đã tự động nạp dữ liệu để tiếp tục chỉnh sửa.
                  </span>
                ) : (
                  <span>
                    <strong>Kỳ báo cáo này đã tồn tại bản ghi dữ liệu!</strong> Trạng thái hiện tại: <strong style={{ color: colors.primary[600] }}>{renderTrangThaiText(loadedExistingReport.trangThai)}</strong>. Hệ thống đã tự động nạp dữ liệu và khóa tính năng chỉnh sửa để đảm bảo an toàn số liệu.
                  </span>
                )
              }
              type={loadedExistingReport.trangThai === 'TAO_MOI' ? "info" : "warning"}
              showIcon
              style={{ borderRadius: radius.md }}
            />
          )}

          {/* Khối chi tiết thông tin cân đối */}
          <div style={{
            background: '#ffffff',
            borderRadius: radius.lg,
            border: `1px solid ${colors.border.split}`,
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.subsystem.portal }}>
                KHỐI CHI TIẾT THÔNG TIN CÂN ĐỐI
              </div>
              <Space size="small">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddRow}
                  style={{
                    fontWeight: 600,
                    ...(!isReadOnly ? {
                      background: colors.subsystem.portal,
                      borderColor: colors.subsystem.portal,
                    } : {})
                  }}
                  size="small"
                  disabled={isReadOnly}
                >
                  Thêm dòng
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleLoadLatestData}
                  style={{
                    fontWeight: 600,
                    ...(!isReadOnly ? {
                      color: colors.subsystem.portal,
                      borderColor: colors.subsystem.portal,
                    } : {})
                  }}
                  size="small"
                  disabled={isReadOnly}
                >
                  Lấy dữ liệu gần nhất
                </Button>
              </Space>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <Table
                dataSource={editDetails}
                columns={getEditTableColumns()}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: 'max-content', y: 380 }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL CHI TIẾT SỐ LIỆU CÂN ĐỐI THEO TỆP ──────── */}
      <Modal
        title={
          <Space size={12}>
            <span>Chi tiết số liệu cân đối</span>
            {selectedReport && renderTrangThaiTag(selectedReport.trangThai)}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)} style={{ background: colors.subsystem.portal, borderColor: colors.subsystem.portal }}>
            Đóng cửa sổ
          </Button>
        ]}
        bodyStyle={{ padding: '16px 24px 20px' }}
        style={{ top: 50 }}
        destroyOnClose
      >
        {selectedReport && (() => {
          const detailRows = getDetailRows(selectedReport);
          return (
            <div>
              {/* Thanh metadata của tệp */}
              <div style={{
                background: '#f8fafc',
                border: `1px solid ${colors.border.split}`,
                borderRadius: radius.md,
                padding: '14px 20px',
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
                    <strong>TPBANK - Hội sở (31358001)</strong>
                  </div>
                </div>
              </div>

              {/* Khối Stat Cards tổng hợp nhanh */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                {getModalStats(selectedReport, detailRows).map((s, idx) => (
                  <div key={idx} style={{
                    background: '#ffffff',
                    border: `1px solid ${colors.border.split}`,
                    borderRadius: radius.md,
                    padding: '14px 18px',
                    boxShadow: shadows.xs,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Text style={{ fontSize: 12, color: colors.text.secondary, fontWeight: 500, marginBottom: 4 }}>
                      {s.label}
                    </Text>
                    <Title level={4} style={{ margin: 0, color: s.color, fontWeight: 800 }}>
                      {s.value}
                    </Title>
                  </div>
                ))}
              </div>

              {/* Bảng chi tiết số liệu cân đối */}
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text.primary, marginBottom: 12 }}>
                BẢNG ĐỐI SOÁT CHI TIẾT SỐ LIỆU
              </div>
              <div style={{ overflowX: 'auto' }}>
                <Table
                  dataSource={detailRows}
                  columns={getDetailTableColumns(selectedReport.phanLoaiTep, detailRows)}
                  pagination={false}
                  bordered
                  size="middle"
                  scroll={{ x: 'max-content', y: 380 }}
                />
              </div>
            </div>
          );
        })()}
      </Modal>

      <style jsx global>{`
        .editable-cell-hover:hover {
          background-color: #f1f5f9;
        }
        .ant-table-wrapper .ant-table-thead > tr > th {
          text-align: center !important;
        }
        .ant-table-wrapper .ant-table-thead > tr > th .ant-table-cell-content {
          justify-content: center !important;
        }
        .ant-table-wrapper .ant-table-thead > tr > th.drag-over {
          border-left: 2px dashed #0284c7 !important;
          background-color: #e0f2fe !important;
        }
        .popover-column-item:hover {
          background-color: #f1f5f9;
        }
        .popover-column-item.popover-drag-over {
          background-color: #e0f2fe !important;
          border-left: 2px dashed #0284c7 !important;
        }
      `}</style>
    </PageLayout>
  );
};

export default SendBalanceModule;
