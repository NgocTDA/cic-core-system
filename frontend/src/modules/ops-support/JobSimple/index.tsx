'use client';

import React, { useCallback, useState } from 'react';
import { App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, StatusSummaryBar, SectionCard } from '@/components/ui';
import useJobSimple from './useJobSimple';
import JobFilter from './JobFilter';
import JobList from './JobList';
import JobDetailModal from './JobDetailModal';
import type { IJobSimple } from './types';

const JobSimple: React.FC = () => {
  const router = useRouter();
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
    getChangeLogs,
    toggleStatus,
    runNow,
    stopJob,
    deleteJob,
  } = useJobSimple();

  // Modal chi tiết
  const [detailJob, setDetailJob] = useState<IJobSimple | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openCreate = useCallback(() => {
    router.push('/ops-support/jobs/new');
  }, [router]);

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
    setDetailOpen(true);
  }, []);

  const openEdit = useCallback(
    (job: IJobSimple) => {
      router.push(`/ops-support/jobs/${job.id}/edit`);
    },
    [router],
  );

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
      const willDeactivate = job.status === 'ACTIVE';
      const doToggle = () => {
        toggleStatus(job.id);
        message.success(willDeactivate ? 'Đã vô hiệu hóa job' : 'Đã kích hoạt job');
      };
      // Theo chuẩn: hành động "Vô hiệu hóa" bắt buộc có hộp xác nhận
      if (willDeactivate) {
        modal.confirm({
          title: 'Xác nhận vô hiệu hóa job',
          content: `Bạn có chắc muốn vô hiệu hóa job "${job.name}"? Job sẽ không chạy theo lịch cho đến khi được kích hoạt lại.`,
          okText: 'Vô hiệu hóa',
          okButtonProps: { danger: true },
          cancelText: 'Hủy',
          onOk: doToggle,
        });
      } else {
        doToggle();
      }
    },
    [toggleStatus, message, modal],
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

  // Đồng bộ job trong modal với state mới nhất
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

      <JobDetailModal
        open={detailOpen}
        job={liveDetailJob}
        runs={liveDetailJob ? getJobRuns(liveDetailJob.id) : []}
        changeLogs={liveDetailJob ? getChangeLogs(liveDetailJob.id) : []}
        onClose={() => setDetailOpen(false)}
        onRunNow={handleRun}
        onStop={handleStop}
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
