import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { bullQueueConfig } from './config';
import {
  BullQueueBatchRetryService,
  BullQueueConfigService,
  BullQueuePublisherService,
  BullQueueRetryService,
  bullServices,
} from './services';
import { bullUseCases } from './use-cases';

@Global()
@Module({})
export class BullQueueModule {
  static forRoot(options?: { configOverride?: Record<string, any> }): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [
        DiscoveryModule,
        ConfigModule.forRoot({
          load: [() => ({ ...bullQueueConfig(), ...options?.configOverride })],
          isGlobal: true,
        }),
      ],
      providers: [...bullServices, ...bullUseCases],
      exports: [
        BullQueueRetryService,
        BullQueueConfigService,
        BullQueueBatchRetryService,
        BullQueuePublisherService,
      ],
    };
  }
}
