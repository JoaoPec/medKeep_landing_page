import { FindOptionsWhere, QueryRunner } from 'typeorm';
import { Either, Nullable } from '../../interfaces';
import { GetAsyncOptions } from './get-entity-async-options.interface';

/**
 * Interface for repositories that support retrieving a single entity asynchronously.
 *
 * @interface IGetOneAsyncRepository
 * @description
 * Defines a contract for repositories that can retrieve a single entity by its ID
 * or by a set of conditions. Supports optional query customization through GetAsyncOptions
 * and transaction management via QueryRunner.
 *
 * @template T - The entity type to be retrieved
 *
 * @example
 * // Implementation example
 * class UserRepository implements IGetOneAsyncRepository<User> {
 *   async getOneAsync(
 *     payload: number | FindOptionsWhere<User>,
 *     options?: GetAsyncOptions | QueryRunner,
 *     queryRunner?: QueryRunner
 *   ): Promise<User | null> {
 *     // Implementation details
 *   }
 * }
 */
export interface IGetOneAsyncRepository<T> {
  /**
   * Retrieves a single entity based on the provided payload.
   *
   * @param getEntityPayload - Either a numeric ID or a set of conditions to find the entity
   * @param optionsOrQueryRunner - Optional query options or a QueryRunner for transaction support
   * @param queryRunner - Optional QueryRunner when the second parameter is used for options
   * @returns A promise that resolves to the found entity or null if not found
   *
   * @example
   * // Get by ID
   * const user = await userRepo.getOneAsync(123);
   *
   * @example
   * // Get by conditions with relations
   * const user = await userRepo.getOneAsync(
   *   { email: 'user@example.com' },
   *   { relations: ['profile', 'orders'] }
   * );
   */
  getOneAsync(
    getEntityPayload: Either<number, FindOptionsWhere<T>>,
    optionsOrQueryRunner?: Either<GetAsyncOptions, QueryRunner>,
    queryRunner?: QueryRunner,
  ): Promise<Nullable<T>>;
}
