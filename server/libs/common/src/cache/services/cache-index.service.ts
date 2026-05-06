import { Either, OneOrMany } from '@app/common/interfaces';
import { Injectable } from '@nestjs/common';
import { ICacheIndexService, ICacheOptions } from '../interfaces';
import { CacheCriteria } from '../types';
import { CacheService } from './cache.service';

/**
 * Service for dynamically generating and managing cache keys
 * @class CacheIndexService
 * @implements {ICacheIndexService}
 * @description Provides a standardized way to generate, retrieve, store and invalidate
 * dynamically generated cache entries based on resource-specific parameters.
 * Handles complex caching scenarios with support for:
 * - Dynamic key generation from parameters
 * - Bulk operations
 * - Pattern-based invalidation
 * - Nested object caching
 */
@Injectable()
export class CacheIndexService implements ICacheIndexService {
  constructor(private readonly cacheService: CacheService) {}

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
  public async get<T>(
    baseKey: string,
    params: CacheCriteria,
    options?: ICacheOptions,
  ): Promise<Either<T, null>> {
    const cacheKey: string = this.generateCacheKey(baseKey, params);

    const result: Either<T, null> = await this.cacheService.get<T>(cacheKey, {
      withExcluded: options?.withExcluded,
    });

    return result;
  }

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
  public async set<T>(
    baseKey: string,
    params: CacheCriteria,
    value: T,
    options?: ICacheOptions,
  ): Promise<void> {
    const cacheKey: string = this.generateCacheKey(baseKey, params);

    await this.cacheService.set(cacheKey, value, options);
  }

  /**
   * Checks if a key exists in cache
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {CacheCriteria} params - Parameters to generate the cache key
   * @returns {Promise<boolean>} True if key exists, false otherwise
   * @description Verifies existence of a cache entry without retrieving its value.
   * Uses dynamic key generation from baseKey and params.
   */
  public async has(baseKey: string, params: CacheCriteria): Promise<boolean> {
    const cacheKey: string = this.generateCacheKey(baseKey, params);
    return await this.cacheService.has(cacheKey);
  }

  /**
   * Deletes one or more specific cache entries
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {OneOrMany<CacheCriteria>} params - Single or multiple parameters to generate cache keys
   * @returns {Promise<number>} Number of cache entries that were deleted
   * @description Removes specific cache entries based on exact key matches.
   * Supports bulk deletion when given multiple parameters.
   */
  public async delete(baseKey: string, params: OneOrMany<CacheCriteria>): Promise<number> {
    const cacheKeys: OneOrMany<string> = this.generateCacheKey(baseKey, params);
    const normalizedCacheKeys: Array<string> = Array.isArray(cacheKeys) ? cacheKeys : [cacheKeys];

    if (normalizedCacheKeys.length === 0) {
      return 0;
    }

    return await this.cacheService.del(normalizedCacheKeys);
  }

  /**
   * Invalidates cache entries by base key pattern
   * @param {OneOrMany<string>} baseKey - Base key prefix to invalidate
   * @returns {Promise<number>} Number of cache entries that were invalidated
   * @description Removes all cache entries that match the given base key pattern.
   * Uses wildcard matching to clear related cache entries.
   */
  public async deleteByPrefix(baseKey: OneOrMany<string>): Promise<number> {
    const normalizedBaseKeys: Array<string> = Array.isArray(baseKey) ? baseKey : [baseKey];

    if (normalizedBaseKeys.length === 0) {
      return 0;
    }

    return await this.cacheService.del(normalizedBaseKeys.map((key) => `${key}:*`));
  }

  /**
   * Generates a single cache key from a base key and parameters
   * @param {string} baseKey - Base key prefix for the cache entry
   * @param {CacheCriteria} params - Single parameter object to generate the cache key
   * @returns {string} Generated cache key string
   */
  private generateCacheKey(baseKey: string, params: CacheCriteria): string;

  /**
   * Generates multiple cache keys from a base key and array of parameters
   * @param {string} baseKey - Base key prefix for the cache entries
   * @param {Array<CacheCriteria>} params - Array of parameter objects to generate cache keys
   * @returns {Array<string>} Array of generated cache key strings
   */
  private generateCacheKey(baseKey: string, params: Array<CacheCriteria>): Array<string>;

