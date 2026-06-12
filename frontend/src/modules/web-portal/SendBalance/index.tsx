'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  message,
  Popover,
  Checkbox,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  SettingOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
  EyeOutlined,
  DeleteOutlined,
  UndoOutlined,
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
import { useSendBalance } from './useSendBalance';
import { ReconciliationDetailRow, BalanceReport, TrangThaiTep } from './types';
import {
  RAW_FILE_RULES,
  getLoaiToChucByMaDauMoi,
  getFormattedDonViGui,
  generateTreeReconciliationData
} from './mockData';
import { EditableCell } from './EditableCell';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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

const getDetailTableWidth = (loaiFile: string): number => {
  const rule = RAW_FILE_RULES.find(r => r.loaiFile === loaiFile);
  if (!rule) return 600;

  let width = 60 + 90 + 150; // base columns (STT: 60, Nguồn: 90, Nghiệp vụ: 150)
  if (rule.soLuongKhachHangRule !== null) width += 150;
  if (rule.soLuongHopDongRule !== null) width += 150;
  if (rule.maTienTeRule !== null) width += 110;
  if (rule.duNoRule !== null) width += 150;
  if (rule.tongDuNoRule !== null) width += 150;
  if (rule.phatSinhGiaiNganRule !== null) width += 150;
  if (rule.phatSinhTraNoRule !== null) width += 150;
  if (rule.tongGiaTriBaoDamRule !== null) width += 150;
  if (rule.giaTriBaoDamKhoanVayRule !== null) width += 150;
  if (rule.doanhSoGiamNoRule !== null) width += 150;
  if (rule.duPhongPhaiTrichRule !== null) width += 150;
  if (rule.duPhongDaTrichRule !== null) width += 150;

  return width + 120;
};

