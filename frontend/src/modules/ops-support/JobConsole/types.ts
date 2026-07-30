// ─── Quản lý Job 2 (Job Console Engine) — Types ──────────────────

export type JobConsoleType = 'SPRING_BEAN' | 'REST_API' | 'SQL_SCRIPT';
export type JobConsoleStatus = 'ACTIVE' | 'PAUSED';
export type MisfirePolicyConsole = 'FIRE_NOW' | 'DO_NOTHING';
export type BackoffStrategyConsole = 'FIXED' | 'EXPONENTIAL';
export type BackoffMultiplierConsole = '2x' | '3x' | '5x';
export type ExecutionStatusConsole = 'SUCCESS' | 'FAILED';

export interface IConsoleNotificationEventChannels {
  sms: boolean;
  push: boolean;
  email: boolean;
}

export interface IConsoleNotificationMatrix {
  onStart: IConsoleNotificationEventChannels;
  onSuccess: IConsoleNotificationEventChannels;
  onFailure: IConsoleNotificationEventChannels;
  onRetry: IConsoleNotificationEventChannels;
}

export interface IJobLogConsole {
  id: string;
  time: string;
  duration: string;
  status: ExecutionStatusConsole;
  node: string;
  detail: string;
}

export interface IJobConsoleItem {
  code: string;
  name: string;
  type: JobConsoleType;
  target: string;
  targetLabel: string;
  cron: string;
  cronDesc: string;
  misfire: MisfirePolicyConsole;
  timeout: number;
  concurrent: boolean;
  status: JobConsoleStatus;
  params: string; // YAML Payload string

  // Retry Policy
  maxRetries: number;
  retryInterval: number;
  backoff: BackoffStrategyConsole;
  backoffMultiplier?: BackoffMultiplierConsole;

  // Alerting & Notification
  enableNotify: boolean;
  notifyEmails?: string;
  notificationMatrix?: IConsoleNotificationMatrix;

  // Legacy channel flags for backwards compatibility
  channelEmail?: boolean;
  channelPush?: boolean;
  channelSms?: boolean;

  // Execution History
  logs: IJobLogConsole[];
}