  /**
   * Generates one or more cache keys from a base key and parameters
   * @param {string} baseKey - Base key prefix for the cache entries
   * @param {OneOrMany<CacheCriteria>} params - Single parameter or array of parameters
   * @returns {OneOrMany<string>} Single cache key string or array of cache key strings
   */
  private generateCacheKey(baseKey: string, params: OneOrMany<CacheCriteria>): OneOrMany<string>;

  /**
   * Generates deterministic cache keys by combining base key with formatted parameters
   * @param {string} baseKey - Base key prefix for the cache entries
   * @param {OneOrMany<CacheCriteria>} params - Single parameter or array of parameters
   * @returns {OneOrMany<string>} Generated cache key(s)
   * @description
   * Creates consistent cache keys by combining the base key with formatted parameter values.
   * Supports both single and bulk key generation with consistent formatting.
   * Handles complex parameter types including:
   * - Primitive values (string, number, boolean)
   * - Arrays (with consistent sorting)
   * - Nested objects (with recursive formatting)
   * - Null/undefined handling
   * For bulk operations, automatically deduplicates generated keys.
   */
  private generateCacheKey(baseKey: string, params: OneOrMany<CacheCriteria>): OneOrMany<string> {
    // Handle single parameter case
    if (!Array.isArray(params)) {
      return this.formatParamValue(baseKey, params);
    }

    // Handle array of parameters case
    const paramsArray: Array<CacheCriteria> = params;

    // Generate cache keys for each parameter and filter out duplicates
    const uniqueKeys: Set<string> = new Set<string>();

    paramsArray.forEach((param) => {
      uniqueKeys.add(this.formatParamValue(baseKey, param));
    });

    return Array.from(uniqueKeys);
  }

  /**
   * Formats a parameter value for inclusion in a cache key
   * @param {string} keyPrefix - Prefix for the key (used for nested objects)
   * @param {CacheCriteria} value - The value to format
   * @returns {string} Formatted string representation of the value
   * @private
   * @description Converts various parameter types into consistent string representations.
   * Handles:
   * - Primitive types (string, number, boolean)
   * - Arrays (with sorting for consistency)
   * - Nested objects (with recursive formatting)
   * - Null/undefined values
   */
  private formatParamValue(keyPrefix: string, value: CacheCriteria): string {
    // Handle null or undefined
    if (value === null || value === undefined) {
      return '';
    }

    // Handle primitive types (string, number, boolean)
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return keyPrefix ? `${keyPrefix}:${value}` : `${value}`;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      // Sort and stringify array values for consistent keys
      const sortedArray: Array<CacheCriteria> = [...value]
        .filter((item) => item !== null && item !== undefined)
        .sort();

      // Handle empty arrays
      if (sortedArray.length === 0) {
        return keyPrefix ? `${keyPrefix}:[]` : '[]';
      }

      // Process each array item
      const formattedItems: string = sortedArray
        .map((item) => {
          if (typeof item === 'object') {
            return this.formatParamValue('', item);
          }
          return `${item}`;
        })
        .join('-');

      return keyPrefix ? `${keyPrefix}:[${formattedItems}]` : `[${formattedItems}]`;
    }

    // Handle objects (Record<string, any>)
    if (typeof value === 'object') {
      // Sort keys for consistent ordering
      const sortedKeys: Array<string> = Object.keys(value).sort();

      // Handle empty objects
      if (sortedKeys.length === 0) {
        return keyPrefix ? `${keyPrefix}:{}` : '{}';
      }

      // Filter out undefined/null values and build key components
      const keyComponents: Array<string> = sortedKeys
        .filter((key) => value[key] !== undefined && value[key] !== null)
        .map((key) => {
          const propValue: CacheCriteria = value[key];
          const nestedKeyPrefix: string = key;

          return this.formatParamValue(nestedKeyPrefix, propValue);
        })
        .filter((component) => component.length > 0);

      if (keyComponents.length === 0) {
        return keyPrefix ? `${keyPrefix}:{}` : '{}';
      }

      const objectStr: string = keyComponents.join(':');
      return keyPrefix ? `${keyPrefix}:${objectStr}` : objectStr;
    }

