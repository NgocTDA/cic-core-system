'use client';

import React, { useCallback, useState } from 'react';
import { App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, StatusSummaryBar, SectionCard } from '@/components/ui';
import useJobSimple from './useJobSimple';
import JobFilter from './JobFilter';
import JobList from './JobList';
import JobDetailDrawer from './JobDetailDrawer';
import JobFormModal from './JobFormModal';
import type { IJobSimple } from './types';

const JobSimple: React.FC = () => {
  const { modal, message } = App.useApp();
  const {
    filteredJobs,
    stats,
    draft,
    setKeyword,
    setStatus,
    setRunStatus,
    applyFilters,
    resetFilters,
    getJobRuns,
    toggleStatus,
    runNow,
    stopJob,
    saveJob,
    deleteJob,
  } = useJobSimple();

  // Drawer chi tiết
  const [detailJob, setDetailJob] = useState<IJobSimple | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Modal thêm/sửa
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IJobSimple | null>(null);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  useHeaderActions(
    {
      title: 'Quản lý Job',
      actions: [
        { key: 'add', label: 'Thêm job', type: 'primary', icon: <PlusOutlined />, onClick: openCreate },
      ],
    },
    [openCreate],
  );

  const openDetail = useCallback((job: IJobSimple) => {
    setDetailJob(job);
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback((job: IJobSimple) => {
    setEditing(job);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    (job: IJobSimple) => {
      modal.confirm({
        title: 'Xác nhận xóa job',
        content: `Bạn có chắc muốn xóa job "${job.name}"?`,
        okText: 'Xóa',
        okButtonProps: { danger: true },
        cancelText: 'Hủy',
        onOk: () => {
          deleteJob(job.id);
          message.success('Đã xóa job');
        },
      });
    },
    [modal, message, deleteJob],
  );

  const handleToggle = useCallback(
    (job: IJobSimple) => {
      toggleStatus(job.id);
      message.success(job.status === 'ACTIVE' ? 'Đã tắt job' : 'Đã bật job');
    },
    [toggleStatus, message],
  );

  const handleRun = useCallback(
    (job: IJobSimple) => {
      runNow(job.id);
      message.success(`Đã kích hoạt chạy: ${job.name}`);
    },
    [runNow, message],
  );

  const handleStop = useCallback(
    (job: IJobSimple) => {
      stopJob(job.id);
      message.info(`Đã dừng: ${job.name}`);
    },
    [stopJob, message],
  );

  // Đồng bộ job trong drawer với state mới nhất
  const liveDetailJob = detailJob ? filteredJobs.find((j) => j.id === detailJob.id) ?? detailJob : null;

  return (
    <PageLayout>
      <StatusSummaryBar
        align="left"
        items={[
          { count: stats.total, label: 'Tổng cộng', color: 'info' },
          { count: stats.active, label: 'Đang bật', color: 'success' },
          { count: stats.running, label: 'Đang chạy', color: 'warning' },
          { count: stats.failed, label: 'Lỗi', color: 'error' },
        ]}
      />

      <JobFilter
        draft={draft}
        onKeyword={setKeyword}
        onStatus={setStatus}
        onRunStatus={setRunStatus}
        onSearch={applyFilters}
        onReset={resetFilters}
      />

      <SectionCard title="Danh sách Job" count={filteredJobs.length} flex>
        <JobList
          data={filteredJobs}
          onView={openDetail}
          onEdit={openEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggle}
          onRunNow={handleRun}
          onStop={handleStop}
        />
      </SectionCard>

      <JobDetailDrawer
        open={drawerOpen}
        job={liveDetailJob}
        runs={liveDetailJob ? getJobRuns(liveDetailJob.id) : []}
        onClose={() => setDrawerOpen(false)}
        onRunNow={handleRun}
        onStop={handleStop}
      />

      <JobFormModal
        open={formOpen}
        editing={editing}
        onCancel={() => setFormOpen(false)}
        onSubmit={(values, editingId) => {
          saveJob(values, editingId);
          setFormOpen(false);
          message.success(editingId ? 'Đã cập nhật job' : 'Đã thêm job mới');
        }}
      />
    </PageLayout>
  );
};

const JobSimpleWithApp: React.FC = () => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <JobSimple />
  </App>
);

export default JobSimpleWithApp;
