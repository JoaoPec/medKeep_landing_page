import { InsertResult, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { OneOrMany } from '../../interfaces';
import { UpsertPayload } from './upsert-payload.interface';

/**
 * Interface defining repository operations for upserting (insert or update) database records
 * @interface IUpsertRepository
 * @description Provides functionality to upsert one or many records into the database
 * @template T - The entity type being upserted
 */
export interface IUpsertRepository<T> {
  /**
   * Upserts one or multiple records into the database
   * @param {OneOrMany<QueryDeepPartialEntity<T>>} items - Single item or array of items to upsert
   * @param {UpsertPayload<T>} payload - Configuration for the upsert operation including conflict keys and update operations
   * @param {QueryRunner} [queryRunner] - Optional TypeORM query runner for transaction support
   * @returns {Promise<InsertResult>} Result of the upsert operation containing inserted/updated IDs
   */
  insertOrUpdate(
    items: OneOrMany<QueryDeepPartialEntity<T>>,
    payload: UpsertPayload<T>,
    queryRunner?: QueryRunner,
  ): Promise<InsertResult>;
}
