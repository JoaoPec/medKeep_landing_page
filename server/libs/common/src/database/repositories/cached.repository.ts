/**
 * @file cached-v2.repository.ts
 * @description Provides a caching layer for database repositories to improve performance
 * by storing frequently accessed data in a cache service.
 */

import { Optional } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectId,
  QueryRunner,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CacheableMethod } from '..';
import { CacheService } from '../../cache';
import { Either, Nullable, OneOrMany } from '../../interfaces';
import { canonicalize } from '../helpers';
import {
  BulkUpdateData,
  CachedRepositoryOptions,
  GetAsyncOptions,
  IEntity,
  InvalidateOptions,
  UpsertPayload,
} from '../interfaces';
import { BaseRepository } from './base.repository';

/**
 * CachedRepository extends BaseRepository to provide caching capabilities.
 * It intercepts database operations to store and retrieve results from cache,
 * reducing database load for frequently accessed data.
 *
 * @template T - The entity type this repository manages
 */
export abstract class CachedRepository<T extends IEntity> extends BaseRepository<T> {
  /**
   * Default caching options if none are provided
   * @property {string} keyPrefix - Prefix for all cache keys
   * @property {number} ttl - Time-to-live in seconds for cached items
   */
  private options: CachedRepositoryOptions = {
    keyPrefix: 'cache:repo',
    ttl: 60 * 60 * 1000, // 1 hour default cache duration
  };

  /**
   * Entity metadata for cache key generation
   */
  private readonly entityName: string;

  /**
   * Creates a new CachedRepository instance
   *
   * @param {EntityTarget<T>} entity - The entity class this repository manages
   * @param {DataSource} dataSource - TypeORM data source for database connections
   * @param {CacheService} cacheService - Service used to interact with the caching system
   * @param {CachedRepositoryOptions} options - Optional configuration for the cache behavior
   */
  constructor(
    entity: EntityTarget<T>,
    dataSource: DataSource,
    private readonly cacheService: CacheService,
    @Optional() private readonly customOptions?: Partial<CachedRepositoryOptions>,
  ) {
    super(entity, dataSource);

    // Initialize cache configuration
    this.entityName = this.metadata.name;

    // If provided, merge custom options with default options
    if (!!this.customOptions) {
      this.options = { ...this.options, ...this.customOptions };
    }
  }

