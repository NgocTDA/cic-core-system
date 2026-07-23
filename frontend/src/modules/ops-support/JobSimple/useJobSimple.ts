'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mockJobs, mockJobRuns, mockJobChangeLogs } from './mockData';
import { DEFAULT_TIMEZONE } from './cronLocale';
import type { IJobSimple, IJobRunSimple, IJobFormValues, JobStatus, JobRunStatus } from './types';

// Shared mutable store (mô phỏng server state trong 1 session) — cho phép
// trang List và trang Form (route khác) dùng chung dữ liệu. Theo pattern
// useProductCatalog.ts.
let _jobs: IJobSimple[] = [...mockJobs];
let _runs: IJobRunSimple[] = [...mockJobRuns];

// Đọc trực tiếp store (dùng ở Form Page khi edit, ngoài React lifecycle)
export const getJobById = (id: string): IJobSimple | undefined => _jobs.find((j) => j.id === id);

export const saveJobToStore = (values: IJobFormValues, editingId?: string): void => {
  if (editingId) {
    _jobs = _jobs.map((j) => (j.id === editingId ? { ...j, ...values } : j));
  } else {
    const newJob: IJobSimple = {
      id: `job-${Date.now()}`,
      ...values,
      runStatus: 'IDLE',
      successCount: 0,
      failureCount: 0,
      successRate: 0,
      avgDuration: 0,
    };
    _jobs = [newJob, ..._jobs];
  }
};

const STEPS = [
  'Khởi tạo tiến trình...',
  'Kết nối nguồn dữ liệu...',
  'Đang xử lý dữ liệu...',
  'Đang ghi kết quả...',
  'Hoàn tất.',
];

const nowText = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export interface JobFilters {
  keyword: string;
  status?: JobStatus;
  runStatus?: JobRunStatus;
}

const EMPTY_FILTERS: JobFilters = { keyword: '', status: undefined, runStatus: undefined };

