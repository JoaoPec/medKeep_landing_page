/**
 * Interface defining options for asynchronous entity retrieval operations.
 *
 * This interface provides configuration options for repository methods that fetch entities,
 * allowing customization of the query behavior and result format.
 *
 * @interface GetAsyncOptions
 *
 * @property {boolean} [array] - When true, indicates the operation should return multiple entities
 *                              instead of a single entity.
 *
 * @property {Array<string>} [relations] - Optional array of relation names to eager-load
 *                                        with the main entity. This enables efficient loading
 *                                        of related entities in a single query.
 *
 * @property {number} [take] - Optional limit for the number of entities to retrieve.
 *                            Used for pagination or limiting result sets.
 *
 * @property {number} [skip] - Optional number of entities to skip before starting to collect.
 *                            Used in conjunction with 'take' for implementing pagination.
 *
 * @example
 * // Get a user with their posts and comments, paginated
 * const options: GetAsyncOptions = {
 *   relations: ['posts', 'comments'],
 *   take: 10,
 *   skip: 20
 * };
 * const user = await userRepository.getOneAsync(userId, options);
 */
export interface GetAsyncOptions {
  array?: boolean; // Indicates whether to return multiple entities
  relations?: Array<string>; // Optional custom relations to load
  take?: number;
  skip?: number;
}
