import { EntityTarget } from 'typeorm';
import { Nullable } from '../../interfaces';
import { RepositoryOptions } from './repository-options.interface';

/**
 * Interface defining a mapping between a repository and its entity type with configuration options.
 *
 * @description
 * This interface provides a structure for associating an entity with its repository
 * configuration. It allows for specifying both the entity class and optional
 * repository behavior settings such as caching.
 *
 * @template T - The entity type that this repository manages
 *
 * @example
 * ```typescript
 * const userRepositoryMap: RepositoryEntityMap<User> = {
 *   entity: User,
 *   options: { cache: { ttl: 3600, keyPrefix: 'user:' } }
 * };
 * ```
 */
export interface RepositoryEntityMap<T> {
  /**
   * The entity class or table name that this repository manages.
   *
   * @description
   * Specifies the entity target that the repository will operate on.
   * This can be a class reference or a string representing the entity name.
   */
  entity: EntityTarget<T>;

  /**
   * Optional configuration settings for the repository behavior.
   *
   * @description
   * Defines optional settings that control repository features like caching.
   * When not provided, the repository will use default behavior.
   *
   * @default undefined - Uses default repository behavior if not specified
   */
  options?: Nullable<RepositoryOptions>;
}
