/**
 * @file invalidate-options.interface.ts
 * @description Interface defining options for cache invalidation operations
 */

import { CacheableMethod } from '../types';

/**
 * @interface InvalidateOptions
 * @description Configuration options for selective cache invalidation in repositories
 *
 * This interface allows for fine-grained control over which cached methods
 * should be invalidated during cache clearing operations.
 */
export interface InvalidateOptions {
  /**
   * @property {Array<CacheableMethod>} methods
   * @description List of specific repository methods whose cache should be invalidated
   *
   * When provided, only cache entries for the specified methods will be invalidated.
   * When null or undefined, all cache entries for the entity will be invalidated.
   */
  methods?: Array<CacheableMethod>;
}
