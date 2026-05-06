import { Nullable } from '@app/common/interfaces';
import { ICacheOptions } from './cache-options.interface';

/**
 * The `ICacheService` interface defines the contract for a service responsible
 * for interacting with a caching layer. It provides methods for common cache operations
 * such as setting, getting, deleting, and checking the existence of cache entries.
 *
 * This service is typically used to abstract interactions with a caching backend (e.g., Redis),
 * allowing easy management of cached data within the application.
 */
export interface ICacheService {
  /**
   * Sets a value in the cache associated with the given key.
   * @param key - The unique identifier for the cache entry.
   * @param value - The value to be cached. Can be of any type, with T being a generic placeholder.
   * @param options - Optional configuration parameters for the cache operation
   * @returns A promise that resolves when the cache operation completes.
   */
  set<T = any>(key: string, value: T, options?: ICacheOptions): Promise<void>;

  /**
   * Retrieves a value from the cache associated with the given key.
   * If the key does not exist, `null` will be returned.
   * @param key - The unique identifier for the cache entry.
   * @param options - Optional configuration parameters for the cache operation
   * @returns A promise that resolves with the cached value, or `null` if the key is not found.
   */
  get<T = any>(key: string, options?: ICacheOptions): Promise<Nullable<T>>;

  /**
   * Deletes a cache entry associated with the given key.
   * @param key - The unique identifier for the cache entry to be removed.
   * @returns A promise that resolves with the number of keys deleted.
   */
  del(key: string): Promise<number>;

  /**
   * Checks if a cache entry exists for the given key.
   * @param key - The unique identifier for the cache entry.
   * @returns A promise that resolves to `true` if the key exists in the cache, otherwise `false`.
   */
  has(key: string): Promise<boolean>;

  /**
   * Returns the time to live for a key in Redis
   * @param key - The key to get the TTL for
   * @returns The TTL for the key
   */
  getTTL(key: string): Promise<number>;
}
