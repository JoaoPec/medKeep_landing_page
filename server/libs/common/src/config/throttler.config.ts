import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

export const throttlerAsyncOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => [
    {
      ttl: configService.get<number>('THROTTLE_TTL') ?? 45000,
      limit: configService.get<number>('THROTTLE_LIMIT') ?? 180,
    },
  ],
};
