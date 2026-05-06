/**
 * Type representing any valid parameter value
 */
export type CacheCriteria =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Array<any>
  | Record<string, any>;
