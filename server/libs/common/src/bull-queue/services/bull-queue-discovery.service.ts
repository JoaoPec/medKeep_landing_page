import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { BULL_QUEUE_PROCESS } from '../constants';
import { MessageHandler, ProcessMessageOptions } from '../interfaces';

@Injectable()
export class BullQueueDiscoveryService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  async discoverProcessors(): Promise<Map<string, MessageHandler[]>> {
    const processors = new Map<string, MessageHandler[]>();
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      const instance = provider.instance;

      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      for (const methodName of methodNames) {
        const metadata: ProcessMessageOptions = this.reflector.get(
          BULL_QUEUE_PROCESS,
          instance[methodName],
        );

        if (!metadata) {
          continue;
        }

        if (!processors.has(metadata.queueName)) {
          processors.set(metadata.queueName, []);
        }

        processors.get(metadata.queueName).push({
          handler: instance[methodName].bind(instance),
          options: metadata,
        });
      }
    }

    return processors;
  }
}
