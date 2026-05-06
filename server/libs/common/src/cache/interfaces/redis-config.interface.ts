/**
 * Interface defining Redis configuration options
 * @interface RedisConfig
 * @description Contains essential configuration parameters required for Redis connection
 */
export interface RedisConfig {
  /**
   * The Redis connection URI string
   * @type {string}
   * @required
   */
  uri: string;

  /**
   * The Redis server host
   * @type {string}
   * @required
   * @default 'localhost'
   */
  host: string;

  /**
   * The Redis server port
   * @type {number}
   * @required
   * @default 6379
   */
  port: number;

  /**
   * Password for Redis authentication
   * @type {string}
   * @required
   */
  password: string;

  /**
   * Username for Redis authentication
   * @type {string}
   * @required
   */
  username: string;
}
