import { Provider } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { Either, Nullable } from '../../interfaces';
import { getRepositoryToken } from '../helpers';
import { IEntity } from '../interfaces';
import { BaseRepository, CachedRepository } from '../repositories';
import { RepositoryCacheService } from '../services';

/**
 * Creates a repository provider for applications.
 *
 * @description
 * Generates a provider that creates repository instances with proper
 * request scoping to ensure isolation. The factory handles repository caching
 * to improve performance by reusing existing repository instances when possible.
 *
 * @template T - The entity type for which to create a repository
 * @param {EntityTarget<T>} entity - The entity class for which to create a repository
 * @returns {Provider} A NestJS provider configuration for the repository
 *
 * @example
 * ```typescript
 * // In a module's providers array:
 * providers: [
 *   createRepositoryFactory(User),
 *   createRepositoryFactory(Product)
 * ]
 * ```
 */
export function createRepositoryFactory<T extends IEntity>(entity: EntityTarget<T>): Provider {
  return {
    provide: getRepositoryToken(entity),
    /**
     * Factory function that creates or retrieves a repository instance.
     *
     * @description
     * This factory first checks the repository cache for an existing instance.
     * If not found, it creates a new repository instance for the specified entity
     * using the data source, then caches it for future use.
     *
     * @param {DataSource} dataSource - TypeORM data source for database operations
     * @param {RepositoryCacheService} repositoryCacheService - Service for caching repository instances
     * @returns {Promise<BaseRepository<T>>} A repository instance for the entity
     */
    useFactory: async (
      dataSource: DataSource,
      repositoryCacheService: RepositoryCacheService,
    ): Promise<BaseRepository<T>> => {
      // Create a unique entity name for the cached repository
      const entityName: string = ['repo', (entity as any).name || entity.toString()].join('_');

      // Step 1: Check if the repository instance is already cached
      const cachedRepositoryInstance: Nullable<Either<BaseRepository<T>, CachedRepository<T>>> =
        repositoryCacheService.get<T>(entityName);

      // Step 2: Return cached instance if available
      if (!!cachedRepositoryInstance) {
        return cachedRepositoryInstance;
      }

      /**
       * Dynamic repository class created specifically for this entity.
       *
       * @description
       * Extends the BaseRepository to provide standard CRUD operations
       * while using the provided data source.
       */
      class DynamicRepository extends BaseRepository<T> {
        constructor() {
          super(entity, dataSource);
        }
      }

      // Step 3: Create the repository instance
      const repositoryInstance: BaseRepository<T> = new DynamicRepository();

      // Step 4: Cache the repository instance for future requests
      repositoryCacheService.set<T>(entityName, repositoryInstance);

      return repositoryInstance;
    },
    // Dependencies to be injected into the factory function
    inject: [DataSource, RepositoryCacheService],
  };
}
