'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Input, DatePicker, Button, Table, message, Alert, Timeline, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  EditOutlined,
  HistoryOutlined,
  AuditOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { colors, radius, shadows } from '@/design-system';
import { PageLayout } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import { useCollectBalance } from './useCollectBalance';
import { useReportReview } from './useReportReview';
import { RejectReasonModal } from './RejectReasonModal';
import { buildEditTableColumns } from './collectBalanceColumns';
import { BalanceReport, ReconciliationDetailRow, ProcessingAction } from './types';
import { generateTreeReconciliationData } from '@/modules/web-portal/SendBalance/mockData';

const { Text } = Typography;

interface Props {
  id: string;
}

// Nhãn + màu cho từng loại hành động trong lịch sử xử lý
const ACTION_META: Record<ProcessingAction, { label: string; color: string; icon: React.ReactNode }> = {
  RECEIVED: { label: 'Tiếp nhận vào hàng đợi', color: colors.info.base, icon: <InboxOutlined /> },
  EDITED: { label: 'Chỉnh sửa số liệu', color: colors.warning.dark, icon: <EditOutlined /> },
  REVIEW_STARTED: { label: 'Bắt đầu kiểm tra (khóa chỉnh sửa)', color: colors.info.dark, icon: <AuditOutlined /> },
  REVIEW_REOPENED: { label: 'Mở lại để chỉnh sửa', color: colors.warning.dark, icon: <UnlockOutlined /> },
  ACCEPTED: { label: 'Đã tiếp nhận báo cáo', color: colors.success.dark, icon: <CheckCircleOutlined /> },
  REVISION_REQUESTED: { label: 'Yêu cầu TCTD sửa lại', color: colors.error.base, icon: <CloseCircleOutlined /> },
  REJECTED: { label: 'Từ chối báo cáo', color: colors.error.base, icon: <CloseCircleOutlined /> },
};

