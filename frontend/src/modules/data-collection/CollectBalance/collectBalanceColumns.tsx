import React from 'react';
import { Input, Select, Tooltip } from 'antd';
import { colors, radius } from '@/design-system';
import { BalanceReport, ReconciliationDetailRow } from './types';
import { RAW_FILE_RULES } from '@/modules/web-portal/SendBalance/mockData';

// Loại tệp không có bóc tách nghiệp vụ con
const NO_DETAIL_FILES = ['D10', 'D11', 'D12', 'D20', 'D40', 'D60', 'D70'];

// Bề rộng modal chi tiết theo số cột chỉ tiêu của loại tệp
export const getDetailTableWidth = (loaiFile: string): number => {
  const rule = RAW_FILE_RULES.find(r => r.loaiFile === loaiFile);
  if (!rule) return 600;

  let width = 60 + 90 + 180; // STT + Nguồn + Nghiệp vụ
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

interface BuildEditColumnsArgs {
  report: BalanceReport;
  isReadOnly: boolean;
  onCellChange: (rowKey: string, field: keyof ReconciliationDetailRow, value: any) => void;
  // map rowKey → field đã sửa, dùng để highlight ô
  editedFields?: Record<string, string[]>;
}

// Bộ dựng cột edit số liệu cân đối — dùng chung cho Modal trong
// list và trang chi tiết [id]. Header gạch chân tooltip mã quy tắc;
// ô đã sửa được tô viền cảnh báo.
export const buildEditTableColumns = ({
  report,
  isReadOnly,
  onCellChange,
  editedFields = {},
}: BuildEditColumnsArgs) => {
  const rule = RAW_FILE_RULES.find(r => r.loaiFile === report.phanLoaiTep);
  if (!rule) return [];

  const isNoDetails = NO_DETAIL_FILES.includes(rule.loaiFile);
  const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

  const isEdited = (rowKey: string, field: string): boolean =>
    !!editedFields[rowKey]?.includes(field);

  const editedStyle: React.CSSProperties = {
    borderColor: colors.warning.base,
    boxShadow: `0 0 0 2px ${colors.warning.base}33`,
  };

  const baseCols = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
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
              onChange={(newVal) => onCellChange(record.key, 'nghiepVu', newVal)}
              style={{ width: '100%', ...(isEdited(record.key, 'nghiepVu') ? editedStyle : {}) }}
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
      },
    },
  ];

  const condCols: any[] = [];

  const renderNumericInput = (
    field: keyof ReconciliationDetailRow,
    ruleCode: string | null,
    label: string
  ) => ({
    title: (
      <Tooltip title={ruleCode} placement="top" arrow>
        <span style={{ cursor: 'help', borderBottom: `1px dashed ${colors.warning.base}` }}>
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
        onChange={(e) => onCellChange(record.key, field, e.target.value)}
        placeholder={ruleCode || undefined}
        size="small"
        style={{
          textAlign: 'right',
          width: '100%',
          borderRadius: radius.sm,
          ...(isEdited(record.key, field as string) ? editedStyle : {}),
        }}
        disabled={isReadOnly}
      />
    ),
  });

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
          onChange={(newVal) => onCellChange(record.key, 'maTienTe', newVal)}
          style={{ width: '100%', ...(isEdited(record.key, 'maTienTe') ? editedStyle : {}) }}
          placeholder="Tiền tệ"
          size="small"
          disabled={isReadOnly}
        >
          <Select.Option value="VND">VND</Select.Option>
          <Select.Option value="USD">USD</Select.Option>
          <Select.Option value="XAU">XAU</Select.Option>
        </Select>
      ),
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
