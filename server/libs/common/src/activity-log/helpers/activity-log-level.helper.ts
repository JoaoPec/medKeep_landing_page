import type { ActivityLogLevel } from '../activity-log.types';
import type { ActivityLogMinLevelValue } from '../config';

const LEVEL_RANK: Record<ActivityLogLevel | ActivityLogMinLevelValue, number> = {
  debug: 0,
  info: 1,
  success: 2,
  warning: 3,
  error: 4,
};

export function isActivityLogLevelAllowed(
  level: ActivityLogLevel,
  minLevel: ActivityLogMinLevelValue,
  skipDebug: boolean,
): boolean {
  if (skipDebug && level === 'debug') {
    return false;
  }
  const incoming = LEVEL_RANK[level] ?? 0;
  const min = LEVEL_RANK[minLevel] ?? 0;
  return incoming >= min;
}
