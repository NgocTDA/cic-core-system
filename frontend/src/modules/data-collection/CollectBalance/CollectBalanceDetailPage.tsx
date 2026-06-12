'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Space, Input, Select, DatePicker, Button, Table, Tooltip, message, Alert } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { colors, radius, shadows } from '@/design-system';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { useCollectBalance } from './useCollectBalance';
import { BalanceReport, ReconciliationDetailRow } from './types';
import { RAW_FILE_RULES, generateTreeReconciliationData } from '@/modules/web-portal/SendBalance/mockData';

const { Text } = Typography;

interface Props {
  id: string;
}

export const CollectBalanceDetailPage: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { data, customDetailsMap, isLoaded, saveReportChanges, acceptReport, rejectReport } = useCollectBalance();
  
  const [report, setReport] = useState<BalanceReport | null>(null);
  const [editDetails, setEditDetails] = useState<ReconciliationDetailRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && id) {
      const found = data.find(item => item.key === id);
      if (found) {
        setReport(found);
        
        const custom = customDetailsMap[found.key];
        if (custom) {
          setEditDetails(custom);
        } else {
          const parentRow = generateTreeReconciliationData([found]).find(item => item.isParent);
          if (parentRow && parentRow.children) {
            setEditDetails(parentRow.children);
          }
        }
      } else {
        message.error('Không tìm thấy thông tin báo cáo!');
        router.push('/data-collection/collect/balance');
      }
    }
  }, [id, data, customDetailsMap, isLoaded, router]);

  const isReadOnly = report?.trangThai === 'DA_TIEP_NHAN';

  useHeaderActions({
    title: report ? `Chi tiết báo cáo: ${report.tenTep}` : 'Chi tiết báo cáo cân đối',
    actions: [
      {
        key: 'back',
        label: 'Quay lại',
        icon: <ArrowLeftOutlined />,
        onClick: () => router.push('/data-collection/collect/balance')
      }
    ]
  }, [report, router]);

  const handleEditCellChange = (rowKey: string, field: keyof ReconciliationDetailRow, value: any) => {
    setEditDetails(prev => prev.map(row => {
      if (row.key === rowKey) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleSave = () => {
    if (!report) return;
    setIsSubmitting(true);
    setTimeout(() => {
      saveReportChanges(report.key, editDetails);
      setIsSubmitting(false);
      message.success('Đã lưu thay đổi số liệu!');
    }, 500);
  };

  const handleAccept = () => {
    if (!report) return;
    setIsSubmitting(true);
    setTimeout(() => {
      acceptReport(report.key, editDetails);
      setIsSubmitting(false);
      message.success('Đã tiếp nhận báo cáo thành công!');
      router.push('/data-collection/collect/balance');
    }, 800);
  };

  const handleReject = () => {
    if (!report) return;
    setIsSubmitting(true);
    setTimeout(() => {
      rejectReport(report.key);
      setIsSubmitting(false);
      message.success('Đã từ chối và trả lại báo cáo cho TCTD!');
      router.push('/data-collection/collect/balance');
    }, 800);
  };

  const getEditTableColumns = () => {
    if (!report) return [];
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

  if (!report) {
    return <PageLayout><div style={{ padding: 24 }}>Đang tải dữ liệu...</div></PageLayout>;
  }

  return (
    <PageLayout noPadding>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '24px 24px 24px'
      }}>

        {isReadOnly && (
          <Alert
            message="Báo cáo đã được tiếp nhận. Chức năng chỉnh sửa đã bị khóa."
            type="success"
            showIcon
            style={{ borderRadius: radius.md }}
          />
        )}

        <div style={{
          background: '#ffffff',
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.split}`,
          padding: '20px',
          boxShadow: shadows.sm
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: colors.primary[700], marginBottom: 16 }}>
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
              <Input value={report.maDauMoi} disabled style={{ width: '100%', height: 36 }} />
            </div>
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Loại tệp
              </Text>
              <Input value={report.phanLoaiTep} disabled style={{ width: '100%', height: 36 }} />
            </div>
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Ngày báo cáo
              </Text>
              <DatePicker
                value={dayjs(report.ngayBaoCao, 'DD/MM/YYYY')}
                format="DD/MM/YYYY"
                style={{ width: '100%', height: 36 }}
                disabled
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Tên tệp
              </Text>
              <Input value={report.tenTep} disabled style={{ width: '100%', height: 36 }} />
            </div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.split}`,
          padding: '20px',
          boxShadow: shadows.sm
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.primary[700] }}>
              KHỐI CHI TIẾT THÔNG TIN CÂN ĐỐI
            </div>
          </div>

          <Table
            dataSource={editDetails}
            columns={getEditTableColumns()}
            pagination={false}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            rowKey="key"
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          padding: '16px 0 32px'
        }}>
          <Button
            onClick={() => router.push('/data-collection/collect/balance')}
            style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
          >
            Trở về danh sách
          </Button>
          
          {!isReadOnly && (
            <>
              <Button
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={isSubmitting}
                style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
              >
                Lưu nháp
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleReject}
                loading={isSubmitting}
                style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleAccept}
                loading={isSubmitting}
                style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
              >
                Tiếp nhận
              </Button>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
