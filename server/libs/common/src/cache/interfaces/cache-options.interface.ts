/**
 * Interface defining configuration options for cache operations
 * @interface ICacheOptions
 * @description Contains optional configuration parameters for cache read/write operations
 */
export interface ICacheOptions {
  /**
   * Flag indicating whether to include excluded properties when serializing/deserializing cached values
   * @type {boolean}
   * @optional
   * @description When true, properties marked with @Exclude() decorator will be included in the cached data
   */
  withExcluded?: boolean;

  /**
   * Optional time-to-live (TTL) in milliseconds for the cached value
   * @type {number}
   * @optional
   * @description Specifies the duration for which the cached value should be stored in the cache
   */
  ttl?: number;
}
