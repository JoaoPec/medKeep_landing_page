import { Either, Nullable } from '../../interfaces';
import { BaseRepository, CachedRepository } from '../repositories';
import { IEntity } from './entity.interface';

/**
 * Interface defining the contract for a repository cache service
 * @interface IRepositoryCacheService
 * @description Provides methods for caching repository instances by tenant and entity name,
 * allowing for efficient reuse of repository instances across the application.
 * Helps optimize performance by preventing redundant repository creation and maintaining
 * a consistent repository state during request processing.
 */
export interface IRepositoryCacheService {
  /**
   * Retrieves a cached repository instance for a specific tenant and entity
   * @template T - The entity type for the repository
   * @param {string} entityName - The name of the entity
   * @returns {Nullable<Either<BaseRepository<T>, CachedRepository<T>>>} The cached repository instance or undefined if not found
   * @description Looks up a repository in the cache using entityName.
   * Returns the cached repository instance if found, or undefined/null if not available.
   * This method supports both standard and cached repository types.
   */
  get<T extends IEntity>(
    entityName: string,
  ): Nullable<Either<BaseRepository<T>, CachedRepository<T>>>;

  /**
   * Stores a repository instance in the cache for a specific entity
   * @template T - The entity type for the repository
   * @param {string} entityName - The name of the entity
   * @param {Either<BaseRepository<T>, CachedRepository<T>>} repository - The repository instance to cache
   * @description Adds or updates a repository in the cache using entityName.
   * If a repository already exists for the same key, it will be overwritten with the new instance.
   * This method handles both standard and cached repository types.
   */
  set<T extends IEntity>(
    entityName: string,
    repository: Either<BaseRepository<T>, CachedRepository<T>>,
  ): void;

  /**
   * Clears repository instances from the cache
   * @param {string} [tenantId] - Optional tenant ID to clear specific tenant repositories
   * @param {string} [entityName] - Optional entity name to clear specific entity repositories
   * @description Provides flexible cache invalidation options:
   * - If both tenantId and entityName are provided, only the specific tenant-entity combination is removed
   * - If only tenantId is provided, all repositories for that tenant are cleared
   * - If only entityName is provided, repositories for that entity across all tenants are cleared
   * - If no parameters are provided, the entire cache is cleared, removing all repository instances
   * This method is useful for memory management and ensuring fresh repository instances when needed,
   * particularly after data model changes or when switching between tenants.
   */
  clear(tenantId?: string, entityName?: string): void;
}
