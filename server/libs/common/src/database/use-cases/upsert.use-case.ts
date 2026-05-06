import {
  EntityManager,
  InsertQueryBuilder,
  InsertResult,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { OneOrMany } from '../../interfaces';
import { createOnConflictClause } from '../helpers';
import { UpsertPayload } from '../interfaces';
import { IUpsertUseCase } from '../interfaces/upsert.use-case.interface';

/**
 * Generic use case class for handling database upsert operations
 * @class UpsertUseCase<T>
 * @template T - The entity type for the upsert operation
 * @implements {IUpsertUseCase<T>}
 * @description Provides functionality to insert or update records in a single atomic operation
 */
export class UpsertUseCase<T> implements IUpsertUseCase<T> {
  /**
   * Creates a new UpsertUseCase instance
   * @constructor
   * @param {Repository<T>} repository - TypeORM repository instance for entity operations
   * @description Initializes the use case with a repository for database operations
   */
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Performs an upsert operation for one or multiple records
   * @method execute
   * @async
   * @param {OneOrMany<QueryDeepPartialEntity<T>>} items - Single item or array of items to upsert
   * @param {UpsertPayload<T>} payload - Configuration object containing conflict columns and update fields
   * @param {QueryRunner} [queryRunner] - Optional query runner for transaction support
   * @returns {Promise<InsertResult>} Result containing inserted/updated record information
   * @description
   * Executes an atomic upsert operation with the following steps:
   * 1. Validates and normalizes input items to array format
   * 2. Returns early with empty result if no items provided
   * 3. Determines appropriate entity manager (transaction or default)
   * 4. Generates ON CONFLICT clause for upsert handling
   * 5. Constructs and executes the upsert query
   */
  public async execute(
    items: OneOrMany<QueryDeepPartialEntity<T>>,
    payload: UpsertPayload<T>,
    queryRunner?: QueryRunner,
  ): Promise<InsertResult> {
    // Convert input to array format for consistent handling
    const records: QueryDeepPartialEntity<T>[] = Array.isArray(items) ? items : [items];

    // Return empty result if no records to process
    if (records.length === 0) {
      return {
        raw: [],
        identifiers: [],
        generatedMaps: [],
      };
    }

    // Use transaction manager if provided, otherwise use repository's manager
    const manager: EntityManager = queryRunner?.manager ?? this.repository.manager;

    // Generate the conflict handling clause based on payload configuration
    const onConflictClause: string = createOnConflictClause(this.repository, payload);

    /**
     * Build and execute the upsert query using TypeORM query builder
     * @step 1 Create insert query builder with target entity and records
     * @step 2 Add ON CONFLICT clause for handling duplicates
     * @step 3 Execute query with or without returning results based on payload config
     */
    const insertQueryBuilder: InsertQueryBuilder<ObjectLiteral> = manager
      .createQueryBuilder()
      .insert()
      .into(this.repository.metadata.target)
      .values(records)
      .onConflict(onConflictClause);

    let result: InsertResult;

    // Return all columns if returnEntities is true
    if (payload.returnEntities) {
      result = await insertQueryBuilder.returning('*').execute();
    } else {
      // Execute without returning data for better performance
      result = await insertQueryBuilder.execute();
    }

    return result;
  }
}
