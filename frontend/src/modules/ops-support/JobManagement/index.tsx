'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { message, Modal, Input, Typography, Button } from 'antd';
import { PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import {
  PageLayout,
  DisplaySettingPopover,
  ExportExcelDropdown,
  type IDisplayColumnOption,
} from '@/components/ui';
import { useJobManagement } from './useJobManagement';
import { useRole, hasPermission } from '@/context/RoleContext';
import { mockJobs } from './mockData';
import JobFilter from './JobFilter';
import JobList from './JobList';
import JobDetailModal from './JobDetailModal';
import JobHistoryModal from './modals/JobHistoryModal';
import ForestEvaluationDrawer from './components/ForestEvaluationDrawer';
import { BarChartOutlined } from '@ant-design/icons';
import type { IJob } from './types';

const { Text } = Typography;

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

// Modal Xác nhận chạy Job (MH-HTVH-025-005: M6-01..M6-06)
interface RunConfirmModalProps {
  open: boolean;
  jobs: IJob[];
  onClose: () => void;
  onExecute: (params: string, jobs: IJob[]) => void;
  canManageParam: boolean;
}

const RunConfirmModal: React.FC<RunConfirmModalProps> = ({
  open,
  jobs,
  onClose,
  onExecute,
  canManageParam,
}) => {
  const isBulk = jobs.length > 1;
  const singleTarget = !isBulk && jobs.length === 1 ? jobs[0] : null;

  const [params, setParams] = useState('');
  const [paramError, setParamError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      setParams(singleTarget?.params || '');
      setParamError(null);
      setLoading(false);
    }
  }, [open, singleTarget]);

  const handleConfirm = () => {
    // M6-05: Kiểm tra định dạng tham số (ERR_002)
    const trimmed = params.trim();
    if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
      try {
        JSON.parse(trimmed);
      } catch {
        setParamError('Tham số không hợp lệ hoặc sai định dạng.');
        return;
      }
    }

    setParamError(null);
    setLoading(true); // M6-04: loading & disable

    setTimeout(() => {
      onExecute(params, jobs);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      title="Xác nhận thực hiện Job"
      open={open}
      onCancel={loading ? undefined : onClose}
      centered
      destroyOnClose
      width={560}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <Button onClick={onClose} disabled={loading} style={{ minWidth: 90 }}>
            Hủy
          </Button>
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={handleConfirm}
            style={{ minWidth: 100 }}
          >
            Chạy ngay
          </Button>
        </div>
      }
    >
      <div style={{ padding: '8px 0' }}>
        {/* M6-01: Câu hỏi CONF_001. M6-02: Chạy hàng loạt kèm số lượng, ẩn mã/tên */}
        <p style={{ marginBottom: 14, fontSize: 14 }}>
          {isBulk
            ? `Bạn có chắc chắn muốn kích hoạt chạy ${jobs.length} job đã chọn không?`
            : 'Bạn có chắc chắn muốn kích hoạt chạy job không?'}
        </p>

        {singleTarget && (
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid var(--border)`,
              marginBottom: 16,
            }}
          >
            <div>
              <Text type="secondary">Mã Job: </Text>
              <Text style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 'bold', color: 'var(--text)' }}>
                {singleTarget.code}
              </Text>
            </div>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">Tên Job: </Text>
              <Text strong>{singleTarget.name}</Text>
            </div>
          </div>
        )}

        {/* Ô Tham số bổ sung - M6-06: chỉ đọc nếu thiếu quyền manage_param */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500, fontSize: 13 }}>
            Tham số chạy bổ sung (JSON/YAML) (Tùy chọn):
          </div>
          <Input.TextArea
            value={params}
            disabled={!canManageParam || loading}
            placeholder='{ "run_date": "2026-05-20" }'
            rows={4}
            maxLength={1500}
            onChange={(e) => {
              setParams(e.target.value);
              if (paramError) setParamError(null);
            }}
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              backgroundColor: !canManageParam ? 'var(--surface-sunken)' : undefined,
              borderColor: paramError ? 'var(--error)' : undefined,
            }}
          />
          {/* M6-05: Lỗi inline ERR_002 */}
          {paramError && (
            <div style={{ color: 'var(--error)', marginTop: 4, fontSize: 12 }}>
              {paramError}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const JobManagement: React.FC = () => {
  const router = useRouter();
  const { currentRole } = useRole();
  const [evalDrawerOpen, setEvalDrawerOpen] = useState(false);
  const [detailJobId, setDetailJobId] = useState<string | null>(null);
  const [historyJob, setHistoryJob] = useState<IJob | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_KEYS);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // State quản lý Modal chạy Job
  const [runModalState, setRunModalState] = useState<{ open: boolean; jobs: IJob[] }>({
    open: false,
    jobs: [],
  });

  const canManageParam = hasPermission(currentRole, 'manage_param');

  const {
    filteredJobs,
    runJob,
    toggleJobStatus,
    deleteJob,
  } = useJobManagement();

  const handleAddJob = useCallback(() => {
    router.push('/ops-support/job-management/create');
  }, [router]);

  const handleEditJob = (id: string) => {
    router.push(`/ops-support/job-management/${id}/edit`);
  };

  const handleToggleStatus = (job: IJob) => {
    if (job.status === 'ACTIVE') {
      const dependentJobs = mockJobs.filter(
        (j) => j.status === 'ACTIVE' && j.dependencies?.some((dep) => dep.jobId === job.id)
      );
      if (dependentJobs.length > 0) {
        message.error(
          `Không thể ngừng hoạt động job do có job khác đang phụ thuộc vào kết quả xử lý.`
        );
        return;
      }
      toggleJobStatus(job.id);
      message.success('Cập nhật trạng thái job thành công.');
    } else {
      const inactiveParents = (job.dependencies || [])
        .map((dep) => mockJobs.find((j) => j.id === dep.jobId))
        .filter((parent) => parent && parent.status !== 'ACTIVE');

      if (inactiveParents.length > 0) {
        message.warning(
          `Job ${inactiveParents[0]?.code} phụ thuộc đang không hoạt động. Job này có thể không được kích hoạt đúng lịch.`
        );
      }
      toggleJobStatus(job.id);
      message.success('Cập nhật trạng thái job thành công.');
    }
  };

  const handleRowClick = (id: string) => {
    setDetailJobId(id);
  };

  const handleExecuteRuns = (runParams: string, jobsToRun: IJob[]) => {
    const rejected: { job: IJob; reason: string }[] = [];
    let successCount = 0;

    jobsToRun.forEach((job) => {
      // BR-HTVH-027-031: concurrent check
      if (job.concurrent && job.runStatus === 'RUNNING') {
        rejected.push({ job, reason: 'Job đang trong tiến trình chạy' });
      } else {
        runJob(job.id);
        successCount++;
      }
    });

    // M6-03: Hiển thị X/Y Job được tiếp nhận, liệt kê từng Job bị từ chối
    if (jobsToRun.length > 1) {
      if (rejected.length > 0) {
        Modal.warning({
          title: 'Kết quả kích hoạt Job',
          icon: null,
          centered: true,
          content: (
            <div>
              <p>
                <strong>{successCount}/{jobsToRun.length}</strong> Job được tiếp nhận kích hoạt thành công.
              </p>
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">Danh sách Job bị từ chối tiếp nhận ({rejected.length}):</Text>
                <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                  {rejected.map((r) => (
                    <li key={r.job.id} style={{ marginBottom: 4 }}>
                      <Text strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{r.job.code}</Text>: {r.reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
          okText: 'Đóng',
          footer: (_, { OkBtn }) => (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <OkBtn />
            </div>
          ),
        });
      } else {
        message.success('Hệ thống đã kích hoạt chạy job thành công. Vui lòng vào Lịch sử chạy Job để xem kết quả');
      }
      setSelectedRowKeys(rejected.map((r) => r.job.id));
    } else {
      if (rejected.length > 0) {
        message.warning(`Job ${rejected[0].job.code} đang trong tiến trình chạy. Vui lòng đợi lượt chạy hoàn tất.`);
      } else {
        message.success('Hệ thống đã kích hoạt chạy job thành công. Vui lòng vào Lịch sử chạy Job để xem kết quả');
      }
    }
  };

  const handleConfirmRunSingleJob = (id: string) => {
    const target = mockJobs.find((j) => j.id === id);
    if (target) {
      setRunModalState({ open: true, jobs: [target] });
    }
  };

  const handleConfirmRunSelectedJobs = useCallback(() => {
    const selectedJobs = selectedRowKeys
      .map((id) => mockJobs.find((j) => j.id === id))
      .filter(Boolean) as IJob[];
    if (selectedJobs.length > 0) {
      setRunModalState({ open: true, jobs: selectedJobs });
    }
  }, [selectedRowKeys]);

  // Header actions - M1-06 (1 nút primary), M1-08 (ROLE-CBNV không có nút chạy và thêm mới)
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
      {
        key: 'forest_report',
        label: 'Báo cáo Forest DS',
        icon: <BarChartOutlined />,
        onClick: () => setEvalDrawerOpen(true),
      },
    ];

    const isViewer = currentRole === 'ROLE-CBNV' || currentRole === 'VIEWER';

    if (!isViewer && selectedRowKeys.length > 0 && hasPermission(currentRole, 'run')) {
      actions.push({
        key: 'run_selected',
        label: `Chạy Job (${selectedRowKeys.length})`,
        type: 'primary' as const,
        icon: <PlayCircleOutlined />,
        onClick: handleConfirmRunSelectedJobs,
      });
    }

    if (!isViewer && hasPermission(currentRole, 'create')) {
      actions.push({
        key: 'add',
        label: 'Thiết lập job mới',
        type: selectedRowKeys.length > 0 ? ('default' as const) : ('primary' as const),
        icon: <PlusOutlined />,
        onClick: handleAddJob,
      });
    }

    return actions;
  }, [handleAddJob, visibleColumns, selectedRowKeys, handleConfirmRunSelectedJobs, currentRole]);

  useHeaderActions(
    {
      title: 'Quản lý Job',
      actions: headerActions,
    },
    [headerActions, currentRole]
  );

  return (
    <PageLayout>
      {/* Bộ lọc với phong cách Context Banner (inCard) */}
      <JobFilter />

      {/* Bảng Danh sách Job */}
      <JobList
        data={filteredJobs}
        visibleColumns={visibleColumns}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onRowClick={handleRowClick}
        onRun={handleConfirmRunSingleJob}
        onEdit={handleEditJob}
        onDelete={deleteJob}
        onToggleStatus={handleToggleStatus}
        onViewHistory={setHistoryJob}
      />

      {/* Drawer Báo cáo Đánh giá sự phù hợp NTDA Forest */}
      <ForestEvaluationDrawer
        open={evalDrawerOpen}
        onClose={() => setEvalDrawerOpen(false)}
      />

      {/* Modal Xem chi tiết Job */}
      <JobDetailModal
        visible={!!detailJobId}
        job={mockJobs.find((j) => j.id === detailJobId) || null}
        onClose={() => setDetailJobId(null)}
      />

      {/* Modal Lịch sử chạy Job */}
      <JobHistoryModal
        visible={!!historyJob}
        job={historyJob}
        onClose={() => setHistoryJob(null)}
      />

      {/* Modal Xác nhận chạy Job (MH-HTVH-027-005) */}
      <RunConfirmModal
        open={runModalState.open}
        jobs={runModalState.jobs}
        onClose={() => setRunModalState({ open: false, jobs: [] })}
        onExecute={handleExecuteRuns}
        canManageParam={canManageParam}
      />
    </PageLayout>
  );
};

export default JobManagement;
