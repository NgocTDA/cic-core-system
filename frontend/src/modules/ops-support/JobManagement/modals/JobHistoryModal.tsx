'use client';

import React, { useState, useMemo } from 'react';
import {
  Modal,
  Table,
  Select,
  DatePicker,
  Button,
  Typography,
  Input,
} from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { StatusTag, FilterBar, FilterCol, tablePagination } from '@/components/ui';
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
  const [nodeFilter, setNodeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter runs for the current job - BR-HTVH-027-021 & Vấn đề còn mở #2: Không trả dữ liệu của Job khác khi rỗng
  const jobRuns = useMemo(() => {
    if (!job) return [];
    return mockJobRuns.filter((run) => run.jobId === job.id);
  }, [job]);

  const filteredData = useMemo(() => {
    return jobRuns.filter((run) => {
      if (statusFilter && run.status !== statusFilter) return false;
      if (nodeFilter && run.nodeIp && !run.nodeIp.toLowerCase().includes(nodeFilter.toLowerCase())) return false;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const start = dateRange[0].startOf('day').valueOf();
        const end = dateRange[1].endOf('day').valueOf();
        const runTime = dayjs(run.startTime).valueOf();
        if (runTime < start || runTime > end) return false;
      }
      return true;
    });
  }, [jobRuns, statusFilter, nodeFilter, dateRange]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  if (!job) return null;

  const handleReset = () => {
    setStatusFilter(undefined);
    setNodeFilter('');
    setDateRange(null);
  };

  const formatDuration = (ms?: number, status?: string) => {
    if (status === 'RUNNING' || !ms) return '—';
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
      width: 60,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã lượt chạy',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id) => (
        <Text strong style={{ color: colors.primary[500], fontFamily: typography.fontFamily.sans }}>
          {id}
        </Text>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 170,
      align: 'center',
      render: (time) => {
        if (!time) return <Text type="secondary">—</Text>;
        const d = dayjs(time);
        return (
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, whiteSpace: 'nowrap' }}>
            {d.isValid() ? d.format('DD/MM/YYYY HH:mm:ss') : time}
          </Text>
        );
      },
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 170,
      align: 'center',
      render: (time, record) => {
        if (record.status === 'RUNNING' || !time) return <Text type="secondary">—</Text>;
        const d = dayjs(time);
        return (
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, whiteSpace: 'nowrap' }}>
            {d.isValid() ? d.format('DD/MM/YYYY HH:mm:ss') : time}
          </Text>
        );
      },
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 110,
      align: 'center',
      render: (duration, record) => (
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
          {formatDuration(duration, record.status)}
        </Text>
      ),
    },
    {
      title: 'Bản ghi xử lý',
      key: 'records',
      width: 160,
      align: 'center',
      render: (_, record) => {
        const processed = record.recordsProcessed?.toLocaleString() || 0;
        const failed = record.recordsFailed;
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Text style={{ color: colors.success.dark, fontWeight: 600, fontSize: typography.fontSize.sm }}>
              {processed}
            </Text>
            {failed && failed > 0 ? (
              <Text style={{ color: colors.error.base, fontWeight: 600, fontSize: typography.fontSize.sm, marginLeft: 6 }}>
                / {failed.toLocaleString()} lỗi
              </Text>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Số lần thử lại',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 110,
      align: 'center',
      render: (count?: number) => (
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
          {count || 0}
        </Text>
      ),
    },
    {
      title: 'Node thực thi',
      dataIndex: 'nodeIp',
      key: 'nodeIp',
      width: 130,
      align: 'center',
      render: (ip?: string) =>
        ip ? (
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, fontFamily: typography.fontFamily.mono }}>
            {ip}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (status) => <StatusTag status={status} />,
    },
  ];

  return (
    <Modal
      title={`Lịch sử chạy Job: ${job.name} (${job.code})`}
      open={visible}
      onCancel={onClose}
      width="75vw"
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
          <FilterBar inCard onSearch={() => {}} onReset={handleReset} showAddFilter={false}>
            <FilterCol minWidth={160}>
              <Select
                placeholder="Trạng thái chạy"
                allowClear
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                options={[
                  { label: 'Thành công', value: 'SUCCESS' },
                  { label: 'Lỗi', value: 'FAILED' },
                  { label: 'Đang chạy', value: 'RUNNING' },
                  { label: 'Đã hủy', value: 'CANCELLED' },
                ]}
              />
            </FilterCol>

            <FilterCol minWidth={160}>
              <Input 
                placeholder="Node thực thi..." 
                value={nodeFilter} 
                onChange={(e) => setNodeFilter(e.target.value)} 
                allowClear 
              />
            </FilterCol>

            <FilterCol minWidth={240}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={(dates) => setDateRange(dates as any)}
                disabledDate={(current) => {
                  return current && (current > dayjs().endOf('day') || current < dayjs('1900-01-01'));
                }}
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
          pagination={tablePagination({
            current: currentPage,
            pageSize,
            total: filteredData.length,
            showQuickJumper: false,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          })}
          scroll={{ x: 1050, y: 340 }}
        />
      </div>
    </Modal>
  );
};

export default JobHistoryModal;
