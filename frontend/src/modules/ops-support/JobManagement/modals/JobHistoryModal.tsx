'use client';

import React, { useState, useMemo } from 'react';
import {
  Modal,
  Table,
  Select,
  DatePicker,
  Button,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { StatusTag, CodeText, FilterBar, FilterCol, tablePagination } from '@/components/ui';
import { colors, spacing, typography } from '@/design-system';
import type { IJob, IJobRun } from '../types';
import { mockJobRuns } from '../mockData';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface JobHistoryModalProps {
  visible: boolean;
  job: IJob | null;
  onClose: () => void;
}

const JobHistoryModal: React.FC<JobHistoryModalProps> = ({
  visible,
  job,
  onClose,
}) => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Filter runs for the current job
  const jobRuns = useMemo(() => {
    if (!job) return [];
    const runs = mockJobRuns.filter((run) => run.jobId === job.id);
    return runs.length > 0 ? runs : mockJobRuns;
  }, [job?.id]);

  const filteredData = useMemo(() => {
    return jobRuns.filter((run) => {
      if (statusFilter && run.status !== statusFilter) return false;
      return true;
    });
  }, [jobRuns, statusFilter]);

  if (!job) return null;

  const handleReset = () => {
    setStatusFilter(undefined);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '—';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    return `${minutes}m ${remSeconds}s`;
  };

  const columns: TableProps<IJobRun>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã lượt chạy',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <CodeText>{id}</CodeText>,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      render: (time) => (
        <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>
          {time || '2026-05-20 02:15:00'}
        </span>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      render: (time) => (
        <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>
          {time || '2026-05-20 02:34:15'}
        </span>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 110,
      render: (duration) => (
        <Text style={{ fontSize: typography.fontSize.xs }}>{formatDuration(duration)}</Text>
      ),
    },
    {
      title: 'Bản ghi xử lý',
      key: 'records',
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: typography.fontSize.xs }}>
          <Text type="success" strong style={{ marginRight: 6 }}>
            ✓ {record.recordsProcessed?.toLocaleString() || 0}
          </Text>
          {record.recordsFailed && record.recordsFailed > 0 ? (
            <Text type="danger" strong>
              ✗ {record.recordsFailed.toLocaleString()}
            </Text>
          ) : null}
        </div>
      ),
    },
    {
      title: 'Số lần thử lại',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 120,
      align: 'center',
      render: (count?: number) => (
        <Text style={{ fontSize: typography.fontSize.xs }}>
          {count || 0}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusTag status={status} />,
    },
  ];

  return (
    <Modal
      title={`Lịch sử chạy Job: ${job.name} (${job.code})`}
      open={visible}
      onCancel={onClose}
      width="70vw"
      centered
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={onClose} style={{ minWidth: 100 }}>
            Đóng
          </Button>
        </div>
      }
    >
      <div style={{ padding: '4px 0' }}>
        {/* Tra cứu theo các tiêu chí */}
        <div style={{ marginBottom: spacing[4] }}>
          <FilterBar onSearch={() => {}} onReset={handleReset} showAddFilter={false}>
            <FilterCol minWidth={180}>
              <Select
                placeholder="Trạng thái chạy"
                allowClear
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                options={[
                  { label: 'Thành công (SUCCESS)', value: 'SUCCESS' },
                  { label: 'Lỗi (FAILED)', value: 'FAILED' },
                  { label: 'Đang chạy (RUNNING)', value: 'RUNNING' },
                ]}
              />
            </FilterCol>

            <FilterCol minWidth={240}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </FilterCol>
          </FilterBar>
        </div>

        {/* Table Lịch sử chạy */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="small"
          bordered
          pagination={tablePagination({ pageSize: 10 })}
          scroll={{ x: 950, y: 320 }}
        />
      </div>
    </Modal>
  );
};

export default JobHistoryModal;
