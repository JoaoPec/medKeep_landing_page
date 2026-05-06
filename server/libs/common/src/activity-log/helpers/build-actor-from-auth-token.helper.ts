import type { AuthTokenPayload } from '../../auth/interfaces/auth-token-payload.interface';
import { mapUserRoleToLogUserType } from './map-user-role-to-log-user-type.helper';

export interface ActivityLogActorFields {
  userType: ReturnType<typeof mapUserRoleToLogUserType>;
  userId: string;
  userName?: string;
  userAvatar?: string;
  ipAddress?: string;
}

export function buildActorFromAuthToken(
  payload: AuthTokenPayload,
  opts?: { userName?: string; userAvatar?: string; ipAddress?: string },
): ActivityLogActorFields {
  return {
    userType: mapUserRoleToLogUserType(payload.role),
    userId: String(payload.id),
    userName: opts?.userName,
    userAvatar: opts?.userAvatar,
    ipAddress: opts?.ipAddress,
  };
}
