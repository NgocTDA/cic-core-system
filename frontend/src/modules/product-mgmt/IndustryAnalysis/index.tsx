'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { App, message } from 'antd';
import { PlusOutlined, SendOutlined, DownloadOutlined } from '@ant-design/icons';
import {
  PageLayout,
  StatusSummaryBar,
  DisplaySettingPopover,
  ExportExcelDropdown,
} from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';
import IndustryAnalysisFilter from './IndustryAnalysisFilter';
import IndustryAnalysisList, { INDUSTRY_PRODUCT_COLUMNS } from './IndustryAnalysisList';
import IndustryAnalysisDetailModal from './IndustryAnalysisDetailModal';
import IndustryAnalysisCreateModal from './IndustryAnalysisCreateModal';
import {
  SendApprovalModal,
  ApproveModal,
  RejectModal,
  RecallModal,
} from './IndustryAnalysisWorkflowModals';
import { useIndustryAnalysis } from './useIndustryAnalysis';
import type { IIndustryProduct } from './types';

const DEFAULT_VISIBLE_KEYS = INDUSTRY_PRODUCT_COLUMNS.map((c) => c.key);

const IndustryAnalysisPage: React.FC = () => {
  const {
    data,
    loading,
    summaryItems,
    handleSearch,
    handleReset,
    handleCreateProduct,
    handleSendApproval,
    handleApprove,
    handleReject,
    handleRecall,
    handleDownload,
  } = useIndustryAnalysis();

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_KEYS);

  // Row selection state (Style chuẩn JobManagement)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IIndustryProduct | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sendApprovalOpen, setSendApprovalOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [recallOpen, setRecallOpen] = useState(false);

  // Modal openers
  const openDetail = (prod: IIndustryProduct) => {
    setSelectedProduct(prod);
    setDetailOpen(true);
  };

  const openSendApproval = (prod: IIndustryProduct) => {
    setSelectedProduct(prod);
    setSendApprovalOpen(true);
  };

  const openApprove = (prod: IIndustryProduct) => {
    setSelectedProduct(prod);
    setApproveOpen(true);
  };

  const openReject = (prod: IIndustryProduct) => {
    setSelectedProduct(prod);
    setRejectOpen(true);
  };

  const openRecall = (prod: IIndustryProduct) => {
    setSelectedProduct(prod);
    setRecallOpen(true);
  };

  // Bulk actions
  const handleBulkSendApproval = useCallback(() => {
    message.success(`Đã gửi duyệt thành công ${selectedRowKeys.length} báo cáo`);
    setSelectedRowKeys([]);
  }, [selectedRowKeys.length]);

  // Header actions setup (Thứ tự và phong cách chuẩn JobManagement)
  const headerActions = useMemo(() => {
    const actions: any[] = [
      {
        key: 'display_setting',
        render: () => (
          <DisplaySettingPopover
            columns={INDUSTRY_PRODUCT_COLUMNS}
            visibleKeys={visibleColumns}
            onChange={setVisibleColumns}
            buttonText="Cài đặt hiển thị"
          />
        ),
      },
      {
        key: 'export_excel',
        render: () => (
          <ExportExcelDropdown
            buttonText="Xuất Excel"
          />
        ),
      },
    ];

    if (selectedRowKeys.length > 0) {
      actions.push({
        key: 'bulk_send',
        label: `Gửi duyệt (${selectedRowKeys.length})`,
        type: 'primary' as const,
        icon: <SendOutlined />,
        onClick: handleBulkSendApproval,
      });
    }

    actions.push({
      key: 'add',
      label: 'Thêm mới',
      icon: <PlusOutlined />,
      type: 'primary' as const,
      onClick: () => setCreateOpen(true),
    });

    return actions;
  }, [visibleColumns, selectedRowKeys, handleBulkSendApproval]);

  useHeaderActions(
    {
      title: 'Danh sách báo cáo phân tích ngành, trung bình ngành',
      actions: headerActions,
    },
    [headerActions]
  );

  return (
    <PageLayout>
      {/* 1. Bộ tìm kiếm inCard Context Banner */}
      <IndustryAnalysisFilter
        loading={loading}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 2. Thanh tóm tắt trạng thái */}
      <StatusSummaryBar items={summaryItems} />

      {/* 3. Danh sách bảng dữ liệu SectionCard */}
      <IndustryAnalysisList
        data={data}
        loading={loading}
        visibleColumns={visibleColumns}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onView={openDetail}
        onSendApproval={openSendApproval}
        onApprove={openApprove}
        onReject={openReject}
        onDownload={handleDownload}
        onRecall={openRecall}
      />

      {/* 4. Modal Tạo mới */}
      <IndustryAnalysisCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateProduct}
      />

      {/* 5. Modal Xem chi tiết + Lịch sử thay đổi */}
      <IndustryAnalysisDetailModal
        open={detailOpen}
        product={selectedProduct}
        onClose={() => {
          setDetailOpen(false);
          setSelectedProduct(null);
        }}
        onDownload={handleDownload}
        onApprove={openApprove}
        onSendApproval={openSendApproval}
      />

      {/* 6. Modal Gửi duyệt */}
      <SendApprovalModal
        open={sendApprovalOpen}
        product={selectedProduct}
        onClose={() => {
          setSendApprovalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={(prod) => {
          handleSendApproval(prod);
          setSendApprovalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* 7. Modal Phê duyệt */}
      <ApproveModal
        open={approveOpen}
        product={selectedProduct}
        onClose={() => {
          setApproveOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={(prod, note) => {
          handleApprove(prod, note);
          setApproveOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* 8. Modal Từ chối duyệt */}
      <RejectModal
        open={rejectOpen}
        product={selectedProduct}
        onClose={() => {
          setRejectOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={(prod, reason) => {
          handleReject(prod, reason);
          setRejectOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* 9. Modal Thu hồi */}
      <RecallModal
        open={recallOpen}
        product={selectedProduct}
        onClose={() => {
          setRecallOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={(prod, reason) => {
          handleRecall(prod, reason);
          setRecallOpen(false);
          setSelectedProduct(null);
        }}
      />
    </PageLayout>
  );
};

const IndustryAnalysisPageWithApp: React.FC = () => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <IndustryAnalysisPage />
  </App>
);

export default IndustryAnalysisPageWithApp;
