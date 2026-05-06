/**
 * Interface defining options for configuring a cached repository.
 *
 * @description
 * This interface provides configuration options for repositories that implement
 * caching functionality. It allows for customization of cache behavior including
 * expiration time, key namespacing, and documentation.
 *
 * @example
 * ```typescript
 * const userRepositoryOptions: CachedRepositoryOptions = {
 *   ttl: 3600, // Cache user data for 1 hour
 *   keyPrefix: 'user:'
 * };
 * ```
 */
export interface CachedRepositoryOptions {
  /**
   * Time-to-live in seconds for cached items.
   * Defines how long items should remain in the cache before expiring.
   * @default undefined - Uses the system default TTL if not specified
   */
  ttl: number;

  /**
   * Prefix to apply to all cache keys for this repository.
   * Useful for namespacing cached items to avoid collisions.
   * @default undefined - No prefix is applied if not specified
   */
  keyPrefix: string;
}
