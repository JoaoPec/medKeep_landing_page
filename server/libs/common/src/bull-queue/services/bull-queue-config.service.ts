import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullQueueConfigService {
  constructor(private readonly configService: ConfigService) {}

  get redisConfig() {
    return {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      username: this.configService.get<string>('redis.username'),
      password: this.configService.get<string>('redis.password'),
      family: 0,
    };
  }

  get defaultJobOptions() {
    return {
      attempts: this.configService.get<number>('bull.defaultJobOptions.attempts'),
      backoff: {
        type: 'exponential',
        delay: this.configService.get<number>('bull.defaultJobOptions.backoff.delay'),
      },
      removeOnComplete: true,
    };
  }

  get throttleConfig() {
    return {
      defaultLimit: this.configService.get<number>('bull.throttle.defaultLimit'),
      defaultTTL: this.configService.get<number>('bull.throttle.defaultTTL'),
    };
  }
}
