'use client';

import { useMemo, useState, useCallback } from 'react';
import type { IJob, IJobRun, JobManagementStats } from './types';
import { mockJobs, mockJobRuns } from './mockData';

interface UseJobManagementReturn {
  jobs: IJob[];
  runs: IJobRun[];
  filteredJobs: IJob[];
  selectedJobId: string | null;
  selectedJob: IJob | null;
  stats: JobManagementStats;
  searchQuery: string;
  filterCode: string;
  filterName: string;
  filterServiceCode: string;
  filterStatus: string;
  filterCategory: string;
  filterOwner: string;
  filterPriority: number | '';
  filterRunStatus: string;
  setSearchQuery: (query: string) => void;
  setFilterCode: (code: string) => void;
  setFilterName: (name: string) => void;
  setFilterServiceCode: (serviceCode: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterOwner: (owner: string) => void;
  setFilterPriority: (priority: number | '') => void;
  setFilterRunStatus: (status: string) => void;
  setSelectedJobId: (id: string | null) => void;
  getJobRuns: (jobId: string) => IJobRun[];
  runJob: (jobId: string) => void;
  stopJob: (jobId: string) => void;
}

export const useJobManagement = (): UseJobManagementReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterServiceCode, setFilterServiceCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterPriority, setFilterPriority] = useState<number | ''>('');
  const [filterRunStatus, setFilterRunStatus] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<IJob[]>(mockJobs);
  const [runs, setRuns] = useState<IJobRun[]>(mockJobRuns);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Direct field filters
      const cTerm = filterCode.trim().toLowerCase();
      const nTerm = filterName.trim().toLowerCase();
      const sTerm = filterServiceCode.trim().toLowerCase();

      const matchesCode = !cTerm || job.code.toLowerCase().includes(cTerm);
      const matchesName = !nTerm || job.name.toLowerCase().includes(nTerm);
      const matchesServiceCode = !sTerm || (job.serviceCode && job.serviceCode.toLowerCase().includes(sTerm));

      // Global fallback search query if used
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        job.code.toLowerCase().includes(q) ||
        job.name.toLowerCase().includes(q) ||
        (job.serviceCode && job.serviceCode.toLowerCase().includes(q));

      const matchesStatus = !filterStatus || job.status === filterStatus;
      const matchesCategory = !filterCategory || job.category === filterCategory;

      return (
        matchesCode &&
        matchesName &&
        matchesServiceCode &&
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    jobs,
    filterCode,
    filterName,
    filterServiceCode,
    searchQuery,
    filterStatus,
    filterCategory,
  ]);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const stats = useMemo((): JobManagementStats => {
    const total = jobs.length;
    const running = jobs.filter((j) => j.runStatus === 'RUNNING').length;
    const failed = jobs.filter((j) => j.runStatus === 'FAILED').length;
    const scheduled = jobs.filter((j) => j.runStatus === 'SCHEDULED').length;
    const totalSuccessRate =
      jobs.length > 0
        ? jobs.reduce((sum, job) => sum + job.successRate, 0) / jobs.length
        : 0;

    return {
      total,
      running,
      failed,
      scheduled,
      successRate: Math.round(totalSuccessRate * 10) / 10,
    };
  }, [jobs]);

  const getJobRuns = useCallback(
    (jobId: string): IJobRun[] => {
      return runs.filter((r) => r.jobId === jobId).sort((a, b) => {
        const timeA = new Date(a.startTime).getTime();
        const timeB = new Date(b.startTime).getTime();
        return timeB - timeA;
      });
    },
    [runs]
  );

  const runJob = useCallback((jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const newRun: IJobRun = {
      id: `run-${Date.now()}`,
      jobId,
      status: 'RUNNING',
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      triggeredBy: 'admin_01',
      triggerType: 'MANUAL',
      progress: 0,
      currentStep: 'Initializing...',
      logs: [],
    };

    setRuns([newRun, ...runs]);

    const updatedJob = { ...job, runStatus: 'RUNNING' as const };
    setJobs(jobs.map((j) => (j.id === jobId ? updatedJob : j)));
  }, [jobs, runs]);

  const stopJob = useCallback((jobId: string) => {
    const updatedJob = jobs.find((j) => j.id === jobId);
    if (!updatedJob) return;

    const newJob = { ...updatedJob, runStatus: 'IDLE' as const };
    setJobs(jobs.map((j) => (j.id === jobId ? newJob : j)));
  }, [jobs]);

  return {
    jobs,
    runs,
    filteredJobs,
    selectedJobId,
    selectedJob,
    stats,
    searchQuery,
    filterCode,
    filterName,
    filterServiceCode,
    filterStatus,
    filterCategory,
    filterOwner,
    filterPriority,
    filterRunStatus,
    setSearchQuery,
    setFilterCode,
    setFilterName,
    setFilterServiceCode,
    setFilterStatus,
    setFilterCategory,
    setFilterOwner,
    setFilterPriority,
    setFilterRunStatus,
    setSelectedJobId,
    getJobRuns,
    runJob,
    stopJob,
  };
};