  /**
   * Retrieves a single entity with caching support
   *
   * @param {Either<number, FindOptionsWhere<T>>} getEntityPayload - ID or conditions to find the entity
   * @param {Either<GetAsyncOptions, QueryRunner>} optionsOrQueryRunner - Query options or transaction context
   * @param {QueryRunner} queryRunner - Optional separate query runner
   * @returns {Promise<Nullable<T>>} The found entity or null if not found
   */
  public async getOneAsync(
    getEntityPayload: Either<number, FindOptionsWhere<T>>,
    optionsOrQueryRunner?: Either<GetAsyncOptions, QueryRunner>,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>> {
    // Bypass cache if we're in a transaction context or cache mode is Bypass
    if (queryRunner || (!!optionsOrQueryRunner && 'manager' in optionsOrQueryRunner)) {
      return super.getOneAsync(getEntityPayload, optionsOrQueryRunner, queryRunner);
    }

    // Generate a unique cache key for this query
    const cacheKey: string = this.generateCacheKey(
      'getOneAsync',
      getEntityPayload,
      optionsOrQueryRunner as GetAsyncOptions,
    );

    // Try to get from cache first
    let cachedResult: Nullable<T> = await this.cacheService.get<Nullable<T>>(cacheKey, {
      withExcluded: true,
    });

    // Transform cached result if available
    if (cachedResult !== null) {
      cachedResult = this.transformEntity(cachedResult);

      return cachedResult;
    }

    // Get from database if not in cache
    const result: Nullable<T> = await super.getOneAsync(
      getEntityPayload,
      optionsOrQueryRunner,
      queryRunner,
    );

    // Cache the result (including null results)
    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Retrieves multiple entities with caching support
   *
   * @param {Either<Array<bigint>, Array<FindOptionsWhere<T>>>} getEntityPayload - IDs or conditions to find entities
   * @param {Either<GetAsyncOptions, QueryRunner>} optionsOrQueryRunner - Query options or transaction context
   * @param {QueryRunner} queryRunner - Optional separate query runner
   * @returns {Promise<Array<T>>} Array of found entities
   */
  public async getManyAsync(
    getEntityPayload: Either<Array<bigint>, Array<FindOptionsWhere<T>>>,
    optionsOrQueryRunner?: Either<GetAsyncOptions, QueryRunner>,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>> {
    // Bypass cache if we're in a transaction context or cache mode is Bypass
    if (queryRunner || (!!optionsOrQueryRunner && 'manager' in optionsOrQueryRunner)) {
      return super.getManyAsync(getEntityPayload, optionsOrQueryRunner, queryRunner);
    }

    // Generate a unique cache key for this query
    const cacheKey: string = this.generateCacheKey(
      'getManyAsync',
      getEntityPayload,
      optionsOrQueryRunner,
    );

    // Try to get from cache first
    let cachedResult: Array<T> = await this.cacheService.get<Array<T>>(cacheKey, {
      withExcluded: true,
    });

    // Transform cached results if available
    if (cachedResult !== null) {
      cachedResult = cachedResult.map((entity) => this.transformEntity(entity));
      return cachedResult;
    }

    // Get from database if not in cache
    const result: Array<T> = await super.getManyAsync(
      getEntityPayload,
      optionsOrQueryRunner,
      queryRunner,
    );

    // Cache the result
    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Counts entities matching the given criteria with caching support
   *
   * @param {FindManyOptions<T>} options - Options to filter which entities to count
   * @param {QueryRunner} queryRunner - Optional transaction context
   * @returns {Promise<number>} The count of matching entities
   */
  public async countAsync(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    // Bypass cache if we're in a transaction context or cache mode is Bypass
    if (!!queryRunner) {
      return super.countAsync(options, queryRunner);
    }

    // Generate a unique cache key for this query
    const cacheKey: string = this.generateCacheKey('countAsync', options);

    // Try to get from cache first
    const cachedResult: number = await this.cacheService.get<number>(cacheKey, {
      withExcluded: true,
    });

    // Return cached result if available
    if (cachedResult !== null) {
      return cachedResult;
    }

    // Get from database if not in cache
    const result: number = await super.countAsync(options, queryRunner);

    // Cache the result
    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Performs a bulk update operation and invalidates related cache entries
   *
   * @param {BulkUpdateData<T>} updateData - Bulk update operations to perform
   * @param {QueryRunner} queryRunner - Optional transaction context
   * @returns {Promise<number>} Number of affected rows
   */
  public async updateMany(
    updateData: BulkUpdateData<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    // Perform the update operation
    const result: number = await super.updateMany(updateData, queryRunner);

    await this.invalidate('*');

    return result;
  }

  /**
   * Retrieves a single entity with caching support
   *
   * @param {FindOneOptions<T>} options - Options to filter which entity to find
   * @param {QueryRunner} queryRunner - Optional transaction context
   * @returns {Promise<Nullable<T>>} The found entity or null if not found
   */
  public async findOne(
    options?: FindOneOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>> {
    // Bypass cache if a QueryRunner is provided or cache mode is Bypass
    if (!!queryRunner) {
      return queryRunner
        ? queryRunner.manager.findOne<T>(this.metadata.target as any, options)
        : super.findOne(options);
    }

    // Generate a unique cache key based on method name and options
    const cacheKey: string = this.generateCacheKey('findOne', options);

    // Attempt to retrieve from cache
    let cachedResult: Nullable<T> = await this.cacheService.get<Nullable<T>>(cacheKey, {
      withExcluded: true,
    });

    if (cachedResult !== null) {
      cachedResult = this.transformEntity(cachedResult);
      return cachedResult;
    }

    // If not in cache, retrieve from the database
    const result: Nullable<T> = await super.findOne(options);

    // Cache the result (including null), unless in ReadOnly or Bypass mode
    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Retrieves multiple entities using TypeORM's find, with caching support.
   *
   * @param options Optional find options.
   * @param queryRunner Optional QueryRunner for transactional queries.
   * @returns A promise resolving to an array of found entities.
   */
  public async find(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<Array<T>> {
    // Bypass cache if a QueryRunner is provided or cache mode is Bypass
    if (!!queryRunner) {
      return queryRunner
        ? queryRunner.manager.find<T>(this.metadata.target as any, options)
        : super.find(options);
    }

    // Generate a unique cache key for the find method
    const cacheKey: string = this.generateCacheKey('find', options);

    // Attempt to retrieve from cache
    let cachedResult: Array<T> = await this.cacheService.get<Array<T>>(cacheKey, {
      withExcluded: true,
    });

    if (cachedResult !== null) {
      cachedResult = cachedResult.map((entity) => this.transformEntity(entity));
      return cachedResult;
    }

    // Otherwise, perform the database query
    const result: Array<T> = await super.find(options);

    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Saves a single entity and invalidates cache
   * @param {T} entity - Entity to save
   * @param {Either<SaveOptions, QueryRunner>} optionsOrQueryRunner - Save options or query runner
   * @returns {Promise<T>} The saved entity
   */
  public async save(entity: T, optionsOrQueryRunner?: Either<SaveOptions, QueryRunner>): Promise<T>;

  /**
   * Saves multiple entities and invalidates cache
   * @param {Array<T>} entities - Entities to save
   * @param {Either<SaveOptions, QueryRunner>} optionsOrQueryRunner - Save options or query runner
   * @returns {Promise<Array<T>>} The saved entities
   */
  public async save(
    entities: Array<T>,
    optionsOrQueryRunner?: Either<SaveOptions, QueryRunner>,
  ): Promise<Array<T>>;

  /**
   * Implementation of save method that handles both single and multiple entities
   *
   * @param {OneOrMany<T>} entityOrEntities - One or more entities to save
   * @param {Either<SaveOptions, QueryRunner>} optionsOrQueryRunner - Save options or query runner
   * @returns {Promise<OneOrMany<T>>} The saved entity or entities
   */
  public async save(
    entityOrEntities: OneOrMany<T>,
    optionsOrQueryRunner?: Either<SaveOptions, QueryRunner>,
  ): Promise<OneOrMany<T>> {
    // Initialize variables
    let queryRunner: Nullable<QueryRunner> = undefined;
    let sanitizedOptions: Nullable<SaveOptions> = undefined;

    // Extract query runner if provided in options
    if (!!optionsOrQueryRunner && 'manager' in optionsOrQueryRunner) {
      queryRunner = optionsOrQueryRunner as QueryRunner;
    } else {
      sanitizedOptions = optionsOrQueryRunner as SaveOptions;
    }

    // Save the entity or entities
    let saved: OneOrMany<T>;

    // Use the appropriate save method based on context
    if (queryRunner) {
      saved = await queryRunner.manager.save(entityOrEntities as any, sanitizedOptions);
    } else {
      saved = await super.save(entityOrEntities as any, sanitizedOptions);
    }

    await this.invalidate('*');

    return saved;
  }

  /**
   * Updates entities matching criteria with partial entity data
   *
   * @param {string | number | bigint | FindOptionsWhere<T>} criteria - Conditions to match entities for update
   * @param {QueryDeepPartialEntity<T>} partialEntity - The properties to update
   * @returns {Promise<UpdateResult>} Result of the update operation
   */
  public async update(
    criteria: string | number | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;

  /**
   * Updates entities matching criteria with partial entity data
   *
   * @param {string | number | FindOptionsWhere<T>} criteria - Conditions to match entities for update
   * @param {QueryDeepPartialEntity<T>} partialEntity - The properties to update
   * @returns {Promise<UpdateResult>} Result of the update operation
   */
  public async update(
    criteria: string | number | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult>;

  /**
   * Updates entities matching criteria with partial entity data, with optional transaction support
   *
   * @param {string | number | FindOptionsWhere<T>} criteria - Conditions to match entities for update
   * @param {QueryDeepPartialEntity<T>} partialEntity - The properties to update
   * @param {QueryRunner} queryRunner - Optional transaction context
   * @returns {Promise<UpdateResult>} Result of the update operation
   */
  public async update(
    criteria: string | number | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult> {
    let updateResult: UpdateResult;

    // Use the appropriate update method based on context
    if (!!queryRunner) {
      // Use the provided QueryRunner for update and retrieval
      updateResult = await queryRunner.manager.update<T>(
        this.metadata.target as any,
        criteria,
        partialEntity,
      );
    } else {
      // Otherwise, use the base repository methods
      updateResult = await super.update(criteria, partialEntity);
    }

    await this.invalidate('*');

    return updateResult;
  }

  /**
   * Finds entities and counts total matches with caching support
   *
   * @param {FindManyOptions<T>} options - Options to filter entities
   * @param {QueryRunner} queryRunner - Optional transaction context
   * @returns {Promise<[Array<T>, number]>} Array of entities and total count
   */
  public async findAndCount(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<[Array<T>, number]> {
    // Bypass cache if we're in a transaction context
    if (!!queryRunner) {
      return await queryRunner.manager.findAndCount<T>(this.metadata.target as any, options);
    }

    // Generate a unique cache key for this query
    const cacheKey: string = this.generateCacheKey('findAndCount', options);

    // Try to retrieve from cache first
    let cachedResult: [Array<T>, number] = await this.cacheService.get<[Array<T>, number]>(
      cacheKey,
      {
        withExcluded: true,
      },
    );

    // Return cached result if available
    if (cachedResult !== null) {
      cachedResult = [
        cachedResult[0].map((entity) => this.transformEntity(entity)),
        cachedResult[1],
      ];
      return cachedResult;
    }
    // If not in cache, fetch from database
    const result: [Array<T>, number] = await super.findAndCount(options);

    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Counts entities matching the given criteria with caching support
   *
   * @param {FindManyOptions<T>} options - Options to filter which entities to count
   * @param {QueryRunner} queryRunner - Optional transaction context
   * @returns {Promise<number>} The count of matching entities
   */
  public async count(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<number> {
    // Bypass cache if we're in a transaction context
    if (!!queryRunner) {
      return await queryRunner.manager.count<T>(this.metadata.target as any, options);
    }

    // Generate a unique cache key for this query
    const cacheKey: string = this.generateCacheKey('count', options);

    // Try to retrieve the count from cache
    const cachedResult: number = await this.cacheService.get<number>(cacheKey, {
      withExcluded: true,
    });

    if (cachedResult !== null) {
      return cachedResult;
    }

    // Otherwise, perform the count operation on the database
    const result: number = await super.count(options);

    await this.cacheService.set(cacheKey, result, {
      ttl: this.options.ttl,
      withExcluded: true,
    });

    return result;
  }

  /**
   * Overrides the base insertOrUpdate method to provide cache invalidation
   * @description Performs an atomic INSERT ... ON CONFLICT DO UPDATE operation in PostgreSQL
   * with automatic cache invalidation after the operation completes. This ensures
   * that any cached data is refreshed after modifications.
   *
   * The operation follows these steps:
   * 1. Executes the upsert operation from the base repository
   * 2. Invalidates all cache entries for this entity type
   * 3. Returns the upsert operation result
   *
   * @param {OneOrMany<QueryDeepPartialEntity<T>>} items - Single entity or array of entities to upsert
   * @param {UpsertPayload<T>} payload - Configuration for the upsert operation containing:
   *   - conflictKeys: Array of property names to check for conflicts
   *   - upsertUpdateOperations: Defines how to update each field on conflict
   * @param {QueryRunner} [queryRunner] - Optional TypeORM QueryRunner for transaction support
   * @returns {Promise<InsertResult>} Result containing inserted/updated record information
   */
  public async insertOrUpdate(
    items: OneOrMany<QueryDeepPartialEntity<T>>,
    payload: UpsertPayload<T>,
    queryRunner?: QueryRunner,
  ): Promise<InsertResult> {
    // Execute base upsert operation
    const result: InsertResult = await super.insertOrUpdate(items, payload, queryRunner);

    await this.invalidate('*');

    return result;
  }

  /**
   * Overrides the base delete method to provide cache invalidation
   * @description Performs a delete operation with automatic cache invalidation.
   * This ensures that any cached data is refreshed after the deletion.
   *
   * The operation follows these steps:
   * 1. Executes the delete operation from the base repository
   * 2. Invalidates all cache entries for this entity type
   * 3. Returns the delete operation result
   *
   * @param {string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<T>} criteria - Conditions to match entities to delete
   * @param {QueryRunner} [queryRunner] - Optional TypeORM QueryRunner for transaction support
   * @returns {Promise<DeleteResult>} Result containing information about the deleted records
   */
  /**
   * Overrides the base delete method to provide cache invalidation
   *
   * @json
   * {
   *   "method": "delete",
   *   "description": "Performs a delete operation with intelligent cache invalidation",
   *   "parameters": [
   *     {
   *       "name": "criteria",
   *       "type": "string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<T>",
   *       "description": "Conditions to match entities for deletion"
   *     },
   *     {
   *       "name": "queryRunner",
   *       "type": "QueryRunner",
   *       "optional": true,
   *       "description": "Optional TypeORM QueryRunner for transaction support"
   *     }
   *   ],
   *   "returns": {
   *     "type": "Promise<DeleteResult>",
   *     "description": "Result containing information about the deleted records"
   *   },
   *   "examples": [
   *     "await repository.delete(123) // Delete by ID with targeted cache invalidation",
   *     "await repository.delete(['abc', 'def']) // Delete multiple IDs with targeted invalidation",
   *     "await repository.delete({ status: 'inactive' }) // Delete by criteria with full cache invalidation"
   *   ]
   * }
   *
   * @description Performs a delete operation with smart cache invalidation strategy.
   * This method intelligently determines the appropriate cache invalidation approach:
   * 1. For single ID or array of IDs: Uses targeted invalidation of specific entity cache entries
   * 2. For complex criteria: Invalidates all cache entries for the entity type
   *
   * The operation follows these steps:
   * 1. Executes the delete operation using the appropriate context (transaction or regular)
   * 2. If records were affected, applies the optimal cache invalidation strategy
   * 3. Returns the delete operation result
   *
   * @param {string | Array<string> | bigint | Array<bigint> | number | Array<number> | Date | Array<Date> | ObjectId | Array<ObjectId> | FindOptionsWhere<T>} criteria - Conditions to match entities to delete
   * @param {QueryRunner} [queryRunner] - Optional TypeORM QueryRunner for transaction support
   * @returns {Promise<DeleteResult>} Result containing information about the deleted records
   */
  public async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<DeleteResult> {
    // Execute base delete operation
    let result: DeleteResult;

    if (queryRunner) {
      result = await queryRunner.manager.delete(this.target, criteria);
    } else {
      result = await super.delete(
        criteria as
          | string
          | Array<string>
          | number
          | Array<number>
          | Date
          | Array<Date>
          | ObjectId
          | Array<ObjectId>
          | FindOptionsWhere<T>,
      );
    }

    // Invalidate all cache entries for this entity type
    await this.invalidate('*');

    return result;
  }

  /**
   * Overrides the base insert method to provide cache invalidation
   * @description Performs an insert operation with automatic cache invalidation.
   * This ensures that any cached data is refreshed after the insertion.
   *
   * The operation follows these steps:
   * 1. Executes the insert operation from the base repository
   * 2. Invalidates all cache entries for this entity type
   * 3. Returns the insert operation result
   *
   * @param {QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]} entity - Single entity or array of entities to insert
   * @param {QueryRunner} [queryRunner] - Optional TypeORM QueryRunner for transaction support
   * @returns {Promise<InsertResult>} Result containing inserted record information
   */
  public async insert(
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    queryRunner?: QueryRunner,
  ): Promise<InsertResult> {
    // Execute the insert operation
    let result: InsertResult;

    if (queryRunner) {
      result = await queryRunner.manager.insert(this.target, entity);
    } else {
      result = await super.insert(entity);
    }

    await this.invalidate('*');

    return result;
  }

  /**
   * Generates a unique cache key for a specific method call
   *
   * @param {string} method - The repository method being called
   * @param {any} payload - The primary parameters passed to the method
   * @param {any} options - Optional secondary parameters
   * @returns {string} A unique cache key
   */
  private generateCacheKey(method: string, payload: any, options?: any): string {
    // Convert complex objects to canonical string representations
    const canonicalPayload: string = canonicalize(payload);
    const canonicalOptions: string = !!options ? canonicalize(options) : '';

    // Combine components into a unique key
    return `${this.options.keyPrefix}:${this.entityName}:${method}:${canonicalPayload}:${canonicalOptions}`;
  }

  /**
   * Invalidates all cache entries for this entity type
   *
   * @returns {Promise<void>}
   */
  /**
   * Invalidates all cache entries for this entity type
   * @param {InvalidateOptions} options - Configuration for selective cache invalidation
   * @returns {Promise<void>}
   */
  public async invalidate(options: Either<InvalidateOptions, '*'> = '*'): Promise<void> {
    const dropAll: boolean = !!options && options === '*';

    if (dropAll === true) {
      // If no exclusions, invalidate all cache entries for this entity
      const pattern: string = `${this.options.keyPrefix}:${this.entityName}:*`;
      await this.cacheService.del(pattern);
      return;
    }

    // Get the invalidate options
    const invalidateOptions: InvalidateOptions = options as InvalidateOptions;

    // Invalidate each method pattern
    const invalidateMethodPatterns: Array<string> = invalidateOptions.methods.map(
      (method: CacheableMethod) => `${this.options.keyPrefix}:${this.entityName}:${method}:*`,
    );

    // Delete the method patterns
    await this.cacheService.del(invalidateMethodPatterns);
  }

  /**
   * Transforms a cached entity into a proper TypeORM entity instance
   * @description Uses TypeORM's create method to properly instantiate entity from cache data
   *
   * @param {T} entity - The cached entity data to transform
   * @returns {T} A proper TypeORM entity instance with all properties and methods
   */
  protected transformEntity(entity: T): T {
    // If entity is null, return null
    if (!entity) {
      return entity;
    }

    // Use TypeORM's create method to transform plain object into entity instance
    return this.manager.create(this.target, entity);
  }
}
