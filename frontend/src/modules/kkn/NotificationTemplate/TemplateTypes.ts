export type TemplateStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'APPROVED';
export type ChannelType = 'SMS' | 'EMAIL' | 'IN_APP' | 'WEB_PUSH';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ActionType = 'NONE' | 'OPEN_URL' | 'OPEN_SCREEN';
export type TemplateLanguage = 'vi' | 'en';

export interface IChannelContent {
  subject?: string;
  body: string;
  actionType: ActionType;
  actionValue?: string;
  // Per-channel policy Moved from global level
  quietHours: boolean;
  retryCount: number;
}

export type LanguageContentMap = Partial<Record<ChannelType, IChannelContent>>;

export interface INotificationTemplate {
  id: string;
  code: string;
  name: string;
  group: string;
  channels: ChannelType[];
  priority: PriorityLevel;
  languages: TemplateLanguage[];

  // contentMap[language][channel]
  contentMap: Partial<Record<TemplateLanguage, LanguageContentMap>>;

  // Throttling remains at Template Level (Workflow logic)
  throttling: {
    maxPerDay: number;
    minIntervalMinutes: number;
  };

  status: TemplateStatus;
  version: string;
  updatedBy: string;
  updatedAt: string;
}
