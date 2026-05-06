import { FindManyOptions, QueryRunner } from 'typeorm';

/**
 * Interface for repositories that support counting entities asynchronously.
 *
 * @interface ICountAsyncRepository
 * @description
 * Defines a contract for repositories that can count entities based on optional
 * filtering criteria. Supports transaction management via QueryRunner.
 *
 * @template T - The entity type to be counted
 *
 * @example
 * // Implementation example
 * class UserRepository implements ICountAsyncRepository<User> {
 *   async countAsync(
 *     options?: FindManyOptions<User>,
 *     queryRunner?: QueryRunner
 *   ): Promise<number> {
 *     // Implementation details
 *     return this.repository.count(options);
 *   }
 * }
 */
export interface ICountAsyncRepository<T> {
  /**
   * Counts entities based on the provided options.
   *
   * @param options - Optional TypeORM FindManyOptions to filter which entities to count
   * @param queryRunner - Optional QueryRunner for transaction support
   * @returns A promise that resolves to the number of entities matching the criteria
   *
   * @example
   * // Count all users
   * const totalUsers = await userRepo.countAsync();
   *
   * @example
   * // Count active users
   * const activeUsers = await userRepo.countAsync({
   *   where: { isActive: true }
   * });
   */
  countAsync(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<number>;
}
