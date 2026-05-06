import { Injectable } from '@nestjs/common';
import { Either, Nullable } from '../../interfaces';
import { IEntity, IRepositoryCacheService } from '../interfaces';
import { BaseRepository, CachedRepository } from '../repositories';

/**
 * Service responsible for caching repository instances across the application
 * @class RepositoryCacheService
 * @implements {IRepositoryCacheService}
 * @description The RepositoryCacheService provides an in-memory cache for repository instances,
 * allowing efficient reuse of repositories across different parts of the application.
 * It implements the IRepositoryCacheService interface to provide a consistent API
 * for repository caching operations.
 */
@Injectable()
export class RepositoryCacheService implements IRepositoryCacheService {
  /**
   * In-memory cache storing repository instances
   * @private
   * @static
   * @type {Map<string, Either<BaseRepository<any>, CachedRepository<any>>>}
   * @description Uses a Map to store repository instances by entity name
   */
  private static cache: Map<string, Either<BaseRepository<any>, CachedRepository<any>>> = new Map<
    string,
    Either<BaseRepository<any>, CachedRepository<any>>
  >();

  /**
   * Retrieves a cached repository instance for a specific entity
   * @template T - The entity type for the repository
   * @param {string} entityName - The name of the entity
   * @returns {Nullable<Either<BaseRepository<T>, CachedRepository<T>>>} The cached repository instance or undefined if not found
   * @description Looks up a repository in the cache using entityName.
   * Returns the cached repository instance if found, or undefined/null if not available.
   */
  public get<T extends IEntity>(
    entityName: string,
  ): Nullable<Either<BaseRepository<T>, CachedRepository<T>>> {
    if (!RepositoryCacheService.cache.has(entityName)) {
      return null;
    }

    return RepositoryCacheService.cache.get(entityName);
  }

  /**
   * Stores a repository instance in the cache for a specific entity
   * @template T - The entity type for the repository
   * @param {string} entityName - The name of the entity
   * @param {Either<BaseRepository<T>, CachedRepository<T>>} repository - The repository instance to cache
   * @description Adds or updates a repository in the cache using entityName.
   * If a repository already exists for the same key, it will be overwritten.
   */
  public set<T extends IEntity>(
    entityName: string,
    repository: Either<BaseRepository<T>, CachedRepository<T>>,
  ): void {
    RepositoryCacheService.cache.set(entityName, repository);
  }

  /**
   * Clears repository instances from the cache
   * @param {string} [entityName] - Optional entity name to clear specific entity repositories
   * @description Provides cache invalidation:
   * - If entityName is provided, only that specific entity's repository is removed
   * - If no parameters are provided, the entire cache is cleared
   */
  public clear(entityName?: string): void {
    if (entityName) {
      RepositoryCacheService.cache.delete(entityName);
    } else {
      RepositoryCacheService.cache.clear();
    }
  }
}
