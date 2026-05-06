import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from './config';
import { cacheProviders } from './providers';
import { cacheServices } from './services';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
    }),
  ],
  providers: [...cacheProviders, ...cacheServices],
  exports: [...cacheServices],
})
export class CacheModule {}
