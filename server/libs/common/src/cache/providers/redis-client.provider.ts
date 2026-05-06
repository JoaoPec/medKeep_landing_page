import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from '../constants';
import { RedisConfig } from '../interfaces';

/**
 * A NestJS provider for configuring and creating a Redis client instance.
 * This provider is responsible for:
 * - Fetching Redis connection details from the application's configuration.
 * - Creating a Redis client with retry strategies, authentication, and error handling.
 */
export const RedisClientProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const redisConfiguration: RedisConfig = configService.getOrThrow<RedisConfig>('redis');
    const client: Redis = new Redis(redisConfiguration.uri, {
      retryStrategy(iteration) {
        const delay: number = Math.min(iteration * 50, 2000);
        return delay;
      },
      family: 0,
      maxRetriesPerRequest: 20,
      username: redisConfiguration.username,
      password: redisConfiguration.password,
      host: redisConfiguration.host,
      port: redisConfiguration.port,
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    return client;
  },
  inject: [ConfigService],
};
