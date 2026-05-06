import { EntityId } from '../types';

/**
 * Represents an entity with a unique identifier.
 *
 * This interface serves as the base for all database entities in the system,
 * ensuring that each entity has a standardized identifier property.
 *
 * @json
 * {
 *   "interface": "IEntity",
 *   "description": "Base interface for all database entities",
 *   "properties": [
 *     {
 *       "name": "id",
 *       "type": "EntityId",
 *       "description": "Unique identifier for the entity that can be a bigint, number, or string"
 *     }
 *   ],
 *   "usage": "Extend this interface to create specific entity types with guaranteed ID property"
 * }
 */
export interface IEntity {
  /**
   * The unique identifier for this entity.
   * Can be a bigint, number, or string as defined by the EntityId type.
   */
  id: EntityId;
}
