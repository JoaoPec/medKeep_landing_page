import { Inject } from '@nestjs/common';
import { getCachedRepositoryToken } from '../helpers';

/**
 * Decorator for injecting cached TypeORM repositories into NestJS components.
 *
 * @description
 * This decorator simplifies the process of injecting cached entity repositories by automatically
 * generating the appropriate injection token using the getCachedRepositoryToken helper.
 * It provides access to repositories with built-in caching capabilities for improved performance.
 *
 * @example
 * ```typescript
 * // In a service or controller:
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     @InjectCachedRepository(User)
 *     private userRepository: CachedRepository<User>
 *   ) {}
 * }
 * ```
 *
 * @param {Function} entity - The entity class for which to inject the cached repository
 * @returns {ParameterDecorator} A parameter decorator that injects the cached repository
 */
export function InjectCachedRepository(entity: Function): ParameterDecorator {
  // Uses the getCachedRepositoryToken helper to generate a unique token for this cached repository
  return Inject(getCachedRepositoryToken(entity));
}
