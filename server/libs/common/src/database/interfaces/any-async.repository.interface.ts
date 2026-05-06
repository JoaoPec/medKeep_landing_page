import { FindManyOptions, QueryRunner } from 'typeorm';

/**
 * Interface for repositories that check for the existence of any entity matching criteria.
 *
 * @interface IAnyAsyncRepository
 * @description
 * Defines a contract for repositories that can check if any entities exist
 * based on optional filtering criteria. Supports transaction management via QueryRunner.
 *
 * @template T - The entity type to check for existence
 *
 * @example
 * // Implementation example
 * class UserRepository implements IAnyAsyncRepository<User> {
 *   async anyAsync(
 *     options?: FindManyOptions<User>,
 *     queryRunner?: QueryRunner
 *   ): Promise<boolean> {
 *     // Implementation details
 *     const count = await this.repository.count(options);
 *     return count > 0;
 *   }
 * }
 */
export interface IAnyAsyncRepository<T> {
  /**
   * Checks if any entities exist based on the provided options.
   *
   * @param options - Optional TypeORM FindManyOptions to filter which entities to check
   * @param queryRunner - Optional QueryRunner for transaction support
   * @returns A promise that resolves to true if any matching entities exist, false otherwise
   *
   * @example
   * // Check if any users exist
   * const hasUsers = await userRepo.anyAsync();
   *
   * @example
   * // Check if any active admin users exist
   * const hasActiveAdmins = await userRepo.anyAsync({
   *   where: { isActive: true, role: 'admin' }
   * });
   */
  anyAsync(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<boolean>;
}
