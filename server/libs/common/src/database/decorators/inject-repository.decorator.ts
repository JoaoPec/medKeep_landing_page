import { Inject } from '@nestjs/common';
import { getRepositoryToken } from '../helpers';

/**
 * Decorator for injecting TypeORM repositories into NestJS components.
 *
 * @description
 * This decorator simplifies the process of injecting entity repositories by automatically
 * generating the appropriate injection token using the getRepositoryToken helper.
 * It eliminates the need to manually create and manage repository tokens.
 *
 * @example
 * ```typescript
 * // In a service or controller:
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     @InjectRepository(User)
 *     private userRepository: Repository<User>
 *   ) {}
 * }
 * ```
 *
 * @param {Function} entity - The entity class for which to inject the repository
 * @returns {ParameterDecorator} A parameter decorator that injects the repository
 */
export function InjectRepository(entity: Function): ParameterDecorator {
  // Uses the getRepositoryToken helper to generate a unique token for this repository
  return Inject(getRepositoryToken(entity));
}
