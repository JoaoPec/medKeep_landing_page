import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Nullable, OneOrMany } from '../../interfaces';
import { REDIS_CLIENT } from '../constants';
import { ICacheOptions, ICacheService } from '../interfaces';

/**
 * Service for interacting with Redis cache
 * @class CacheService
 * @implements {ICacheService}
 * @description Provides a standardized interface for Redis caching operations with JSON serialization support
 */
@Injectable()
export class CacheService implements ICacheService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  /**
   * Retrieves a value from Redis by its key
   * @template T - Type of the cached value
   * @param {string} key - The key to retrieve
   * @param {ICacheOptions} [options] - Optional configuration for cache retrieval
   * @returns {Promise<Nullable<T>>} A promise resolving to the cached value, or `null` if the key does not exist
   * @description Fetches and deserializes a cached value by key
   */
  public async get<T = any>(key: string, options?: ICacheOptions): Promise<Nullable<T>> {
    try {
      // Fetch raw data from Redis
      const data: string = await this.redisClient.get(key);

      if (!data) {
        return null; // Return null if the key does not exist
      }

      try {
        // Parse the JSON data
        return JSON.parse(data) as T;
      } catch (e) {
        return data as unknown as T; // If not JSON, return as a raw string
      }
    } catch (error) {
      console.error('Cache read failed:', error);
      return null; // Cache operation failed
    }
  }

  /**
   * Stores a value in Redis with optional configuration
   * @template T - Type of the value to store
   * @param {string} key - The key to store the value under
   * @param {T} value - The value to store
   * @param {ICacheOptions} [options] - Optional configuration for cache storage
   * @returns {Promise<void>} Resolves when the value has been successfully stored
   * @description Serializes and stores a value in the cache with optional TTL
   */
  public async set<T = any>(key: string, value: T, options?: ICacheOptions): Promise<void> {
    try {
      // Stringify the value
      const data: string = JSON.stringify(value);

      // Store with or without expiration based on TTL option
      if (options?.ttl) {
        await this.redisClient.set(key, data, 'PX', options.ttl); // Set with expiration in milliseconds
      } else {
        await this.redisClient.set(key, data); // Set without expiration
      }
    } catch (error) {
      console.error('Cache write failed:', error);
    }
  }

  /**
   * Deletes one or more keys from the Redis cache
   * @param {OneOrMany<string>} keys - Single key, array of keys, or pattern(s) with wildcards
   * @returns {Promise<number>} The total number of keys that were deleted
   * @description Handles both single key deletion and pattern-based deletion using wildcards.
   * For wildcard patterns, uses an efficient SCAN + UNLINK approach to safely delete matching keys
   * in batches without blocking Redis.
   */
  public async del(keys: OneOrMany<string>): Promise<number> {
    try {
      // Resolve the keys to tenant-specific keys
      const resolvedKeys: Array<string> = Array.isArray(keys) ? keys : [keys];

      // If no keys provided, return 0
      if (resolvedKeys.length === 0) {
        return 0;
      }

      // Separate normal keys from wildcard pattern keys
      const exactKeys: Array<string> = [];
      const patternKeys: Array<string> = [];

      resolvedKeys.forEach((key: string) => {
        if (key.includes('*')) {
          patternKeys.push(key);
        } else {
          exactKeys.push(key);
        }
      });

      // Process both exact and pattern keys in parallel for efficiency
      const [exactDeleted, patternDeleted]: [number, number] = await Promise.all([
        exactKeys.length > 0 ? this.redisClient.del(...exactKeys) : 0,
        this.deleteByPattern(patternKeys),
      ]);

      return exactDeleted + patternDeleted;
    } catch (error) {
      console.error('Cache deletion failed:', error);
      return 0; // Return 0 if the deletion failed
    }
  }

  /**
   * Deletes Redis keys matching the provided patterns
   * @private
   * @param {Array<string>} patternKeys - Array of patterns with wildcards to match keys for deletion
   * @returns {Promise<number>} Total number of keys deleted
   * @description Efficiently deletes keys matching wildcard patterns using Lua scripting
   */
  private async deleteByPattern(patternKeys: Array<string>): Promise<number> {
    let totalDeleted: number = 0;

    if (patternKeys.length > 0) {
      // Define Lua script for efficient batch deletion
      const luaScript = `
        -- Initialize variables for tracking deletion
        local cursor = 0
        local deletedCount = 0
  
        -- Keep scanning until we've covered all matching keys
        repeat
          -- Scan for matching keys in batches of 1000
          local result = redis.call('SCAN', cursor, 'MATCH', ARGV[1], 'COUNT', 1000)
          cursor = tonumber(result[1])
          local keys = result[2]
  
          -- Delete found keys if any exist
          if #keys > 0 then
            -- Use UNLINK for non-blocking deletion
            deletedCount = deletedCount + redis.call('UNLINK', unpack(keys))
          end
        until cursor == 0
  
        return deletedCount
      `;

      // Run all pattern deletions in parallel
      const patternResults: Array<number> = (await Promise.all(
        patternKeys.map((patternKey: string) => this.redisClient.eval(luaScript, 0, patternKey)),
      )) as Array<number>;

      // Sum up all the deletions from pattern keys
      totalDeleted += patternResults.reduce(
        (sum: number, deleted: number) => sum + (typeof deleted === 'number' ? deleted : 0),
        0,
      );
    }

    return totalDeleted;
  }

  /**
   * Checks if a key exists in Redis
   * @param {string} key - The key to check for existence
   * @returns {Promise<boolean>} True if the key exists, false otherwise
   * @description Verifies if a specific key exists in the cache
   */
  public async has(key: string): Promise<boolean> {
    try {
      const exists: number = await this.redisClient.exists(key);
      return exists === 1; // Redis `exists` returns 1 if the key exists
    } catch (error) {
      // If not operational, return false
      console.error('Cache check failed:', error);
      return false; // Return false if the key does not exist
    }
  }

  /**
   * Returns the time to live for a key in Redis
   * @param {string} key - The key to get the TTL for
   * @returns {Promise<number>} The TTL for the key
   */
  public async getTTL(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }
}
