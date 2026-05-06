import { FindManyOptions, QueryRunner } from 'typeorm';

/**
 * Interface for asynchronous entity counting use cases.
 *
 * @interface ICountAsyncUseCase
 * @description
 * Defines a contract for use cases that count entities asynchronously from a data source.
 * Supports optional filtering through FindManyOptions and transaction management via QueryRunner.
 *
 * @template T - The entity type to be counted
 *
 * @example
 * // Implementation example
 * class UserCountUseCase implements ICountAsyncUseCase<User> {
 *   constructor(private repository: ICountAsyncRepository<User>) {}
 *
 *   async execute(options?: FindManyOptions<User>, queryRunner?: QueryRunner): Promise<number> {
 *     return this.repository.countAsync(options, queryRunner);
 *   }
 * }
 */
export interface ICountAsyncUseCase<T> {
  /**
   * Counts entities based on the provided options.
   *
   * @param options - Optional TypeORM FindManyOptions to filter which entities to count
   * @param queryRunner - Optional QueryRunner for transaction support
   * @returns A promise that resolves to the number of entities matching the criteria
   *
   * @example
   * // Count all users
   * const totalUsers = await userCountUseCase.execute();
   *
   * @example
   * // Count active users
   * const activeUsers = await userCountUseCase.execute({
   *   where: { isActive: true }
   * });
   */
  execute(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<number>;
}