export const CollectBalanceDetailPage: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { data, customDetailsMap, isLoaded, getMeta, saveReportChanges, startReview, reopenReview, acceptReport, requestRevision } = useCollectBalance();

  const [report, setReport] = useState<BalanceReport | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && id) {
      const found = data.find(item => item.key === id);
      if (found) {
        setReport(found);
      } else if (!report) {
        // Chỉ báo lỗi khi thực sự không có (tránh nháy khi vừa tiếp nhận)
        setNotFound(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, data, isLoaded]);

  useEffect(() => {
    if (notFound) {
      message.error('Không tìm thấy thông tin báo cáo!');
      router.push('/data-collection/collect/balance');
    }
  }, [notFound, router]);

  // Số liệu chi tiết khởi tạo cho báo cáo
  const initialDetails = React.useMemo<ReconciliationDetailRow[]>(() => {
    if (!report) return [];
    const custom = customDetailsMap[report.key];
    if (custom) return custom;
    const parentRow = generateTreeReconciliationData([report]).find(item => item.isParent);
    return parentRow?.children ?? [];
  }, [report, customDetailsMap]);

  const {
    editDetails,
    editedFields,
    editedCount,
    isReadOnly,
    isSubmitting,
    handleCellChange,
    handleSave: reviewSave,
    handleStartReview: reviewStart,
    handleReopenReview: reviewReopen,
    handleAccept: reviewAccept,
    handleRequestRevision: reviewRequestRevision,
  } = useReportReview({
    report,
    initialDetails,
    actions: { saveReportChanges, startReview, reopenReview, acceptReport, requestRevision },
  });

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

  const handleSave = () => {
    reviewSave(() => message.success('Đã lưu thay đổi số liệu!'));
  };

  const handleStartReview = () => {
    reviewStart(() => message.success('Đã bắt đầu kiểm tra. Báo cáo được khóa chỉnh sửa.'));
  };

  const handleReopenReview = () => {
    reviewReopen(() => message.info('Đã mở lại báo cáo để chỉnh sửa.'));
  };

  const handleAccept = () => {
    reviewAccept(() => {
      message.success('Đã tiếp nhận báo cáo thành công!');
      router.push('/data-collection/collect/balance');
    });
  };

  const handleRejectConfirm = (reason: string) => {
    reviewRequestRevision(reason, () => {
      setRejectModalVisible(false);
      message.success('Đã trả lại báo cáo cho TCTD kèm yêu cầu sửa!');
      router.push('/data-collection/collect/balance');
    });
  };

  if (!report) {
    return <PageLayout><div style={{ padding: 24 }}>Đang tải dữ liệu...</div></PageLayout>;
  }

  const history = getMeta(report.key).history;

  return (
    <PageLayout noPadding>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '24px 24px 24px'
      }}>

        {report.trangThai === 'DA_TIEP_NHAN' && (
          <Alert
            message="Báo cáo đã được tiếp nhận. Chức năng chỉnh sửa đã bị khóa."
            type="success"
            showIcon
            style={{ borderRadius: radius.md }}
          />
        )}
        {report.trangThai === 'DANG_KIEM_TRA' && (
          <Alert
            message="Báo cáo đang trong quá trình kiểm tra nên đã khóa chỉnh sửa. Bấm “Mở lại để sửa” nếu cần điều chỉnh số liệu."
            type="info"
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
            {editedCount > 0 && (
              <Tag color="warning" style={{ margin: 0 }}>
                Đã chỉnh sửa {editedCount} ô so với bản gốc
              </Tag>
            )}
          </div>

          <Table
            dataSource={editDetails}
            columns={buildEditTableColumns({
              report,
              isReadOnly,
              onCellChange: handleCellChange,
              editedFields,
            })}
            pagination={false}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            rowKey="key"
          />
        </div>

        {/* Lịch sử xử lý */}
        {history.length > 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: radius.lg,
            border: `1px solid ${colors.border.split}`,
            padding: '20px',
            boxShadow: shadows.sm
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: 14,
              color: colors.primary[700],
              marginBottom: 16
            }}>
              <HistoryOutlined /> LỊCH SỬ XỬ LÝ
            </div>
            <Timeline
              items={[...history].reverse().map(entry => {
                const meta = ACTION_META[entry.action];
                return {
                  color: meta.color,
                  dot: meta.icon,
                  children: (
                    <div>
                      <div style={{ fontWeight: 600, color: colors.text.primary }}>
                        {meta.label}
                      </div>
                      <div style={{ fontSize: 12, color: colors.text.secondary }}>
                        {entry.timestamp} · {entry.actor}
                      </div>
                      {entry.reason && (
                        <div style={{ fontSize: 13, color: colors.error.base, marginTop: 4 }}>
                          Lý do: {entry.reason}
                        </div>
                      )}
                    </div>
                  ),
                };
              })}
            />
          </div>
        )}

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

          {/* Chờ kiểm tra: sửa hộ + bắt đầu kiểm tra */}
          {report.trangThai === 'DA_GUI_CIC' && (
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
                type="primary"
                icon={<AuditOutlined />}
                onClick={handleStartReview}
                loading={isSubmitting}
                style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
              >
                Bắt đầu kiểm tra
              </Button>
            </>
          )}

          {/* Đang kiểm tra: mở lại / yêu cầu sửa / tiếp nhận */}
          {report.trangThai === 'DANG_KIEM_TRA' && (
            <>
              <Button
                icon={<UnlockOutlined />}
                onClick={handleReopenReview}
                loading={isSubmitting}
                style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
              >
                Mở lại để sửa
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => setRejectModalVisible(true)}
                loading={isSubmitting}
                style={{ minWidth: 120, height: 40, borderRadius: radius.md }}
              >
                Yêu cầu sửa
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

      <RejectReasonModal
        open={rejectModalVisible}
        tenTep={report.tenTep}
        loading={isSubmitting}
        onCancel={() => setRejectModalVisible(false)}
        onConfirm={handleRejectConfirm}
      />
    </PageLayout>
  );
};
