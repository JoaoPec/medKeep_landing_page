/**
 * Interface defining database configuration options
 * @interface DatabaseConfig
 * @description Contains essential configuration parameters for database connection and behavior
 */
export interface DatabaseConfig {
  /**
   * Database connection URL string
   * @type {string}
   * @required
   */
  url: string;

  /**
   * Flag to enable/disable SSL for database connection
   * @type {boolean}
   * @required
   */
  ssl: boolean;

  /**
   * Flag to enable/disable SQL query logging
   * @type {boolean}
   * @required
   */
  logging: boolean;

  /**
   * Flag to enable/disable automatic schema synchronization
   * @type {boolean}
   * @required
   */
  synchronize: boolean;
}
