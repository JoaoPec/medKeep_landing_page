import { registerAs } from '@nestjs/config';

export type ActivityLogMinLevelValue = 'debug' | 'info' | 'success' | 'warning' | 'error';

export interface ActivityLogConfigShape {
  enabled: boolean;
  skipDebug: boolean;
  minLevel: ActivityLogMinLevelValue;
  httpEnabled: boolean;
}

const MIN_LEVELS: ActivityLogMinLevelValue[] = ['debug', 'info', 'success', 'warning', 'error'];

function parseMinLevel(raw: string | undefined): ActivityLogMinLevelValue {
  if (raw && MIN_LEVELS.includes(raw as ActivityLogMinLevelValue)) {
    return raw as ActivityLogMinLevelValue;
  }
  return 'debug';
}

export const activityLogConfig = registerAs(
  'activityLog',
  (): ActivityLogConfigShape => ({
    enabled: process.env.ACTIVITY_LOG_ENABLED !== 'false',
    skipDebug: process.env.ACTIVITY_LOG_SKIP_DEBUG !== 'false',
    minLevel: parseMinLevel(process.env.ACTIVITY_LOG_MIN_LEVEL),
    httpEnabled: process.env.ACTIVITY_LOG_HTTP_ENABLED === 'true',
  }),
);
