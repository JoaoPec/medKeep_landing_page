import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  InsertResult,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationDto } from '../../dto';
import { Either, Nullable, OneOrMany } from '../../interfaces';
import { PaginationParamsQuery } from '../../validation';
import {
  BulkUpdateData,
  GetAsyncOptions,
  IAnyAsyncRepository,
  ICountAsyncRepository,
  IEntity,
  IGetManyAsyncRepository,
  IGetOneAsyncRepository,
  IUpdateManyRepository,
  IUpsertRepository,
  UpsertPayload,
} from '../interfaces';
import {
  AnyAsyncUseCase,
  CountAsyncUseCase,
  GetAsyncUseCase,
  UpdateManyUseCase,
  UpsertUseCase,
} from '../use-cases';

export abstract class BaseRepository<T extends IEntity>
  extends Repository<T>
  implements
    IGetOneAsyncRepository<T>,
    IGetManyAsyncRepository<T>,
    IUpdateManyRepository<T>,
    ICountAsyncRepository<T>,
    IAnyAsyncRepository<T>,
    IUpsertRepository<T>
{
  private readonly getAsyncUseCase: GetAsyncUseCase<T>;
  private readonly updateManyUseCase: UpdateManyUseCase<T>;
  private readonly countAsyncUseCase: CountAsyncUseCase<T>;
  private readonly anyAsyncUseCase: AnyAsyncUseCase<T>;
  private readonly upsertUseCase: UpsertUseCase<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());

    this.getAsyncUseCase = new GetAsyncUseCase<T>(this);
    this.updateManyUseCase = new UpdateManyUseCase(this);
    this.countAsyncUseCase = new CountAsyncUseCase(this);
    this.anyAsyncUseCase = new AnyAsyncUseCase(this);
    this.upsertUseCase = new UpsertUseCase(this);
  }

  /**
   * Get a single entity based on various payloads and optional relations.
   * @param getEntityPayload - Either an ID, or a set of filters
   * @param optionsOrQueryRunner - Either GetAsyncOptions or QueryRunner.
   * @param queryRunner - Optional QueryRunner if optionsOrQueryRunner is GetAsyncOptions.
   * @returns A single entity or null.
   */
  public async getOneAsync(
    getEntityPayload: Either<number, FindOptionsWhere<T>>,
    optionsOrQueryRunner?: Either<GetAsyncOptions, QueryRunner>,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>> {
    return await this.getAsyncUseCase.execute(
      getEntityPayload as FindOptionsWhere<T>,
      optionsOrQueryRunner as GetAsyncOptions,
      queryRunner,
    );
  }

  /**
   * Get a single entity based on various payloads and optional relations.
   * @param getEntityPayload - Either an ID, or a set of filters
   * @param optionsOrQueryRunner - Either GetAsyncOptions or QueryRunner.
   * @param queryRunner - Optional QueryRunner if optionsOrQueryRunner is GetAsyncOptions.
   * @returns An array of entities.
   */
  public async getManyAsync(
    getEntityPayload: Either<Array<bigint>, Array<FindOptionsWhere<T>>>,
    optionsOrQueryRunner?: Either<GetAsyncOptions, QueryRunner>,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>> {
    return await this.getAsyncUseCase.execute(
      getEntityPayload as Array<FindOptionsWhere<T>>,
      optionsOrQueryRunner as GetAsyncOptions,
      queryRunner,
    );
  }

  /**
   * Performs a bulk update on multiple entities based on provided filters and update data.
   *
   * This method constructs a single SQL `UPDATE` statement with `CASE` expressions
   * to efficiently update multiple records in the database based on custom filters.
   * It supports both setting new values and incrementing existing values for specified fields.
   * If the entity has a `version` column, it automatically increments it by 1 for each updated record.
   *
   * @param {BulkUpdateData<T>} updateData - An array of update operations where each object contains:
   *   - `filter` (Partial<T>): The conditions to identify records to update.
   *   - `update` (UpdateOperation<T>): The fields to be updated, supporting set, increment and decrement operations.
   *     - For set operations, provide the new value directly (e.g., `{ status: 'active' }`).
   *     - For increment operations, use an object with an `increment` key (e.g., `{ balance: { increment: 50 } }`).
   *     - For decrement operations, use an object with an `decrement` key (e.g., `{ balance: { decrement: 50 } }`).
   * @param {QueryRunner} [queryRunner] - Optional. An instance of TypeORM's `QueryRunner` to manage transactions.
   *   If provided, the update operation will be executed within the context of the given `QueryRunner`, allowing for transactional control.
   *
   * @returns {Promise<number>} - A promise that resolves to the number of rows affected by the update.
   * ```
   */
  public async updateMany(
    updateData: BulkUpdateData<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    return await this.updateManyUseCase.execute(updateData, queryRunner);
  }

  /**
   * Counts the number of entities based on provided options.
   *
   * @param {FindManyOptions<T>} [options] - Options to filter which entities to count.
   * @param {QueryRunner} [queryRunner] - Optional QueryRunner for transactional operations.
   * @returns {Promise<number>} - The count of entities matching the criteria.
   *
   * @example
   * ```typescript
   * const activeUserCount = await baseRepository.count({ where: { status: 'active' } });
   * console.log(`There are ${activeUserCount} active users.`);
   * ```
   */
  public async countAsync(
    options?: FindManyOptions<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    return await this.countAsyncUseCase.execute(options, queryRunner);
  }

  /**
   * Determines if any entity matching the given options exists.
   *
   * @param {FindManyOptions<T>} [options] - Conditions to match entities.
   * @param {QueryRunner} [queryRunner] - Optional transaction context.
   * @returns {Promise<boolean>} - True if any entity exists, false otherwise.
   */
  public async anyAsync(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<boolean> {
    return await this.anyAsyncUseCase.execute(options, queryRunner);
  }

  /**
   * Upserts (inserts or updates) one or multiple records into the database
   * @description Performs an atomic INSERT ... ON CONFLICT DO UPDATE operation in PostgreSQL.
   * The operation will:
   * 1. Attempt to insert the record(s)
   * 2. If a conflict occurs on the specified conflictKeys:
   *    - For simple updates: Sets the column to the new value
   *    - For increments: Adds the new value to existing value
   *    - For decrements: Subtracts the new value from existing value
   *    - For JSONB fields: Updates using jsonb_set while preserving structure
   * 3. If no conflict, performs a normal insert
   *
   * @param {OneOrMany<QueryDeepPartialEntity<T>>} items - Single entity or array of entities to upsert
   * @param {UpsertPayload<T>} payload - Configuration for the upsert operation containing:
   *   - conflictKeys: Array of property names to check for conflicts
   *     Example: ['email'] for single key or ['userId', 'coinId'] for composite key
   *   - upsertUpdateOperations: Defines how to update each field on conflict:
   *     - Simple update: { fieldName: true }
   *     - Increment: { fieldName: { increment: true } }
   *     - Decrement: { fieldName: { decrement: true } }
   *   - returnEntities: Optional boolean to return the inserted/updated entities
   *   - jsonbStrategy: Optional strategies for handling JSONB columns:
   *     - 'multiKey': Merges each key in the JSONB object separately
   *     - 'singleValue': Updates only the 'value' field
   *     - 'none': No special handling, direct replacement
   * @param {QueryRunner} [queryRunner] - Optional TypeORM QueryRunner for transaction support
   * @returns {Promise<InsertResult>} Result containing inserted/updated record information
   *
   * @example
   * // Simple upsert - Update name if email exists
   * await repository.insertOrUpdate(
   *   { email: 'user@example.com', name: 'John' },
   *   {
   *     conflictKeys: ['email'],
   *     upsertUpdateOperations: { name: true }
   *   }
   * );
   *
   * @example
   * // Increment balance if user and coin combination exists
   * await repository.insertOrUpdate(
   *   { userId: 1, coinId: 'BTC', balance: 100 },
   *   {
   *     conflictKeys: ['userId', 'coinId'],
   *     upsertUpdateOperations: {
   *       balance: { increment: true }  // Will add 100 to existing balance
   *     }
   *   }
   * );
   *
   * @example
   * // Multiple operations - Update some fields, increment others
   * await repository.insertOrUpdate(
   *   { userId: 1, coinId: 'BTC', balance: 100, lastUpdated: new Date() },
   *   {
   *     conflictKeys: ['userId', 'coinId'],
   *     upsertUpdateOperations: {
   *       balance: { increment: true },  // Increment balance
   *       lastUpdated: true  // Simply update to new value
   *     },
   *     jsonbStrategy: {
   *       balance: 'multiKey'  // Handle balance as multi-key JSONB
   *     }
   *   }
   * );
   */
  public async insertOrUpdate(
    items: OneOrMany<QueryDeepPartialEntity<T>>,
    payload: UpsertPayload<T>,
    queryRunner?: QueryRunner,
  ): Promise<InsertResult> {
    return await this.upsertUseCase.execute(items, payload, queryRunner);
  }

  async paginateWithFilters(
    query: PaginationParamsQuery,
    filters: Partial<Record<Extract<keyof T, string>, any>>,
  ): Promise<PaginationDto<T>> {
    const alias: string = 'entity';
    const queryBuilder: SelectQueryBuilder<T> = this.createQueryBuilder(alias);

    if (filters) {
      for (const [key, value] of Object.entries(filters) as [string, any][]) {
        if (!value) {
          continue;
        }

        const columnMetadata = this.metadata.findColumnWithPropertyName(key);

        if (!columnMetadata) {
          continue;
        }

        const isStringColumn =
          typeof columnMetadata.type === 'function'
            ? columnMetadata.type === String
            : ['varchar', 'text', 'character varying'].includes(
                columnMetadata.type.toString().toLowerCase(),
              );

        if (isStringColumn) {
          queryBuilder.orWhere(`${alias}.${columnMetadata.propertyPath} ILIKE :${key}`, {
            [key]: `${value?.toLowerCase()}%`,
          });
        } else {
          queryBuilder.orWhere(`${alias}.${columnMetadata.propertyPath} = :${key}`, {
            [key]: value,
          });
        }
      }
    }

    queryBuilder.take(query.limit);
    queryBuilder.skip(query.skip);

    const [items, count] = await queryBuilder.getManyAndCount();

    return new PaginationDto(items, {
      count,
      paginationQueryDto: query,
    });
  }
}
