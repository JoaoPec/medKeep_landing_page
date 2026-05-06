import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

// Create config service instance to access environment variables
const configService: ConfigService = new ConfigService();

/**
 * Database configuration factory registered under 'db' namespace
 * @function dbConfig
 * @description Provides database connection and behavior configuration options
 * by reading from environment variables. Handles defaults and type conversions.
 * @returns {Object} Database configuration object
 */
export const dbConfig = registerAs('db', () => {
  /**
   * Database configuration object containing connection and behavior settings
   * @type {Object}
   * @property {string} url - Database connection URL from DATABASE_URL env var
   * @property {boolean} ssl - SSL enabled in production environment only
   * @property {boolean} logging - SQL query logging enabled via DATABASE_LOGGING env var
   * @property {boolean} synchronize - Auto schema sync via DATABASE_SYNCHRONIZE env var
   */
  return {
    url: configService.get<string>('DATABASE_URL'),
    ssl: configService.get<string>('NODE_ENV') === 'production',
    logging: configService.get<string>('DATABASE_LOGGING', 'false', { infer: true }) === 'true',
    synchronize:
      configService.get<string>('DATABASE_SYNCHRONIZE', 'false', { infer: true }) === 'true',
  };
});
