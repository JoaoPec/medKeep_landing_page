import { RoleCode } from '../../database';
import type { ActivityLogUserType } from '../activity-log.types';

export function mapRoleCodeToLogUserType(roleCode: RoleCode): ActivityLogUserType {
  switch (roleCode) {
    case RoleCode.AdminSuper:
    case RoleCode.AdminSupport:
    case RoleCode.AdminDev:
    case RoleCode.AdminFinance:
      return 'admin';
    case RoleCode.Advertiser:
      return 'companion';
    case RoleCode.Partner:
      return 'ambassador';
    case RoleCode.Customer:
    case RoleCode.Member:
    case RoleCode.Corporate:
      return 'client';
    default:
      return 'client';
  }
}
