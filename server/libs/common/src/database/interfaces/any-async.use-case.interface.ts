import { FindManyOptions, QueryRunner } from 'typeorm';

/**
 * Interface for use cases that check for the existence of any entity matching criteria.
 *
 * @interface IAnyAsyncUseCase
 * @description
 * Defines a contract for use cases that can check if any entities exist
 * based on optional filtering criteria. Supports transaction management via QueryRunner.
 *
 * @template T - The entity type to check for existence
 *
 * @example
 * // Implementation example
 * class CheckUserExistsUseCase implements IAnyAsyncUseCase<User> {
 *   constructor(private repository: IAnyAsyncRepository<User>) {}
 *
 *   async execute(
 *     options?: FindManyOptions<User>,
 *     queryRunner?: QueryRunner
 *   ): Promise<boolean> {
 *     return this.repository.anyAsync(options, queryRunner);
 *   }
 * }
 */
export interface IAnyAsyncUseCase<T> {
  /**
   * Executes the use case to check if any entities exist based on the provided options.
   *
   * @param options - Optional TypeORM FindManyOptions to filter which entities to check
   * @param queryRunner - Optional QueryRunner for transaction support
   * @returns A promise that resolves to true if any matching entities exist, false otherwise
   *
   * @example
   * // Check if any users exist
   * const hasUsers = await checkUserExistsUseCase.execute();
   *
   * @example
   * // Check if any active admin users exist
   * const hasActiveAdmins = await checkUserExistsUseCase.execute({
   *   where: { isActive: true, role: 'admin' }
   * });
   */
  execute(options?: FindManyOptions<T>, queryRunner?: QueryRunner): Promise<boolean>;
}
