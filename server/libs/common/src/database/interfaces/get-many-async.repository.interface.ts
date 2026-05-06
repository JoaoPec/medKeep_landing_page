import { FindOptionsWhere, QueryRunner } from 'typeorm';
import { Either } from '../../interfaces';
import { GetAsyncOptions } from './get-entity-async-options.interface';

/**
 * Interface for repositories that support retrieving multiple entities asynchronously.
 *
 * @interface IGetManyAsyncRepository
 * @description
 * Defines a contract for repositories that can retrieve multiple entities by their IDs
 * or by a set of conditions. Supports optional query customization through GetAsyncOptions
 * and transaction management via QueryRunner.
 *
 * @template T - The entity type to be retrieved
 *
 * @example
 * // Implementation example
 * class UserRepository implements IGetManyAsyncRepository<User> {
 *   async getManyAsync(
 *     payload: Array<bigint> | Array<FindOptionsWhere<User>>,
 *     options?: GetAsyncOptions | QueryRunner,
 *     queryRunner?: QueryRunner
 *   ): Promise<Array<User>> {
 *     // Implementation details
 *   }
 * }
 */
export interface IGetManyAsyncRepository<T> {
  /**
   * Retrieves multiple entities based on the provided payload.
   *
   * @param getEntityPayload - Either an array of bigint IDs or an array of conditions to find entities
   * @param optionsOrQueryRunner - Optional query options or a QueryRunner for transaction support
   * @param queryRunner - Optional QueryRunner when the second parameter is used for options
   * @returns A promise that resolves to an array of found entities
   *
   * @example
   * // Get by IDs
   * const users = await userRepo.getManyAsync([1n, 2n, 3n]);
   *
   * @example
   * // Get by conditions with relations
   * const users = await userRepo.getManyAsync(
   *   [{ role: 'admin' }, { role: 'moderator' }],
   *   { relations: ['profile', 'permissions'] }
   * );
   */
  getManyAsync(
    getEntityPayload: Either<Array<bigint>, Array<FindOptionsWhere<T>>>,
    optionsOrQueryRunner?: Either<GetAsyncOptions, QueryRunner>,
    queryRunner?: QueryRunner,
  ): Promise<Array<T>>;
}