export function useJobSimple() {
  const [jobs, setJobs] = useState<IJobSimple[]>(_jobs);
  const [runs, setRuns] = useState<IJobRunSimple[]>(_runs);

  // Bộ lọc: draft = đang nhập, applied = đã bấm "Tìm kiếm"
  const [draft, setDraft] = useState<JobFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<JobFilters>(EMPTY_FILTERS);

  // Quản lý interval mô phỏng tiến trình theo từng jobId
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const syncJobs = useCallback(() => setJobs([..._jobs]), []);

  const clearTimer = useCallback((id: string) => {
    const t = timers.current[id];
    if (t) {
      clearInterval(t);
      delete timers.current[id];
    }
  }, []);

  // Dọn mọi interval khi unmount. Job đang RUNNING (interval bị hủy theo
  // component) sẽ không có tiến trình nào hoàn tất → chuyển về PAUSED trong
  // store để lần mount sau không bị kẹt ở trạng thái "Đang chạy".
  useEffect(() => {
    const all = timers.current;
    return () => {
      const runningIds = Object.keys(all);
      runningIds.forEach((id) => clearInterval(all[id]));
      if (runningIds.length) {
        _jobs = _jobs.map((j) =>
          runningIds.includes(j.id) && j.runStatus === 'RUNNING'
            ? { ...j, runStatus: 'PAUSED', progress: undefined, currentStep: undefined }
            : j,
        );
      }
    };
  }, []);

  // ─── Bộ lọc ───────────────────────────────────────────────
  const setKeyword = useCallback((keyword: string) => setDraft((d) => ({ ...d, keyword })), []);
  const setStatus = useCallback((status?: JobStatus) => setDraft((d) => ({ ...d, status })), []);
  const setRunStatus = useCallback((runStatus?: JobRunStatus) => setDraft((d) => ({ ...d, runStatus })), []);
  const applyFilters = useCallback(() => setApplied(draft), [draft]);
  const resetFilters = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  }, []);

  const filteredJobs = useMemo(() => {
    const kw = applied.keyword.trim().toLowerCase();
    return jobs.filter((j) => {
      if (kw && !j.code.toLowerCase().includes(kw) && !j.name.toLowerCase().includes(kw)) return false;
      if (applied.status && j.status !== applied.status) return false;
      if (applied.runStatus && j.runStatus !== applied.runStatus) return false;
      return true;
    });
  }, [jobs, applied]);

  const stats = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter((j) => j.status === 'ACTIVE').length,
    running: jobs.filter((j) => j.runStatus === 'RUNNING').length,
    failed: jobs.filter((j) => j.runStatus === 'FAILED').length,
  }), [jobs]);

  const getJobRuns = useCallback(
    (jobId: string) => runs.filter((r) => r.jobId === jobId).sort((a, b) => b.startTime.localeCompare(a.startTime)),
    [runs],
  );

  // Lịch sử thay đổi (audit) — mock, chỉ đọc; mới nhất ở trên
  const getChangeLogs = useCallback(
    (jobId: string) =>
      mockJobChangeLogs.filter((l) => l.jobId === jobId).sort((a, b) => b.time.localeCompare(a.time)),
    [],
  );

  const patchJob = useCallback((id: string, patch: Partial<IJobSimple>) => {
    _jobs = _jobs.map((j) => (j.id === id ? { ...j, ...patch } : j));
    setJobs([..._jobs]);
  }, []);

  // ─── Thao tác ─────────────────────────────────────────────
  const toggleStatus = useCallback((id: string) => {
    _jobs = _jobs.map((j) =>
      j.id === id ? { ...j, status: j.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : j,
    );
    setJobs([..._jobs]);
  }, []);

  const runNow = useCallback((id: string) => {
    clearTimer(id);
    patchJob(id, { runStatus: 'RUNNING', progress: 0, currentStep: STEPS[0] });

    const startTime = nowText();
    const startMs = Date.now();
    let progress = 0;

    timers.current[id] = setInterval(() => {
      progress = Math.min(100, progress + Math.floor(Math.random() * 12) + 8);
      const stepIdx = Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length));

      if (progress >= 100) {
        clearTimer(id);
        const endTime = nowText();
        const duration = Date.now() - startMs;
        _jobs = _jobs.map((j) =>
          j.id === id
            ? {
                ...j,
                runStatus: 'IDLE',
                progress: undefined,
                currentStep: undefined,
                lastRunTime: endTime,
                successCount: j.successCount + 1,
                successRate: Math.round(((j.successCount + 1) / (j.successCount + 1 + j.failureCount)) * 1000) / 10,
              }
            : j,
        );
        setJobs([..._jobs]);
        _runs = [
          { id: `run-${Date.now()}`, jobId: id, status: 'SUCCESS', startTime, endTime, duration, triggeredBy: 'Thủ công' },
          ..._runs,
        ];
        setRuns([..._runs]);
      } else {
        patchJob(id, { progress, currentStep: STEPS[stepIdx] });
      }
    }, 700);
  }, [clearTimer, patchJob]);

  const stopJob = useCallback((id: string) => {
    clearTimer(id);
    const startTime = nowText();
    patchJob(id, { runStatus: 'PAUSED', progress: undefined, currentStep: undefined, lastRunTime: startTime });
    _runs = [
      { id: `run-${Date.now()}`, jobId: id, status: 'CANCELLED', startTime, endTime: startTime, triggeredBy: 'Thủ công', errorMessage: 'Người dùng dừng tiến trình.' },
      ..._runs,
    ];
    setRuns([..._runs]);
  }, [clearTimer, patchJob]);

  const saveJob = useCallback((values: IJobFormValues, editingId?: string) => {
    saveJobToStore(values, editingId);
    syncJobs();
  }, [syncJobs]);

  const deleteJob = useCallback((id: string) => {
    clearTimer(id);
    _jobs = _jobs.filter((j) => j.id !== id);
    setJobs([..._jobs]);
  }, [clearTimer]);

  return {
    jobs,
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
    getById: getJobById,
    defaultTimezone: DEFAULT_TIMEZONE,
    toggleStatus,
    runNow,
    stopJob,
    saveJob,
    deleteJob,
  };
}

export default useJobSimple;
