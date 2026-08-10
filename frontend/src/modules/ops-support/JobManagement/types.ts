import type { ChannelType } from '@/modules/kkn/NotificationTemplate/TemplateTypes';

// Job categories
export type JobCategory = 'DATA_SYNC' | 'REPORT' | 'CLEANUP' | 'VALIDATION' | 'BATCH';

// Job lifecycle status
export type JobStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

// Runtime status (last execution state)
/* export */ type JobRunStatus = 'RUNNING' | 'IDLE' | 'SCHEDULED' | 'FAILED' | 'PAUSED';

// Execution history status
/* export */ type JobExecutionStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELLED';

export type JobPriority = 1 | 2 | 3 | 4 | 5;

// User roles (role-based UI)
export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER';

export interface IJobSchedule {
  type: 'CRON' | 'MANUAL' | 'ONCE';
  expression?: string;
  timezone?: string;
  nextRunTime?: string;
  lastRunTime?: string;
}

/* export */ interface IRetryPolicy {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

/* export */ interface IJobNotificationRule {
  templateId: string;
  templateCode: string;
  channels: ChannelType[];
  variableMapping: Record<string, string>;
  enabled: boolean;
}

/* export */ interface IJobNotificationConfig {
  onSuccess?: IJobNotificationRule;
  onFailure?: IJobNotificationRule;
}

/* export */ interface IJobDependency {
  jobId: string;
  dependsOnJobId: string;
  dependencyType: 'HARD' | 'SOFT';
  conditionType?: 'SUCCESS' | 'ALWAYS';
}

export type JobConsoleType = 'SPRING_BEAN' | 'REST_API' | 'SQL_SCRIPT';
export type MisfirePolicyConsole = 'FIRE_NOW' | 'DO_NOTHING';
export type TriggerTypeOption = 'SCHEDULER' | 'EVENT' | 'MANUAL';
export type SchedulerOption = 'CRON_EXPRESSION' | 'TIME_PICKER';

export interface IConsoleNotificationEventChannels {
  sms: boolean;
  push: boolean;
  email: boolean;
  customRecipients?: string[];
}

export interface IConsoleNotificationMatrix {
  onStart: IConsoleNotificationEventChannels;
  onSuccess: IConsoleNotificationEventChannels;
  onFailure: IConsoleNotificationEventChannels;
  onRetry: IConsoleNotificationEventChannels;
}

export interface IJob {
  id: string;
  code: string;
  name: string;
  description: string;
  category: JobCategory;
  status: JobStatus;
  runStatus: JobRunStatus;
  priority: JobPriority;
  owner: string;
  tags: string[];

  schedule: IJobSchedule;
  timeout: number;
  retryPolicy: IRetryPolicy;

  // Job Engine Console fields
  type?: JobConsoleType;
  target?: string;
  targetLabel?: string;
  serviceCode?: string;
  triggerType?: TriggerTypeOption;
  schedulerType?: SchedulerOption;
  cron?: string;
  misfire?: MisfirePolicyConsole;
  concurrent?: boolean;
  params?: string; // YAML Payload

  maxRetries?: number;
  retryInterval?: number;

  enableNotify?: boolean;
  notifyEmails?: string;
  notificationMatrix?: IConsoleNotificationMatrix;

  inputSchema?: object;
  outputSchema?: object;
  parameters?: Record<string, unknown>;

  dataSource?: string;
  dataDestination?: string;

  notificationConfig?: IJobNotificationConfig;
  dependsOn: string[];

  successCount: number;
  failureCount: number;
  successRate: number;
  avgDuration: number;

  version: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

/* export */ interface IRunLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  step?: string;
  message: string;
}

export interface IJobRun {
  id: string;
  jobId: string;
  status: JobExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  retryCount?: number;
  triggeredBy: string;
  triggerType: 'MANUAL' | 'SCHEDULED' | 'TRIGGERED';
  parameters?: Record<string, unknown>;
  progress?: number;
  currentStep?: string;
  recordsProcessed?: number;
  recordsFailed?: number;
  errorMessage?: string;
  errorDetail?: string;
  logs?: IRunLog[];
}

export interface JobManagementStats {
  total: number;
  running: number;
  failed: number;
  scheduled: number;
  successRate: number;
}
