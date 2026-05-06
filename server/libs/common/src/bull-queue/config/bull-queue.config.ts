import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService: ConfigService = new ConfigService();

export const bullQueueConfig = registerAs('bullQueue', () => {
  return {
    redis: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
      username: configService.get<string>('REDIS_USERNAME'),
    },
    bull: {
      defaultJobOptions: {
        attempts: configService.get<number>('BULL_DEFAULT_JOB_ATTEMPTS', 3),
        backoff: {
          type: 'exponential',
          delay: configService.get<number>('BULL_DEFAULT_BACKOFF_DELAY', 1000),
        },
      },
      throttle: {
        defaultLimit: configService.get<number>('BULL_DEFAULT_THROTTLE_LIMIT', 1000),
        defaultTTL: configService.get<number>('BULL_DEFAULT_THROTTLE_TTL', 60000),
      },
    },
  };
});
