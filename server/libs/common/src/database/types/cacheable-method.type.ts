/**
 * Defines the repository methods that support caching functionality.
 *
 * @json
 * {
 *   "type": "CacheableMethod",
 *   "description": "Union type of repository methods that can be cached",
 *   "values": [
 *     {
 *       "name": "getOneAsync",
 *       "description": "Asynchronously retrieves a single entity"
 *     },
 *     {
 *       "name": "getManyAsync",
 *       "description": "Asynchronously retrieves multiple entities"
 *     },
 *     {
 *       "name": "countAsync",
 *       "description": "Asynchronously counts entities matching criteria"
 *     },
 *     {
 *       "name": "findOne",
 *       "description": "Finds a single entity matching criteria"
 *     },
 *     {
 *       "name": "find",
 *       "description": "Finds multiple entities matching criteria"
 *     },
 *     {
 *       "name": "findAndCount",
 *       "description": "Finds entities and returns count of total matches"
 *     },
 *     {
 *       "name": "count",
 *       "description": "Counts entities matching criteria"
 *     }
 *   ]
 * }
 */
export type CacheableMethod =
  | 'getOneAsync'
  | 'getManyAsync'
  | 'countAsync'
  | 'findOne'
  | 'find'
  | 'findAndCount'
  | 'count';
