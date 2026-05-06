import { InsertResult, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { OneOrMany } from '../../interfaces';
import { UpsertPayload } from './upsert-payload.interface';

/**
 * Interface defining a use case for upserting (insert or update) database records
 * @interface IUpsertUseCase
 * @description Provides functionality to upsert one or many records into the database
 * @template T - The entity type being upserted
 */
export interface IUpsertUseCase<T> {
  /**
   * Executes the upsert operation for one or multiple records
   * @param {OneOrMany<QueryDeepPartialEntity<T>>} items - Single item or array of items to upsert
   * @param {UpsertPayload<T>} payload - Configuration for the upsert operation
   * @param {QueryRunner} [queryRunner] - Optional TypeORM query runner for transaction support
   * @returns {Promise<InsertResult>} Result of the upsert operation
   */
  execute(
    items: OneOrMany<QueryDeepPartialEntity<T>>,
    payload: UpsertPayload<T>,
    queryRunner?: QueryRunner,
  ): Promise<InsertResult>;
}