const SendBalanceModule: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    data,
    customDetailsMap,
    isLoaded,
    deleteReport,
    revokeReport,
    handleCellEdit
  } = useSendBalance();

  useHeaderActions({
    title: 'Danh sách báo cáo thông tin cân đối',
    actions: [
      {
        key: 'add',
        label: 'Gửi báo cáo mới',
        icon: <CloudUploadOutlined />,
        type: 'primary',
        onClick: () => {
          router.push('/web-portal/send-balance/new');
        }
      }
    ]
  }, [router]);

  // States cho thứ tự cột của 2 bảng
  const [mainColumnOrder, setMainColumnOrder] = useState<string[]>([
    'stt', 'nguonDuLieu', 'tenTep', 'maDauMoi', 'ngayBaoCao', 'loaiFile', 'nghiepVu',
    'soLuongKhachHang', 'soLuongHopDong', 'maTienTe', 'duNo', 'tongDuNo', 'phatSinhGiaiNgan',
    'phatSinhTraNo', 'tongGiaTriBaoDam', 'giaTriBaoDamKhoanVay', 'doanhSoGiamNo',
    'duPhongPhaiTrich', 'duPhongDaTrich', 'trangThai', 'action'
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

  // Form states cho bộ lọc
  const [tenTepFilter, setTenTepFilter] = useState('');
  const [loaiTepFilter, setLoaiTepFilter] = useState<string[]>([]);
  const [trangThaiFilter, setTrangThaiFilter] = useState<string>('');
  const [columnSearchTerm, setColumnSearchTerm] = useState('');

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

  // ─── EVENT HANDLERS ────────────────────────────────────────────────

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      message.success('Đã hoàn tất tìm kiếm');
      setLoading(false);
    }, 300);
  };

  const handleReset = () => {
    setTenTepFilter('');
    setLoaiTepFilter([]);
    setTrangThaiFilter('');
    message.info('Đã xóa tất cả bộ lọc');
  };

  // Lọc dữ liệu hiển thị theo bộ lọc client-side
  const getFilteredTreeData = () => {
    let result = [...treeData];

    // Lọc theo Tên tệp
    if (tenTepFilter) {
      result = result.filter(item =>
        item.tenTep.toLowerCase().includes(tenTepFilter.toLowerCase())
      );
    }

    // Lọc theo Loại tệp
    if (loaiTepFilter && loaiTepFilter.length > 0) {
      result = result.filter(item =>
        loaiTepFilter.includes(item.loaiFile)
      );
    }

    // Lọc theo Trạng thái
    if (trangThaiFilter) {
      result = result.filter(item =>
        item.trangThai === trangThaiFilter
      );
    }

    return result;
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
        revokeReport(record.key);
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
        deleteReport(record.key);
        message.success(`Đã xóa tệp báo cáo ${record.tenTep} thành công!`);
      }
    });
  };

  // ─── RENDER HELPERS FOR STATUS ────────────────────────────────────

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
        render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
        filters: Array.from(new Set(rows.map(item => item.nguonDuLieu).filter((val): val is string => !!val))).sort().map(val => ({ text: val, value: val })),
        onFilter: (value: any, record: ReconciliationDetailRow) => record.nguonDuLieu === value,
      },
      {
        title: 'Nghiệp vụ',
        dataIndex: 'nghiepVu',
        key: 'nghiepVu',
        width: 150,
        render: (text: string) => <span style={{ fontWeight: 650, color: colors.primary[700] }}>{text}</span>,
        filters: Array.from(new Set(rows.map(item => item.nghiepVu).filter((val): val is string => !!val))).sort().map(val => ({ text: val, value: val })),
        onFilter: (value: any, record: ReconciliationDetailRow) => record.nghiepVu === value,
      }
    ];

    const condCols = [];

    const renderReadOnlyCell = (field: keyof ReconciliationDetailRow, ruleCode: string | null, label: string) => {
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

    if (rule.soLuongKhachHangRule !== null) condCols.push(renderReadOnlyCell('soLuongKhachHang', rule.soLuongKhachHangRule, 'Số lượng khách hàng'));
    if (rule.soLuongHopDongRule !== null) condCols.push(renderReadOnlyCell('soLuongHopDong', rule.soLuongHopDongRule, 'Số lượng hợp đồng'));

    if (rule.maTienTeRule !== null) {
      condCols.push({
        title: 'Mã tiền tệ',
        dataIndex: 'maTienTe',
        key: 'maTienTe',
        width: 110,
        align: 'center' as const,
        render: (val: string | null) => (
          val ? (
            <span style={{
              fontWeight: 700,
              color: val === 'VND' ? colors.success.dark : val === 'USD' ? colors.primary[600] : '#d4b106'
            }}>{val}</span>
          ) : <span style={{ color: '#bfbfbf' }}>-</span>
        ),
        filters: Array.from(new Set(rows.map(item => item.maTienTe).filter((val): val is string => !!val))).sort().map(val => ({ text: val, value: val })),
        onFilter: (value: any, record: ReconciliationDetailRow) => record.maTienTe === value,
      });
    }

    if (rule.duNoRule !== null) condCols.push(renderReadOnlyCell('duNo', rule.duNoRule, 'Dư nợ'));
    if (rule.tongDuNoRule !== null) condCols.push(renderReadOnlyCell('tongDuNo', rule.tongDuNoRule, 'Tổng dư nợ'));
    if (rule.phatSinhGiaiNganRule !== null) condCols.push(renderReadOnlyCell('phatSinhGiaiNgan', rule.phatSinhGiaiNganRule, 'Số tiền giải ngân'));
    if (rule.phatSinhTraNoRule !== null) condCols.push(renderReadOnlyCell('phatSinhTraNo', rule.phatSinhTraNoRule, 'Số tiền trả nợ'));
    if (rule.tongGiaTriBaoDamRule !== null) condCols.push(renderReadOnlyCell('tongGiaTriBaoDam', rule.tongGiaTriBaoDamRule, 'Giá trị tài sản bảo đảm'));
    if (rule.giaTriBaoDamKhoanVayRule !== null) condCols.push(renderReadOnlyCell('giaTriBaoDamKhoanVay', rule.giaTriBaoDamKhoanVayRule, 'Giá trị bảo đảm khoản vay'));
    if (rule.doanhSoGiamNoRule !== null) condCols.push(renderReadOnlyCell('doanhSoGiamNo', rule.doanhSoGiamNoRule, 'Doanh số giảm'));
    if (rule.duPhongPhaiTrichRule !== null) condCols.push(renderReadOnlyCell('duPhongPhaiTrich', rule.duPhongPhaiTrichRule, 'Dự phòng phải trích nội bảng'));
    if (rule.duPhongDaTrichRule !== null) condCols.push(renderReadOnlyCell('duPhongDaTrich', rule.duPhongDaTrichRule, 'Dự phòng đã trích nội bảng'));

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
                handleViewDetail(record);
              }
            }
          ];

        // Hành động chỉnh sửa (Chỉ hiển thị nếu trạng thái là Tạo mới)
        if (record.trangThai === 'TAO_MOI') {
          menuItems.push({
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <PlusOutlined style={{ color: colors.primary[600] }} />,
            onClick: () => {
              router.push(`/web-portal/send-balance/new?key=${record.parentKey}`);
            }
          });
        }

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
            label: 'Xóa',
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
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Bộ lọc Tìm kiếm */}
        <FilterBar inCard onSearch={handleSearch} onReset={handleReset} loading={loading} showAddFilter={false}>
          {/* Tên tệp */}
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

          {/* Loại tệp */}
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

          {/* Ngày báo cáo */}
          <FilterCol minWidth={220}>
            <Tooltip title="Ngày báo cáo" placement="top" arrow>
              <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" />
            </Tooltip>
          </FilterCol>

          {/* Ngày gửi */}
          <FilterCol minWidth={220}>
            <Tooltip title="Ngày gửi" placement="top" arrow>
              <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} format="DD/MM/YYYY" />
            </Tooltip>
          </FilterCol>

          {/* Trạng thái */}
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

        {/* Bảng danh sách */}
        <SectionCard
          flex
          noPadding
          title="Danh sách báo cáo thông tin cân đối"
          // count={`Mở rộng dòng để xem chi tiết đối soát`}
          extra={
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ background: colors.subsystem.portal, borderColor: colors.subsystem.portal }}
                onClick={() => {
                  router.push('/web-portal/send-balance/new');
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
                  dataSource={getFilteredTreeData()}
                  columns={preparedMainColumns}
                  pagination={tablePagination()}
                  loading={loading || !isLoaded}
                  size="middle"
                  scroll={{ x: 2500, y: 500 }}
                  bordered
                />
              );
            })()}
          </div>
        </SectionCard>
      </div>

      {/* ─── MODAL CHI TIẾT SỐ LIỆU CÂN ĐỐI THEO TỆP (GIỮ NGUYÊN NHƯ CŨ) ─── */}
      <Modal
        title={
          <Space size={12}>
            <span>Chi tiết số liệu cân đối</span>
            {selectedReport && renderTrangThaiTag(selectedReport.trangThai)}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={selectedReport ? getDetailTableWidth(selectedReport.phanLoaiTep) : 600}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              key="close"
              type="primary"
              onClick={() => setDetailModalVisible(false)}
              style={{
                minWidth: 100,
                borderRadius: radius.md,
                background: colors.subsystem.portal,
                borderColor: colors.subsystem.portal
              }}
            >
              Đóng
            </Button>
          </div>
        }
        styles={{
          body: {
            maxHeight: 'calc(80vh - 120px)',
            overflowY: 'auto',
            padding: '0 24px 20px'
          }
        }}
        style={{ top: '10vh', maxWidth: '80vw' }}
        destroyOnHidden
      >
        {selectedReport && (() => {
          const detailRows = getDetailRows(selectedReport);
          return (
            <div style={{ paddingTop: 16 }}>
              {/* Thanh metadata của tệp */}
              <div style={{
                background: '#f8fafc',
                border: `1px solid ${colors.border.split}`,
                borderRadius: radius.md,
                padding: '14px 20px',
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}>
                <div style={{
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
                  <div>
                    <Text style={{ fontSize: 13, color: colors.text.secondary }}>Kỳ báo cáo: </Text>
                    <strong>{selectedReport.ngayBaoCao}</strong>
                  </div>
                </div>
                <div style={{ borderTop: `1px dashed ${colors.border.split}`, paddingTop: 8 }}>
                  <Text style={{ fontSize: 13, color: colors.text.secondary }}>Đơn vị gửi: </Text>
                  <strong>{getFormattedDonViGui(selectedReport.maDauMoi)}</strong>
                </div>
              </div>

              {/* Bảng chi tiết số liệu cân đối */}
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text.primary, marginBottom: 12 }}>
                BẢNG CHI TIẾT SỐ LIỆU CÂN ĐỐI
              </div>
              <Table
                dataSource={detailRows}
                columns={getDetailTableColumns(selectedReport.phanLoaiTep, detailRows)}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: 'max-content' }}
                sticky
              />
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
