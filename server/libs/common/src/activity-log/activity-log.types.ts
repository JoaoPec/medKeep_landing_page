export type ActivityLogUserType =
  | 'system'
  | 'admin'
  | 'companion'
  | 'ambassador'
  | 'client'
  | 'creator';

export type ActivityLogLevel = 'debug' | 'info' | 'warning' | 'error' | 'success';

export type ActivityLogCategory =
  | 'auth'
  | 'user'
  | 'ad'
  | 'payment'
  | 'verification'
  | 'moderation'
  | 'system'
  | 'settings'
  | 'support';

export interface ActivityLogEnqueuePayload {
  userType: ActivityLogUserType;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  action: string;
  description: string;
  level: ActivityLogLevel;
  category: ActivityLogCategory;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  timestamp?: Date;
}
