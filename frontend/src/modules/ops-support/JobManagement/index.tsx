'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { message, Modal } from 'antd';
import { PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import {
  PageLayout,
  DisplaySettingPopover,
  ExportExcelDropdown,
  type IDisplayColumnOption,
} from '@/components/ui';
import { useJobManagement } from './useJobManagement';
import { useRole } from '@/context/RoleContext';
import { mockJobs } from './mockData';
import JobFilter from './JobFilter';
import JobList from './JobList';
import JobDetailModal from './JobDetailModal';
import JobHistoryModal from './modals/JobHistoryModal';
import type { IJob } from './types';

const JOB_COLUMNS: IDisplayColumnOption[] = [
  { key: 'stt', label: 'STT' },
  { key: 'code', label: 'Mã Job' },
  { key: 'name', label: 'Tên Job' },
  { key: 'serviceCode', label: 'Mã dịch vụ' },
  { key: 'category', label: 'Loại Job' },
  { key: 'triggerType', label: 'Điều kiện kích hoạt' },
  { key: 'cron', label: 'Biểu thức Cron' },
  { key: 'status', label: 'Trạng thái' },
];

const DEFAULT_VISIBLE_KEYS = JOB_COLUMNS.map((c) => c.key);

const JobManagement: React.FC = () => {
  const router = useRouter();
  const { currentRole } = useRole();
  const [detailJobId, setDetailJobId] = useState<string | null>(null);
  const [historyJob, setHistoryJob] = useState<IJob | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_KEYS);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    filteredJobs,
    runJob,
    toggleJobStatus,
  } = useJobManagement();

  const handleAddJob = useCallback(() => {
    router.push('/ops-support/job-management/create');
  }, [router]);

  const handleEditJob = (id: string) => {
    router.push(`/ops-support/job-management/${id}/edit`);
  };

  const handleToggleStatus = (job: IJob) => {
    toggleJobStatus(job.id);
    if (job.status === 'ACTIVE') {
      message.success(`Đã vô hiệu hóa Job ${job.code}`);
    } else {
      message.success(`Đã kích hoạt Job ${job.code}`);
    }
  };

  const handleRowClick = (id: string) => {
    setDetailJobId(id);
  };

  const handleBulkRun = (ids: string[]) => {
    ids.forEach(id => runJob(id));
  };

  const handleBulkDelete = (ids: string[]) => {
    message.success(`Đã xóa ${ids.length} job`);
  };

  const handleConfirmRunSelectedJobs = useCallback(() => {
    const selectedCount = selectedRowKeys.length;
    if (selectedCount === 0) return;

    Modal.confirm({
      title: 'Xác nhận thực hiện Job',
      icon: null,
      centered: true,
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            {selectedCount === 1
              ? 'Bạn có chắc chắn muốn kích hoạt chạy Job đã chọn ngay bây giờ không?'
              : `Bạn có chắc chắn muốn kích hoạt chạy ${selectedCount} Job đã chọn ngay bây giờ không?`}
          </p>
          {selectedCount === 1 && (() => {
            const target = mockJobs.find((j) => j.id === selectedRowKeys[0]);
            return target ? (
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                <div><span style={{ color: 'rgba(0,0,0,0.45)' }}>Mã Job: </span><span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' }}>{target.code}</span></div>
                <div><span style={{ color: 'rgba(0,0,0,0.45)' }}>Tên Job: </span><span style={{ fontWeight: 'bold' }}>{target.name}</span></div>
              </div>
            ) : null;
          })()}
        </div>
      ),
      okText: 'Chạy ngay',
      cancelText: 'Hủy',
      okButtonProps: { type: 'primary', style: { minWidth: 90 } },
      cancelButtonProps: { style: { minWidth: 90 } },
      footer: (_, { OkBtn, CancelBtn }) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
          <CancelBtn />
          <OkBtn />
        </div>
      ),
      onOk: () => {
        selectedRowKeys.forEach((id) => runJob(id as string));
        message.success(`Đã kích hoạt chạy ${selectedCount} Job thành công`);
        setSelectedRowKeys([]);
      },
    });
  }, [selectedRowKeys, runJob]);

  const headerActions = useMemo(() => {
    const actions: any[] = [
      {
        key: 'display_setting',
        render: () => (
          <DisplaySettingPopover
            columns={JOB_COLUMNS}
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
        key: 'run_selected',
        label: `Chạy Job (${selectedRowKeys.length})`,
        type: 'primary' as const,
        icon: <PlayCircleOutlined />,
        onClick: handleConfirmRunSelectedJobs,
      });
    }

    actions.push({
      key: 'add',
      label: 'Thiết lập job mới',
      type: 'primary' as const,
      icon: <PlusOutlined />,
      onClick: handleAddJob,
    });

    return actions;
  }, [handleAddJob, visibleColumns, selectedRowKeys, handleConfirmRunSelectedJobs]);

  // Register Header Actions
  useHeaderActions(
    {
      title: 'Quản lý Job',
      actions: headerActions,
    },
    [headerActions, currentRole]
  );

  const handleConfirmRunJob = (id: string) => {
    const target = mockJobs.find((j) => j.id === id);
    Modal.confirm({
      title: 'Xác nhận thực hiện Job',
      icon: null,
      centered: true,
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>Bạn có chắc chắn muốn kích hoạt chạy Job này ngay bây giờ không?</p>
          {target && (
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 6, border: '1px solid #d9d9d9' }}>
              <div><span style={{ color: 'rgba(0,0,0,0.45)' }}>Mã Job: </span><span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' }}>{target.code}</span></div>
              <div><span style={{ color: 'rgba(0,0,0,0.45)' }}>Tên Job: </span><span style={{ fontWeight: 'bold' }}>{target.name}</span></div>
            </div>
          )}
        </div>
      ),
      okText: 'Chạy ngay',
      cancelText: 'Hủy',
      okButtonProps: { type: 'primary', style: { minWidth: 90 } },
      cancelButtonProps: { style: { minWidth: 90 } },
      footer: (_, { OkBtn, CancelBtn }) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
          <CancelBtn />
          <OkBtn />
        </div>
      ),
      onOk: () => {
        runJob(id);
        message.success(`Job ${target?.code || id} đã bắt đầu chạy thành công`);
      },
    });
  };

  return (
    <PageLayout>
      {/* Filter Card */}
      <JobFilter />

      {/* Job List Table */}
      <JobList
        data={filteredJobs}
        visibleColumns={visibleColumns}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onRowClick={handleRowClick}
        onRun={handleConfirmRunJob}
        onEdit={handleEditJob}
        onToggleStatus={handleToggleStatus}
        onViewHistory={setHistoryJob}
        onBulkRun={handleBulkRun}
        onBulkDelete={handleBulkDelete}
      />

      {/* Job Detail Modal Popup */}
      <JobDetailModal
        visible={!!detailJobId}
        job={mockJobs.find((j) => j.id === detailJobId) || null}
        onClose={() => setDetailJobId(null)}
      />

      {/* Job History Modal Popup */}
      <JobHistoryModal
        visible={!!historyJob}
        job={historyJob}
        onClose={() => setHistoryJob(null)}
      />
    </PageLayout>
  );
};

export default JobManagement;
