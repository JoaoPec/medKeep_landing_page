import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService: ConfigService = new ConfigService();

/**
 * Redis configuration factory function
 * @function redisConfig
 * @description Registers and returns Redis configuration options from environment variables
 * @returns {RedisConfig} Object containing Redis connection parameters
 */
export const redisConfig = registerAs('redis', () => {
  // Get required Redis configuration values from environment
  const uri = configService.getOrThrow<string>('REDIS_URI');
  const password = configService.getOrThrow<string>('REDIS_PASSWORD');
  const username = configService.getOrThrow<string>('REDIS_USERNAME');

  // Get Redis host and port with defaults
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);

  return {
    uri,
    host,
    port,
    password,
    username,
  };
});
