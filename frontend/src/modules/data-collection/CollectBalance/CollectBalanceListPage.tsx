'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Tooltip,
  message,
  DatePicker,
  Popover,
  Checkbox,
  Divider,
  Modal,
  Alert,
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  FileExcelOutlined,
  HolderOutlined,
  FilterOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  PageLayout,
  StatusTag,
  tablePagination,
  CodeText,
  FilterBar,
  FilterCol,
  SectionCard,
  ActionMenu,
} from '@/components/ui';
import { colors, radius, shadows } from '@/design-system';
import { useCollectBalance } from './useCollectBalance';
import { BalanceReport, ReconciliationDetailRow, TrangThaiTep } from './types';
import useHeaderActions from '@/hooks/useHeaderActions';
import dayjs, { Dayjs } from 'dayjs';
import { generateTreeReconciliationData, RAW_FILE_RULES } from '@/modules/web-portal/SendBalance/mockData';

const columnOptions = [
  { key: 'stt', label: 'STT', disabled: true },
  { key: 'nguonDuLieu', label: 'Nguồn', disabled: false },
  { key: 'tenTep', label: 'Tên tệp', disabled: false },
  { key: 'maDauMoi', label: 'Mã đầu mối', disabled: true },
  { key: 'loaiFile', label: 'Loại tệp', disabled: true },
  { key: 'ngayBaoCao', label: 'Ngày báo cáo', disabled: true },
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

  let width = 60 + 90 + 180; // base columns (STT: 60, Nguồn: 90, Nghiệp vụ: 180)
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

export const CollectBalanceListPage: React.FC = () => {
  const router = useRouter();
  const { data, customDetailsMap, isLoaded, saveReportChanges, acceptReport, rejectReport } = useCollectBalance();
  const [loading, setLoading] = useState(false);

  // Temporary filter states (applied on Search click)
  const [tempTenTep, setTempTenTep] = useState('');
  const [tempMaDauMoi, setTempMaDauMoi] = useState<string | null>(null);
  const [tempPhanLoaiTep, setTempPhanLoaiTep] = useState<string[]>([]);
  const [tempNgayBaoCao, setTempNgayBaoCao] = useState<Dayjs | null>(null);
  const [tempTrangThai, setTempTrangThai] = useState<string>('');

  // Active filter states
  const [filterTenTep, setFilterTenTep] = useState('');
  const [filterMaDauMoi, setFilterMaDauMoi] = useState<string | null>(null);
  const [filterPhanLoaiTep, setFilterPhanLoaiTep] = useState<string[]>([]);
  const [filterNgayBaoCao, setFilterNgayBaoCao] = useState<Dayjs | null>(null);
  const [filterTrangThai, setFilterTrangThai] = useState<string>('');

  // Column reordering & visibility states
  const [mainColumnOrder, setMainColumnOrder] = useState<string[]>([
    'stt', 'nguonDuLieu', 'tenTep', 'maDauMoi', 'loaiFile', 'ngayBaoCao', 'nghiepVu',
    'soLuongKhachHang', 'soLuongHopDong', 'maTienTe', 'duNo', 'tongDuNo', 'phatSinhGiaiNgan',
    'phatSinhTraNo', 'tongGiaTriBaoDam', 'giaTriBaoDamKhoanVay', 'doanhSoGiamNo',
    'duPhongPhaiTrich', 'duPhongDaTrich', 'trangThai', 'action'
  ]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'stt', 'nguonDuLieu', 'tenTep', 'maDauMoi', 'loaiFile', 'ngayBaoCao', 'nghiepVu',
    'soLuongKhachHang', 'soLuongHopDong', 'maTienTe', 'duNo', 'tongDuNo', 'phatSinhGiaiNgan',
    'phatSinhTraNo', 'tongGiaTriBaoDam', 'giaTriBaoDamKhoanVay', 'doanhSoGiamNo',
    'duPhongPhaiTrich', 'duPhongDaTrich', 'trangThai', 'action'
  ]);

  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const [treeData, setTreeData] = useState<ReconciliationDetailRow[]>([]);

  // Modal states for Xem chi tiết & Phê duyệt
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BalanceReport | null>(null);
  const [editDetails, setEditDetails] = useState<ReconciliationDetailRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate tree data on data changes
  useEffect(() => {
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

  // Đăng ký Header Actions
  useHeaderActions({
    title: 'Tiếp nhận thông tin cân đối',
    actions: [
      {
        key: 'refresh',
        label: 'Làm mới',
        icon: <ReloadOutlined />,
        onClick: () => {
          message.success('Đã cập nhật danh sách mới nhất!');
        }
      }
    ]
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setFilterTenTep(tempTenTep);
      setFilterMaDauMoi(tempMaDauMoi);
      setFilterPhanLoaiTep(tempPhanLoaiTep);
      setFilterNgayBaoCao(tempNgayBaoCao);
      setFilterTrangThai(tempTrangThai);
      setLoading(false);
      message.success('Đã hoàn tất tìm kiếm');
    }, 300);
  };

  const handleReset = () => {
    setTempTenTep('');
    setTempMaDauMoi(null);
    setTempPhanLoaiTep([]);
    setTempNgayBaoCao(null);
    setTempTrangThai('');

    setFilterTenTep('');
    setFilterMaDauMoi(null);
    setFilterPhanLoaiTep([]);
    setFilterNgayBaoCao(null);
    setFilterTrangThai('');
    message.info('Đã xóa tất cả bộ lọc');
  };

  const isFixedColumn = (key: string) => {
    return ['stt', 'nguonDuLieu', 'tenTep', 'action'].includes(key);
  };

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

  const handleViewDetail = (record: ReconciliationDetailRow) => {
    const parentReport = data.find(item => item.key === record.parentKey);
    if (parentReport) {
      setSelectedReport(parentReport);
      const custom = customDetailsMap[parentReport.key];
      if (custom) {
        setEditDetails(custom);
      } else {
        const parentRow = generateTreeReconciliationData([parentReport]).find(item => item.isParent);
        if (parentRow && parentRow.children) {
          setEditDetails(parentRow.children);
        } else {
          setEditDetails([]);
        }
      }
      setDetailModalVisible(true);
    }
  };

  const handleEditCellChange = (rowKey: string, field: keyof ReconciliationDetailRow, value: any) => {
    setEditDetails(prev => prev.map(row => {
      if (row.key === rowKey) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleSave = () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    setTimeout(() => {
      saveReportChanges(selectedReport.key, editDetails);
      setIsSubmitting(false);
      message.success('Đã lưu thay đổi số liệu!');
    }, 500);
  };

  const handleAccept = () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    setTimeout(() => {
      acceptReport(selectedReport.key, editDetails);
      setIsSubmitting(false);
      setDetailModalVisible(false);
      message.success('Đã tiếp nhận báo cáo thành công!');
    }, 800);
  };

  const handleReject = () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    setTimeout(() => {
      rejectReport(selectedReport.key);
      setIsSubmitting(false);
      setDetailModalVisible(false);
      message.success('Đã từ chối và trả lại báo cáo cho TCTD!');
    }, 800);
  };

  // Dynamic filter options generated from dataset
  const maDauMoiOptions = Array.from(new Set(data.map(item => item.maDauMoi))).map(code => ({
    value: code,
    label: `${code} - ${code === '31358001' ? 'TPBank' : code === '01201001' ? 'Vietcombank' : code === '01203002' ? 'BIDV' : 'TCTD'}`
  }));

  const filteredTreeData = treeData.filter(item => {
    const matchTenTep = !filterTenTep || item.tenTep.toLowerCase().includes(filterTenTep.toLowerCase());
    const matchMaDauMoi = !filterMaDauMoi || item.maDauMoi === filterMaDauMoi;
    const matchPhanLoaiTep = !filterPhanLoaiTep || filterPhanLoaiTep.length === 0 || filterPhanLoaiTep.includes(item.loaiFile);
    const matchNgayBaoCao = !filterNgayBaoCao || item.ngayBaoCao === filterNgayBaoCao.format('DD/MM/YYYY');
    const matchTrangThai = !filterTrangThai || item.trangThai === filterTrangThai;
    return matchTenTep && matchMaDauMoi && matchPhanLoaiTep && matchNgayBaoCao && matchTrangThai;
  });

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
      render: (text: string, record: ReconciliationDetailRow) => record.isParent ? text : "-"
    },
    {
      title: 'Tên tệp',
      dataIndex: 'tenTep',
      key: 'tenTep',
      width: 240,
      fixed: 'left' as const,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <span
            style={{
              textDecoration: 'underline',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={() => handleViewDetail(record)}
          >
            <CodeText muted style={{ fontSize: '11.5px', fontWeight: 500, color: colors.primary[500] }}>
              {text}
            </CodeText>
          </span>
        );
      }
    },
    {
      title: 'Mã đầu mối',
      dataIndex: 'maDauMoi',
      key: 'maDauMoi',
      width: 150,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return <span style={{ fontWeight: 600 }}>{text}</span>;
      }
    },
    {
      title: 'Loại tệp',
      dataIndex: 'loaiFile',
      key: 'loaiFile',
      width: 120,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return <Tag color="blue">{text}</Tag>;
      }
    },
    {
      title: 'Ngày báo cáo',
      dataIndex: 'ngayBaoCao',
      key: 'ngayBaoCao',
      width: 140,
      align: 'center' as const,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return text;
      }
    },
    {
      title: 'Nghiệp vụ',
      dataIndex: 'nghiepVu',
      key: 'nghiepVu',
      width: 150,
      render: (text: string, record: ReconciliationDetailRow) => {
        if (record.isParent) return <span style={{ color: colors.text.tertiary, fontStyle: 'italic' }}>-</span>;
        return <span style={{ fontWeight: 650, color: colors.primary[700] }}>{text}</span>;
      }
    },
    {
      title: 'Số lượng khách hàng',
      dataIndex: 'soLuongKhachHang',
      key: 'soLuongKhachHang',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Số lượng hợp đồng',
      dataIndex: 'soLuongHopDong',
      key: 'soLuongHopDong',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
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
          <span style={{
            fontWeight: 700,
            color: val === 'VND' ? colors.success.dark : val === 'USD' ? colors.primary[600] : '#d4b106'
          }}>{val}</span>
        );
      }
    },
    {
      title: 'Dư nợ',
      dataIndex: 'duNo',
      key: 'duNo',
      width: 150,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Tổng dư nợ',
      dataIndex: 'tongDuNo',
      key: 'tongDuNo',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Số tiền giải ngân',
      dataIndex: 'phatSinhGiaiNgan',
      key: 'phatSinhGiaiNgan',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Số tiền trả nợ',
      dataIndex: 'phatSinhTraNo',
      key: 'phatSinhTraNo',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Giá trị tài sản bảo đảm',
      dataIndex: 'tongGiaTriBaoDam',
      key: 'tongGiaTriBaoDam',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Giá trị bảo đảm khoản vay',
      dataIndex: 'giaTriBaoDamKhoanVay',
      key: 'giaTriBaoDamKhoanVay',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Doanh số giảm',
      dataIndex: 'doanhSoGiamNo',
      key: 'doanhSoGiamNo',
      width: 160,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Dự phòng phải trích nội bảng',
      dataIndex: 'duPhongPhaiTrich',
      key: 'duPhongPhaiTrich',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Dự phòng đã trích nội bảng',
      dataIndex: 'duPhongDaTrich',
      key: 'duPhongDaTrich',
      width: 180,
      align: 'right' as const,
      render: (val: string | null, record: ReconciliationDetailRow) => {
        if (record.isParent) return "-";
        return val || <span style={{ color: '#bfbfbf' }}>-</span>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      align: 'center' as const,
      render: (status: string, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        return (
          <StatusTag 
            status={status === 'DA_GUI_CIC' ? 'PENDING' : 'APPROVED'}
            label={status === 'DA_GUI_CIC' ? 'Chờ tiếp nhận' : 'Đã tiếp nhận'}
          />
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: ReconciliationDetailRow) => {
        if (!record.isParent) return "";
        const menuItems = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => {
              handleViewDetail(record);
            }
          }
        ];
        return <ActionMenu items={menuItems} />;
      }
    }
  ];

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

  const getEditTableColumns = (report: BalanceReport, isReadOnly: boolean) => {
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === report.phanLoaiTep);
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
        render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
      },
      {
        title: 'Nghiệp vụ',
        dataIndex: 'nghiepVu',
        key: 'nghiepVu',
        width: 180,
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

    const renderNumericInput = (field: keyof ReconciliationDetailRow, ruleCode: string | null, label: string) => {
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

    if (rule.soLuongKhachHangRule !== null) condCols.push(renderNumericInput('soLuongKhachHang', rule.soLuongKhachHangRule, 'Số lượng khách hàng'));
    if (rule.soLuongHopDongRule !== null) condCols.push(renderNumericInput('soLuongHopDong', rule.soLuongHopDongRule, 'Số lượng hợp đồng'));

    if (rule.maTienTeRule !== null) {
      condCols.push({
        title: 'Mã tiền tệ',
        dataIndex: 'maTienTe',
        key: 'maTienTe',
        width: 110,
        align: 'center' as const,
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

    if (rule.duNoRule !== null) condCols.push(renderNumericInput('duNo', rule.duNoRule, 'Dư nợ'));
    if (rule.tongDuNoRule !== null) condCols.push(renderNumericInput('tongDuNo', rule.tongDuNoRule, 'Tổng dư nợ'));
    if (rule.phatSinhGiaiNganRule !== null) condCols.push(renderNumericInput('phatSinhGiaiNgan', rule.phatSinhGiaiNganRule, 'Số tiền giải ngân'));
    if (rule.phatSinhTraNoRule !== null) condCols.push(renderNumericInput('phatSinhTraNo', rule.phatSinhTraNoRule, 'Số tiền trả nợ'));
    if (rule.tongGiaTriBaoDamRule !== null) condCols.push(renderNumericInput('tongGiaTriBaoDam', rule.tongGiaTriBaoDamRule, 'Giá trị tài sản bảo đảm'));
    if (rule.giaTriBaoDamKhoanVayRule !== null) condCols.push(renderNumericInput('giaTriBaoDamKhoanVay', rule.giaTriBaoDamKhoanVayRule, 'Giá trị bảo đảm khoản vay'));
    if (rule.doanhSoGiamNoRule !== null) condCols.push(renderNumericInput('doanhSoGiamNo', rule.doanhSoGiamNoRule, 'Doanh số giảm'));
    if (rule.duPhongPhaiTrichRule !== null) condCols.push(renderNumericInput('duPhongPhaiTrich', rule.duPhongPhaiTrichRule, 'Dự phòng phải trích nội bảng'));
    if (rule.duPhongDaTrichRule !== null) condCols.push(renderNumericInput('duPhongDaTrich', rule.duPhongDaTrichRule, 'Dự phòng đã trích nội bảng'));

    return [...baseCols, ...condCols];
  };

  const renderTrangThaiTag = (status: string) => {
    return (
      <StatusTag 
        status={status === 'DA_GUI_CIC' ? 'PENDING' : 'APPROVED'}
        label={status === 'DA_GUI_CIC' ? 'Chờ tiếp nhận' : 'Đã tiếp nhận'}
      />
    );
  };

  return (
    <PageLayout>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Bộ lọc Tìm kiếm */}
        <FilterBar inCard onSearch={handleSearch} onReset={handleReset} loading={loading} showAddFilter={true}>
          {/* Tên tệp */}
          <FilterCol minWidth={200}>
            <Tooltip title="Tên tệp" placement="top" arrow>
              <Input
                placeholder="Tìm theo tên tệp..."
                value={tempTenTep}
                onChange={e => setTempTenTep(e.target.value)}
                style={{ width: '100%' }}
                allowClear
              />
            </Tooltip>
          </FilterCol>

          {/* Mã đầu mối */}
          <FilterCol minWidth={200}>
            <Tooltip title="Mã đầu mối" placement="top" arrow>
              <Select
                placeholder="Chọn mã đầu mối..."
                value={tempMaDauMoi || undefined}
                onChange={setTempMaDauMoi}
                style={{ width: '100%' }}
                options={maDauMoiOptions}
                allowClear
              />
            </Tooltip>
          </FilterCol>

          {/* Loại tệp */}
          <FilterCol minWidth={220}>
            <Tooltip title="Loại tệp" placement="top" arrow>
              <Select
                mode="multiple"
                placeholder="Chọn loại tệp..."
                value={tempPhanLoaiTep}
                onChange={setTempPhanLoaiTep}
                style={{ width: '100%' }}
                maxTagCount="responsive"
                allowClear
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
          <FilterCol minWidth={180}>
            <Tooltip title="Ngày báo cáo" placement="top" arrow>
              <DatePicker
                placeholder="Ngày báo cáo"
                format="DD/MM/YYYY"
                value={tempNgayBaoCao}
                onChange={setTempNgayBaoCao}
                style={{ width: '100%' }}
                allowClear
              />
            </Tooltip>
          </FilterCol>

          {/* Trạng thái */}
          <FilterCol minWidth={160}>
            <Tooltip title="Trạng thái" placement="top" arrow>
              <Select
                placeholder="Chọn trạng thái..."
                value={tempTrangThai || undefined}
                onChange={setTempTrangThai}
                style={{ width: '100%' }}
                allowClear
              >
                <Select.Option value="DA_GUI_CIC">Chờ tiếp nhận</Select.Option>
                <Select.Option value="DA_TIEP_NHAN">Đã tiếp nhận</Select.Option>
              </Select>
            </Tooltip>
          </FilterCol>
        </FilterBar>

        {/* Khối Bảng Dữ Liệu */}
        <SectionCard
          flex
          noPadding
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
                  columns={preparedMainColumns} 
                  dataSource={filteredTreeData} 
                  rowKey="key"
                  loading={!isLoaded}
                  pagination={tablePagination()}
                  bordered
                  size="middle"
                  scroll={{ x: 2500, y: 500 }}
                />
              );
            })()}
          </div>
        </SectionCard>
      </div>

      {/* ─── MODAL CHI TIẾT SỐ LIỆU CÂN ĐỐI (CORE) ─── */}
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button
              key="close"
              onClick={() => setDetailModalVisible(false)}
              style={{ minWidth: 100, borderRadius: radius.md }}
            >
              Đóng
            </Button>
            {selectedReport && selectedReport.trangThai !== 'DA_TIEP_NHAN' && (
              <>
                <Button
                  key="save"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={isSubmitting}
                  style={{ minWidth: 100, borderRadius: radius.md }}
                >
                  Lưu
                </Button>
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={handleReject}
                  loading={isSubmitting}
                  style={{ minWidth: 100, borderRadius: radius.md }}
                >
                  Từ chối
                </Button>
                <Button
                  key="accept"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleAccept}
                  loading={isSubmitting}
                  style={{ minWidth: 100, borderRadius: radius.md }}
                >
                  Tiếp nhận
                </Button>
              </>
            )}
          </div>
        }
        styles={{
          body: {
            maxHeight: 'calc(80vh - 120px)',
            overflowY: 'auto',
            padding: '0 24px 20px'
          }
        }}
        style={{ top: '10vh', maxWidth: '85vw' }}
        destroyOnHidden
      >
        {selectedReport && (
          <div style={{ paddingTop: 16 }}>
            {selectedReport.trangThai === 'DA_TIEP_NHAN' && (
              <Alert
                message="Báo cáo đã được tiếp nhận. Chức năng chỉnh sửa đã bị khóa."
                type="success"
                showIcon
                style={{ borderRadius: radius.md, marginBottom: 16 }}
              />
            )}

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
                  <span style={{ fontSize: 13, color: colors.text.secondary }}>Tên tệp báo cáo nguồn: </span>
                  <strong style={{ fontFamily: 'monospace', color: colors.primary[700] }}>{selectedReport.tenTep}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 13, color: colors.text.secondary }}>Kỳ báo cáo: </span>
                  <strong>{selectedReport.ngayBaoCao}</strong>
                </div>
              </div>
              <div style={{ borderTop: `1px dashed ${colors.border.split}`, paddingTop: 8 }}>
                <span style={{ fontSize: 13, color: colors.text.secondary }}>Đơn vị gửi: </span>
                <strong>{selectedReport.maDauMoi} - {selectedReport.maDauMoi === '31358001' ? 'TPBank' : selectedReport.maDauMoi === '01201001' ? 'Vietcombank' : 'BIDV'}</strong>
              </div>
            </div>

            {/* Bảng chi tiết */}
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.text.primary, marginBottom: 12 }}>
              BẢNG CHI TIẾT SỐ LIỆU CÂN ĐỐI
            </div>
            <Table
              dataSource={editDetails}
              columns={getEditTableColumns(selectedReport, selectedReport.trangThai === 'DA_TIEP_NHAN')}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: 'max-content' }}
              rowKey="key"
            />
          </div>
        )}
      </Modal>

      <style jsx global>{`
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
