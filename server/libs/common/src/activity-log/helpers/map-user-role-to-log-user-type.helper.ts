import { UserRole } from '../../database';
import type { ActivityLogUserType } from '../activity-log.types';

export function mapUserRoleToLogUserType(role: UserRole): ActivityLogUserType {
  switch (role) {
    case UserRole.Admin:
      return 'admin';
    case UserRole.Advertiser:
      return 'companion';
    case UserRole.Partner:
      return 'ambassador';
    case UserRole.Customer:
    case UserRole.Member:
    case UserRole.Corporate:
      return 'client';
    default:
      return 'client';
  }
}
