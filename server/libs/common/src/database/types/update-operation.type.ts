/**
 * Represents a value that can be used in an update operation.
 * It can be:
 * - A direct value of type T
 * - An object specifying an increment operation with a value of type T or Decimal
 * - An object specifying a decrement operation with a value of type T or Decimal
 */
export type UpdateValue<T> =
  | T
  | { increment: T } // e.g. increment: number or Decimal
  | { decrement: T };

/**
 * Represents an update operation for an entity of type T.
 * Each property of T can be updated with a value of type UpdateValue.
 */
export type UpdateOperation<T> = {
  [P in keyof T]?: UpdateValue<T[P]>;
};
