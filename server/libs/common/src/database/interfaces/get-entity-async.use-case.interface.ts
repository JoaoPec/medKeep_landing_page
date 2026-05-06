import { FindOptionsWhere, QueryRunner } from 'typeorm';
import { Nullable } from '../../interfaces';
import { GetAsyncOptions } from './get-entity-async-options.interface';

/**
 * Interface for asynchronous entity retrieval use cases
 * @interface IGetAsyncUseCase
 * @description
 * Defines a contract for use cases that retrieve entities asynchronously from a data source.
 * Supports various overloaded methods for fetching single or multiple entities using different
 * types of query parameters and options.
 * @template T - The entity type to be retrieved
 */
export interface IGetAsyncUseCase<T> {
  /**
   * Retrieves a single entity by its numeric ID
   * @param getEntityPayload - The numeric ID of the entity to retrieve
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to the entity or null if not found
   */
  execute(getEntityPayload: number, queryRunner?: QueryRunner): Promise<Nullable<T>>;

  /**
   * Retrieves a single entity by its numeric ID with additional options
   * @param getEntityPayload - The numeric ID of the entity to retrieve
   * @param options - Additional options for the query
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to the entity or null if not found
   */
  execute(
    getEntityPayload: number,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>>;

  /**
   * Retrieves a single entity using TypeORM where conditions
   * @param getEntityPayload - The where conditions to filter by
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to the entity or null if not found
   */
  execute(getEntityPayload: FindOptionsWhere<T>, queryRunner?: QueryRunner): Promise<Nullable<T>>;

  /**
   * Retrieves a single entity using TypeORM where conditions with additional options
   * @param getEntityPayload - The where conditions to filter by
   * @param options - Additional options for the query
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to the entity or null if not found
   */
  execute(
    getEntityPayload: FindOptionsWhere<T>,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>>;

  /**
   * Retrieves multiple entities using TypeORM where conditions with array flag
   * @param getEntityPayload - The where conditions to filter by
   * @param options - Additional options with array flag set to true
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to an array of entities
   */
  execute(
    getEntityPayload: FindOptionsWhere<T>,
    options: GetAsyncOptions & { array: true },
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  /**
   * Retrieves multiple entities using an array of TypeORM where conditions with options
   * @param getEntityPayload - Array of where conditions to filter by
   * @param options - Additional options for the query
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to an array of entities
   */
  execute(
    getEntityPayload: Array<FindOptionsWhere<T>>,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  /**
   * Retrieves multiple entities using an array of TypeORM where conditions
   * @param getEntityPayload - Array of where conditions to filter by
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to an array of entities
   */
  execute(
    getEntityPayload: Array<FindOptionsWhere<T>>,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;

  /**
   * Retrieves multiple entities by an array of numeric IDs
   * @param getEntityPayload - Array of numeric IDs to retrieve
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to an array of entities
   */
  execute(getEntityPayload: Array<number>, queryRunner?: QueryRunner): Promise<Array<T>>;

  /**
   * Retrieves multiple entities by an array of numeric IDs with additional options
   * @param getEntityPayload - Array of numeric IDs to retrieve
   * @param options - Additional options for the query
   * @param queryRunner - Optional query runner for transaction support
   * @returns A promise that resolves to an array of entities
   */
  execute(
    getEntityPayload: Array<number>,
    options: GetAsyncOptions,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;
}
