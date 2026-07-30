'use client';

import { useState, useCallback, useMemo } from 'react';
import { mockConsoleJobs } from './mockData';
import type { IJobConsoleItem, JobConsoleStatus } from './types';

let _store: Record<string, IJobConsoleItem> = { ...mockConsoleJobs };

export function useJobConsole() {
  const [dataStore, setDataStore] = useState<Record<string, IJobConsoleItem>>(_store);
  const [selectedCode, setSelectedCode] = useState<string>('JOB_EXCHANGE_RATE_SYNC');
  const [activeTab, setActiveTab] = useState<'config' | 'logs'>('config');
  const [keyword, setKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const currentJob = useMemo(() => {
    return dataStore[selectedCode] || Object.values(dataStore)[0];
  }, [dataStore, selectedCode]);

  const filteredJobsList = useMemo(() => {
    const list = Object.values(dataStore);
    const kw = keyword.trim().toLowerCase();
    return list.filter((j) => {
      if (kw && !j.code.toLowerCase().includes(kw) && !j.name.toLowerCase().includes(kw)) {
        return false;
      }
      if (statusFilter && j.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [dataStore, keyword, statusFilter]);

  const selectJob = useCallback((code: string) => {
    setSelectedCode(code);
  }, []);

  const updateCurrentJobField = useCallback((patch: Partial<IJobConsoleItem>) => {
    if (!selectedCode) return;
    _store = {
      ..._store,
      [selectedCode]: {
        ..._store[selectedCode],
        ...patch,
      },
    };
    setDataStore(_store);
  }, [selectedCode]);

  const toggleStatus = useCallback(() => {
    if (!selectedCode) return;
    const current = _store[selectedCode];
    if (!current) return;
    const nextStatus: JobConsoleStatus = current.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    updateCurrentJobField({ status: nextStatus });
  }, [selectedCode, updateCurrentJobField]);

  const runNow = useCallback(() => {
    if (!selectedCode) return;
    const current = _store[selectedCode];
    if (!current) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `log-${Date.now()}`,
      time: nowStr,
      duration: '1.2s',
      status: 'SUCCESS' as const,
      node: '10.0.4.15',
      detail: 'Thực thi kích hoạt thủ công (Run Now) thành công.',
    };

    updateCurrentJobField({
      logs: [newLog, ...(current.logs || [])],
    });
  }, [selectedCode, updateCurrentJobField]);

  const saveJobConfig = useCallback((values: Partial<IJobConsoleItem>) => {
    if (!selectedCode) return;
    updateCurrentJobField(values);
  }, [selectedCode, updateCurrentJobField]);

  const createNewJob = useCallback((newJob: IJobConsoleItem) => {
    _store = {
      ..._store,
      [newJob.code]: newJob,
    };
    setDataStore(_store);
    setSelectedCode(newJob.code);
  }, []);

  return {
    dataStore,
    selectedCode,
    currentJob,
    filteredJobsList,
    activeTab,
    keyword,
    statusFilter,
    setKeyword,
    setStatusFilter,
    setActiveTab,
    selectJob,
    updateCurrentJobField,
    toggleStatus,
    runNow,
    saveJobConfig,
    createNewJob,
  };
}
