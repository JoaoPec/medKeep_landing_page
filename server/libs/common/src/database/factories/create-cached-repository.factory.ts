import { Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, EntityTarget } from 'typeorm';
import { CacheService } from '../../cache';
import { Nullable } from '../../interfaces';
import { getCachedRepositoryToken } from '../helpers';
import { CachedRepositoryOptions, IEntity } from '../interfaces';
import { CachedRepository } from '../repositories';
import { RepositoryCacheService } from '../services';

/**
 * Creates a cached repository provider for applications.
 *
 * @description
 * This factory function generates a provider that creates cached repository instances.
 * It uses request-scoped providers to ensure proper repository isolation with caching capabilities.
 * The factory handles repository caching to improve performance by reusing existing repository instances when possible.
 *
 * @template T - The entity type for which to create a cached repository
 * @param {EntityTarget<T>} entity - The entity class for which to create a cached repository
 * @param {CachedRepositoryOptions} [options] - Optional configuration for the cached repository behavior
 * @returns {Provider} A NestJS provider configuration for the cached repository
 *
 * @example
 * ```typescript
 * // In a module's providers array:
 * providers: [
 *   createCachedRepositoryFactory(User, { ttl: 3600 }),
 *   createCachedRepositoryFactory(Product)
 * ]
 * ```
 */
export function createCachedRepositoryFactory<T extends IEntity>(
  entity: EntityTarget<T>,
  options?: Partial<CachedRepositoryOptions>,
): Provider {
  return {
    provide: getCachedRepositoryToken(entity),
    /**
     * Factory function that creates or retrieves a cached repository instance.
     *
     * @description
     * This factory first checks the repository cache for an existing instance.
     * If not found, it creates a new cached repository instance for the specified entity
     * using the data source, then caches it for future use.
     *
     * @param {DataSource} dataSource - TypeORM data source for database operations
     * @param {CacheService} cacheService - Service for managing cache operations
     * @param {RepositoryCacheService} repositoryCacheService - Service for caching repository instances
     * @returns {Promise<CachedRepository<T>>} A cached repository instance for the entity
     */
    useFactory: async (
      dataSource: DataSource,
      cacheService: CacheService,
      repositoryCacheService: RepositoryCacheService,
    ): Promise<CachedRepository<T>> => {
      // Create a unique entity name for the cached repository
      const entityName: string = ['cached', (entity as any).name || entity.toString()].join('_');

      // Step 1: Check if the repository instance is already cached
      const cachedRepositoryInstance: Nullable<CachedRepository<T>> = repositoryCacheService.get<T>(
        entityName,
      ) as Nullable<CachedRepository<T>>;

      // Step 2: Return cached instance if available
      if (!!cachedRepositoryInstance) {
        return cachedRepositoryInstance;
      }

      /**
       * Dynamic repository class created specifically for this entity.
       *
       * @description
       * Extends the CachedRepository to provide standard CRUD operations with caching
       * while using the provided data source.
       */
      class DynamicRepository extends CachedRepository<T> {
        /**
         * Initializes the dynamic repository with entity, data source, and caching capabilities.
         *
         * @description
         * Sets up the repository with the entity definition, data source,
         * cache service for data caching, and any custom caching options provided.
         */
        constructor() {
          super(entity, dataSource, cacheService, options);
        }
      }

      // Step 3: Create the cached repository instance
      const repositoryInstance: CachedRepository<T> = new DynamicRepository();

      // Step 4: Cache the repository instance for future requests
      repositoryCacheService.set<T>(entityName, repositoryInstance);

      return repositoryInstance;
    },
    // Dependencies to be injected into the factory function
    inject: [getDataSourceToken(), CacheService, RepositoryCacheService],
  };
}
