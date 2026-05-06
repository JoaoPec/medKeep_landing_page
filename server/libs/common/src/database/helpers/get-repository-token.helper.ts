import { EntityTarget } from 'typeorm';

/**
 * Generates a unique injection token for the given entity.
 * This token is used for dependency injection in NestJS to identify repository instances.
 *
 * @description
 * The function creates a standardized token format by appending '_repository' to the entity name.
 * This allows for consistent repository identification across the application.
 *
 * @example
 * ```typescript
 * // For an entity class named 'User'
 * const token = getRepositoryToken(User); // Returns 'User_repository'
 *
 * // Usage with NestJS dependency injection
 * @Inject(getRepositoryToken(User))
 * private userRepository: Repository<User>
 * ```
 *
 * @param {EntityTarget<T>} entity - The entity class or entity target for which to generate a token
 * @returns {string} A unique string token for dependency injection
 *
 * @throws {Error} Implicitly may throw if entity doesn't have a 'name' property
 */
export function getRepositoryToken<T>(entity: EntityTarget<T>): string {
  // Extract the entity name and append '_repository' suffix to create a unique token
  // The 'as any' cast is necessary because EntityTarget can be various types
  // and we need to access the 'name' property which exists on class constructors
  return `${(entity as any).name}_repository`;
}
