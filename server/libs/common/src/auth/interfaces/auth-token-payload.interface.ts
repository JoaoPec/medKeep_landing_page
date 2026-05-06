import { UserRole } from '../../database';

export interface AuthTokenPayload {
  id?: string | number;
  sub?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  role?: UserRole;
  roleCode?: string;
  tenantId?: string;
  email?: string;
  [key: string]: unknown;
}
