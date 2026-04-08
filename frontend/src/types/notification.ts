export interface IFeedback {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
  isMe?: boolean;
}

export interface INotification {
  id: string;
  code: string;
  title: string;
  type: 'SYSTEM' | 'WARNING' | 'TASK' | 'PROMOTION';
  status: 'UNREAD' | 'READ';
  statusApproval: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
  receivedAt: string;
  lastProcessor: string;
  content: string;
  links?: { name: string; url: string }[];
  feedbacks?: IFeedback[];
}

