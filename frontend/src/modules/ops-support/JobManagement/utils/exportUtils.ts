import type { IJobRun } from '../types';

export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  includeFields: string[];
  includeLogs: boolean;
}

/* export */ const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'json',
  includeFields: ['id', 'status', 'startTime', 'duration', 'triggeredBy'],
  includeLogs: false,
};

export const exportRuns = (runs: IJobRun[], options: ExportOptions = DEFAULT_EXPORT_OPTIONS) => {
  switch (options.format) {
    case 'json':
      return exportAsJson(runs, options);
    case 'csv':
      return exportAsCsv(runs, options);
    default:
      return exportAsJson(runs, options);
  }
};

function exportAsJson(runs: IJobRun[], options: ExportOptions) {
  const data = runs.map(run => {
    const obj: Record<string, any> = {};
    options.includeFields.forEach(field => {
      obj[field] = (run as any)[field];
    });
    if (options.includeLogs && run.logs) {
      obj.logs = run.logs;
    }
    return obj;
  });

  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'job-runs.json', 'application/json');
}

function exportAsCsv(runs: IJobRun[], options: ExportOptions) {
  const headers = options.includeFields;
  const rows = runs.map(run =>
    headers.map(field => {
      const value = (run as any)[field];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  downloadFile(csv, 'job-runs.csv', 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export const compareRuns = (run1: IJobRun, run2: IJobRun) => {
  return {
    durationDiff: (run2.duration || 0) - (run1.duration || 0),
    recordsDiff: (run2.recordsProcessed || 0) - (run1.recordsProcessed || 0),
    statusMatch: run1.status === run2.status,
    startTimeDiff: new Date(run2.startTime).getTime() - new Date(run1.startTime).getTime(),
  };
};
