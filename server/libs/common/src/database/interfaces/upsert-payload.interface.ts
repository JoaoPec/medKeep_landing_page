import { JsonbUpdateStrategy, UpsertUpdateOperation } from '../types';

/**
 * Interface defining the payload structure for upsert operations
 * @interface UpsertPayload<T>
 * @description Contains configuration for handling conflicts and update operations during upsert
 * @template T - The entity type being upserted
 */
export interface UpsertPayload<T> {
  /**
   * Array of entity property names that form the unique constraint for conflict detection
   * @type {(keyof T)[]}
   * @description Specifies which properties should be used to identify conflicts during upsert operations.
   * When a record with matching values for these properties exists, an update will be performed instead of insert.
   * @example ['id'] - Use single primary key
   * @example ['userId', 'coinId'] - Use composite key
   * @required
   */
  conflictKeys: (keyof T)[];

  /**
   * Configuration object defining how properties should be updated on conflict
   * @type {UpsertUpdateOperation<T>}
   * @required
   * @see UpsertUpdateOperation
   */
  upsertUpdateOperations: UpsertUpdateOperation<T>;

  /**
   * Whether to return the inserted/updated entities
   * @type {boolean}
   * @default false
   */
  returnEntities?: boolean;

  /**
   * Optional strategies for handling JSONB columns (key: property name, value: strategy).
   * For each JSONB property, you can specify 'multiKey' (per-key merge), 'singleValue' (old style),
   * or 'none' (no special logic).
   */
  jsonbStrategy?: Partial<Record<keyof T, JsonbUpdateStrategy>>;
}
