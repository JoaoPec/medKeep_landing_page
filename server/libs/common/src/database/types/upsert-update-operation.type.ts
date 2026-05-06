/**
 * The type for update operations.
 * For each property you want to update on conflict:
 * - Set increment to true to increment the column with the EXCLUDED value
 * - Set decrement to true to decrement the column with the EXCLUDED value
 * - Set neither to simply update with EXCLUDED value
 */
export type UpsertUpdateOperation<T> = Partial<{
  [P in keyof T]: boolean | { increment?: boolean; decrement?: boolean };
}>;