    // Default case (shouldn't reach here in practice)
    return keyPrefix ? `${keyPrefix}:${String(value)}` : String(value);
  }

  /**
   * Combines two cache criteria objects into a single merged criteria
   * @param {CacheCriteria} criteria1 - First cache criteria object
   * @param {CacheCriteria} criteria2 - Second cache criteria object
   * @returns {CacheCriteria} A merged criteria object
   * @description
   * Merges two cache criteria objects into a single object that can be used
   * for cache key generation. The method carefully combines values to ensure
   * compatibility with the formatParamValue method and handles:
   * - Deep merging of nested objects
   * - Proper array handling with consistent ordering
   * - Combining primitive values in a deterministic way
   * - Null/undefined value handling
   */
  public combineCriteria(criteria1: CacheCriteria, criteria2: CacheCriteria): CacheCriteria {
    // Handle null or undefined inputs
    if (criteria1 === null || criteria1 === undefined) {
      return criteria2 !== null && criteria2 !== undefined ? criteria2 : {};
    }

    if (criteria2 === null || criteria2 === undefined) {
      return criteria1;
    }

    // Both inputs are primitive types
    if (this.isPrimitive(criteria1) && this.isPrimitive(criteria2)) {
      // Create an array with both values for consistent cache key generation
      return [criteria1, criteria2];
    }

    // One input is primitive, one is an array
    if (this.isPrimitive(criteria1) && Array.isArray(criteria2)) {
      return [criteria1, ...criteria2];
    }

    if (Array.isArray(criteria1) && this.isPrimitive(criteria2)) {
      return [...criteria1, criteria2];
    }

    // One input is primitive, one is an object
    if (this.isPrimitive(criteria1) && this.isObject(criteria2)) {
      // Add primitive as a special property, to maintain object structure
      return { _value: criteria1, ...(criteria2 as Record<string, any>) };
    }

    if (this.isObject(criteria1) && this.isPrimitive(criteria2)) {
      return { ...(criteria1 as Record<string, any>), _value: criteria2 };
    }

    // Both are arrays - concatenate preserving order
    if (Array.isArray(criteria1) && Array.isArray(criteria2)) {
      return [...criteria1, ...criteria2];
    }

    // One is array, one is object
    if (Array.isArray(criteria1) && this.isObject(criteria2)) {
      // Store array under _items key to maintain structure
      return { _items: criteria1, ...(criteria2 as Record<string, any>) };
    }

    if (this.isObject(criteria1) && Array.isArray(criteria2)) {
      return { ...(criteria1 as Record<string, any>), _items: criteria2 };
    }

    // Both are objects - perform deep merge with careful handling of duplicate keys
    if (this.isObject(criteria1) && this.isObject(criteria2)) {
      const result = { ...(criteria1 as Record<string, any>) };

      for (const key in criteria2 as Record<string, any>) {
        if (Object.prototype.hasOwnProperty.call(criteria2, key)) {
          const value2 = (criteria2 as Record<string, any>)[key];

          // Skip if property doesn't exist in criteria2
          if (value2 === undefined || value2 === null) {
            continue;
          }

          // If property exists in both objects
          if (key in result) {
            const value1 = result[key];

            if (value1 === undefined || value1 === null) {
              result[key] = value2;
              continue;
            }

            // Both values are arrays
            if (Array.isArray(value1) && Array.isArray(value2)) {
              result[key] = [...value1, ...value2];
            }
            // Both values are objects
            else if (this.isObject(value1) && this.isObject(value2)) {
              result[key] = this.combineCriteria(value1, value2);
            }
            // Mixed types or both primitives - use array to preserve both
            else {
              result[key] = [value1, value2];
            }
          }
          // Property only exists in criteria2
          else {
            result[key] = value2;
          }
        }
      }

      return result;
    }

    // Default case - if we somehow got here (shouldn't in practice)
    // Return an array with both values to ensure nothing is lost
    return [criteria1, criteria2];
  }

  /**
   * Helper method to check if a value is a primitive
   * @param value - Value to check
   * @returns boolean - True if value is a primitive
   * @private
   */
  private isPrimitive(value: CacheCriteria): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'bigint' ||
      typeof value === 'boolean'
    );
  }

  /**
   * Helper method to check if a value is an object (not array, not null)
   * @param value - Value to check
   * @returns boolean - True if value is an object
   * @private
   */
  private isObject(value: CacheCriteria): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
