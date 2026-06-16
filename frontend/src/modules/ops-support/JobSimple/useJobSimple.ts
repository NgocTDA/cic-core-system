'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mockJobs, mockJobRuns } from './mockData';
import type { IJobSimple, IJobRunSimple, IJobFormValues, JobStatus, JobRunStatus } from './types';

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
  const [jobs, setJobs] = useState<IJobSimple[]>(mockJobs);
  const [runs, setRuns] = useState<IJobRunSimple[]>(mockJobRuns);

  // Bộ lọc: draft = đang nhập, applied = đã bấm "Tìm kiếm"
  const [draft, setDraft] = useState<JobFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<JobFilters>(EMPTY_FILTERS);

  // Quản lý interval mô phỏng tiến trình theo từng jobId
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const clearTimer = useCallback((id: string) => {
    const t = timers.current[id];
    if (t) {
      clearInterval(t);
      delete timers.current[id];
    }
  }, []);

  // Dọn mọi interval khi unmount
  useEffect(() => {
    const all = timers.current;
    return () => {
      Object.values(all).forEach(clearInterval);
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

  const patchJob = useCallback((id: string, patch: Partial<IJobSimple>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  // ─── Thao tác ─────────────────────────────────────────────
  const toggleStatus = useCallback((id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: j.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : j)),
    );
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
        setJobs((prev) =>
          prev.map((j) =>
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
          ),
        );
        setRuns((prev) => [
          { id: `run-${Date.now()}`, jobId: id, status: 'SUCCESS', startTime, endTime, duration, triggeredBy: 'Thủ công' },
          ...prev,
        ]);
      } else {
        patchJob(id, { progress, currentStep: STEPS[stepIdx] });
      }
    }, 700);
  }, [clearTimer, patchJob]);

  const stopJob = useCallback((id: string) => {
    clearTimer(id);
    const startTime = nowText();
    patchJob(id, { runStatus: 'PAUSED', progress: undefined, currentStep: undefined, lastRunTime: startTime });
    setRuns((prev) => [
      { id: `run-${Date.now()}`, jobId: id, status: 'CANCELLED', startTime, endTime: startTime, triggeredBy: 'Thủ công', errorMessage: 'Người dùng dừng tiến trình.' },
      ...prev,
    ]);
  }, [clearTimer, patchJob]);

  const saveJob = useCallback((values: IJobFormValues, editingId?: string) => {
    if (editingId) {
      patchJob(editingId, { ...values });
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
      setJobs((prev) => [newJob, ...prev]);
    }
  }, [patchJob]);

  const deleteJob = useCallback((id: string) => {
    clearTimer(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
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
    toggleStatus,
    runNow,
    stopJob,
    saveJob,
    deleteJob,
  };
}

export default useJobSimple;
