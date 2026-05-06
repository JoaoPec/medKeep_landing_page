/**
 * Interface defining database connection configuration options related to security and behavior
 * @interface DatabaseSecretOptions
 * @property {boolean} logging - Controls whether SQL query logging is enabled
 * @property {boolean} synchronize - Controls whether database schema should auto-synchronize with entities
 * @property {boolean} ssl - Controls whether SSL/TLS encryption is enabled for the database connection
 */
export interface DatabaseSecretOptions {
  url: string;
  ssl: boolean;
  logging: boolean;
  synchronize: boolean;
}
