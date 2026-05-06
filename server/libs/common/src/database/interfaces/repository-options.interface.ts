import { Either, Nullable } from '../../interfaces';
import { CachedRepositoryOptions } from './cached-repository-options.interface';

/**
 * Interface defining options for configuring repository behavior.
 *
 * @description
 * This interface provides configuration options for repositories,
 * allowing customization of features like caching. It serves as a
 * central configuration point for repository instances.
 *
 * @example
 * ```typescript
 * const options: RepositoryOptions = {
 *   cache: { ttl: 1800, keyPrefix: 'product:' }
 * };
 * const repository = new ProductRepository(options);
 * ```
 */
export interface RepositoryOptions {
  /**
   * Configuration for repository caching behavior.
   *
   * @description
   * This property controls whether caching is enabled for the repository
   * and allows for detailed configuration of cache parameters.
   *
   * @property {boolean} - When set to true, enables caching with default settings.
   *                       When false, explicitly disables caching.
   * @property {CachedRepositoryOptions} - Provides detailed cache configuration
   *                                       including TTL and key prefixing.
   *
   * @default undefined - Caching is disabled by default if not specified
   *
   * @example
   * ```typescript
   * // Enable caching with default settings
   * const options = { cache: true };
   *
   * // Enable caching with custom configuration
   * const options = { cache: { ttl: 3600, keyPrefix: 'user:' } };
   *
   * // Explicitly disable caching
   * const options = { cache: false };
   * ```
   */
  cache?: Nullable<Either<boolean, Partial<CachedRepositoryOptions>>>;
}
