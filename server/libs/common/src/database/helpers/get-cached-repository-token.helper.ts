import { EntityTarget } from 'typeorm';

/**
 * Generates a unique injection token for a cached repository of the given entity.
 *
 * @description
 * This function creates a standardized token format by appending '_cached_repository'
 * to the entity name. It's used for dependency injection in NestJS to identify
 * cached repository instances, distinguishing them from regular repositories.
 *
 * @example
 * ```typescript
 * // For an entity class named 'User'
 * const token = getCachedRepositoryToken(User); // Returns 'User_cached_repository'
 *
 * // Usage with NestJS dependency injection
 * @Inject(getCachedRepositoryToken(User))
 * private cachedUserRepository: CachedRepository<User>
 * ```
 *
 * @param {EntityTarget<T>} entity - The entity class or entity target for which to generate a token
 * @returns {string} A unique string token for cached repository dependency injection
 *
 * @throws {Error} Implicitly may throw if entity doesn't have a 'name' property
 */
export function getCachedRepositoryToken<T>(entity: EntityTarget<T>): string {
  // Extract the entity name and append '_cached_repository' suffix to create a unique token
  // The 'as any' cast is necessary because EntityTarget can be various types
  // and we need to access the 'name' property which exists on class constructors
  return `${(entity as any).name}_cached_repository`;
}
