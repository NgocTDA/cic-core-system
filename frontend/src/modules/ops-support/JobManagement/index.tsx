'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, StatusSummaryBar } from '@/components/ui';
import { useJobManagement } from './useJobManagement';
import { useRole, hasPermission } from '@/context/RoleContext';
import { mockJobs } from './mockData';
import JobFilter from './JobFilter';
import JobList from './JobList';

const JobManagement: React.FC = () => {
  const router = useRouter();
  const { currentRole } = useRole();
  const {
    filteredJobs,
    stats,
    runJob,
  } = useJobManagement();

  const handleAddJob = () => {
    router.push('/ops-support/job-management/create');
  };

  const handleEditJob = (id: string) => {
    router.push(`/ops-support/job-management/${id}/edit`);
  };

  const handleRowClick = (id: string) => {
    router.push(`/ops-support/job-management/${id}`);
  };

  const handleCloneJob = (id: string) => {
    const jobToClone = mockJobs.find(j => j.id === id);
    if (jobToClone) {
      message.success(`Đã sao chép job: ${jobToClone.name}`);
      router.push(`/ops-support/job-management/create?cloneId=${id}`);
    }
  };

  const handleBulkRun = (ids: string[]) => {
    ids.forEach(id => runJob(id));
  };

  const handleBulkDelete = (ids: string[]) => {
    message.success(`Đã xóa ${ids.length} job`);
  };

  const handleRefresh = () => {
    message.info('Đang làm mới dữ liệu...');
  };

  const headerActions = useMemo(() => {
    return [
      {
        key: 'refresh',
        label: 'Làm mới',
        icon: <ReloadOutlined />,
        onClick: handleRefresh,
      },
      {
        key: 'add',
        label: 'Thiết lập job mới',
        type: 'primary' as const,
        icon: <PlusOutlined />,
        onClick: handleAddJob,
      },
    ];
  }, []);

  // Register Header Actions
  useHeaderActions(
    {
      title: 'Quản lý Job định kỳ',
      actions: headerActions,
    },
    [currentRole]
  );

  const summaryItems = [
    { count: stats.total, label: 'Tổng cộng', color: 'info' as const },
    { count: stats.running, label: 'Đang chạy', color: 'warning' as const },
    { count: stats.failed, label: 'Thất bại', color: 'error' as const },
    { count: stats.scheduled, label: 'Đã lên lịch', color: 'success' as const },
  ];

  return (
    <PageLayout>
      {/* Status Summary Bar */}
      <StatusSummaryBar items={summaryItems} align="left" />

      {/* Filter Card */}
      <JobFilter />

      {/* Job List Table */}
      <JobList
        data={filteredJobs}
        onRowClick={handleRowClick}
        onRun={runJob}
        onEdit={handleEditJob}
        onClone={handleCloneJob}
        onBulkRun={handleBulkRun}
        onBulkDelete={handleBulkDelete}
      />
    </PageLayout>
  );
};

export default JobManagement;
