import { Either, OneOrMany } from '@app/common/interfaces';
import { CacheCriteria } from '../types';
import { ICacheOptions } from './cache-options.interface';

/**
 * Interface defining the dynamic cache service functionality
 * @interface ICacheIndexService
 * @description Provides methods for generating, retrieving, storing and invalidating
 * dynamically generated cache entries based on resource-specific parameters.
 * Supports complex caching scenarios with:
 * - Dynamic key generation from parameters
 * - Bulk operations
 * - Pattern-based invalidation
 * - Nested object caching
 */
export interface ICacheIndexService {
  /**
   * Gets a value from cache using dynamically generated key
   * @template T - Type of the cached value
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {CacheCriteria} params - Parameters used to generate the unique cache key
   * @param {ICacheOptions} [options] - Optional cache retrieval configuration
   * @returns {Promise<Either<T, null>>} Resolves to cached value or null if not found
   * @description Retrieves a cached value using a key generated from the baseKey and params.
   * Supports type-safe retrieval and optional configuration for excluded properties.
   */
  get<T>(baseKey: string, params: CacheCriteria, options?: ICacheOptions): Promise<Either<T, null>>;

  /**
   * Stores a value in cache using dynamically generated key
   * @template T - Type of the value to cache
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {CacheCriteria} params - Parameters used to generate the unique cache key
   * @param {T} value - Value to store in cache
   * @param {ICacheOptions} [options] - Optional cache storage configuration
   * @returns {Promise<void>} Resolves when value is successfully cached
   * @description Stores a value in cache with a key generated from baseKey and params.
   * Supports type-safe storage and optional TTL configuration.
   */
  set<T>(baseKey: string, params: CacheCriteria, value: T, options?: ICacheOptions): Promise<void>;

  /**
   * Checks if a key exists in cache
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {CacheCriteria} params - Parameters to generate the cache key
   * @returns {Promise<boolean>} True if key exists, false otherwise
   * @description Verifies existence of a cache entry without retrieving its value.
   * Uses dynamic key generation from baseKey and params.
   */
  has(baseKey: string, params: CacheCriteria): Promise<boolean>;

  /**
   * Deletes one or more specific cache entries
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {OneOrMany<CacheCriteria>} params - Single or multiple parameters to generate cache keys
   * @returns {Promise<number>} Number of cache entries that were deleted
   * @description Removes specific cache entries based on exact key matches.
   * Supports bulk deletion when given multiple parameters.
   */
  delete(baseKey: string, params: OneOrMany<CacheCriteria>): Promise<number>;

  /**
   * Deletes all cache entries for a given base key pattern
   * @param {OneOrMany<string>} baseKey - Base key prefix for the cache entries
   * @returns {Promise<number>} Number of cache entries that were deleted
   * @description Removes all cache entries that match the given base key pattern.
   * Uses wildcard matching to clear related cache entries.
   */
  deleteByPrefix(baseKey: OneOrMany<string>): Promise<number>;

  /**
   * Combines two cache criteria
   * @param {CacheCriteria} criteria1 - First criteria to combine
   * @param {CacheCriteria} criteria2 - Second criteria to combine
   * @returns {CacheCriteria} Combined criteria
   * @description Combines two cache criteria into a single array
   */
  combineCriteria(criteria1: CacheCriteria, criteria2: CacheCriteria): CacheCriteria;
}
