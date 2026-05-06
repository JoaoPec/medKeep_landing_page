import { UpdateOperation } from '../types';

/**
 * Represents the data required for a bulk update operation.
 *
 * @template T - The type of the entity being updated.
 */
export type BulkUpdateData<T> = Array<{
  /**
   * A partial object of type T used to filter the entities to be updated.
   * Only the properties provided in this object will be used for filtering.
   */
  filter: Partial<T>;

  /**
   * An object specifying the update operations to be applied to the filtered entities.
   * Each property of T can be updated with a value of type UpdateValue.
   */
  update: UpdateOperation<T>;
}>;
