import { Injectable, OnModuleInit } from '@nestjs/common';
import { BullQueueDiscoveryService } from './bull-queue-discovery.service';
import { BullQueueManager } from './bull-queue-manager.service';
import { Queue } from 'bull';
import { MessageHandler } from '../interfaces';

@Injectable()
export class BullQueueProcessorService implements OnModuleInit {
  constructor(
    private readonly discoveryService: BullQueueDiscoveryService,
    private readonly bullQueueManager: BullQueueManager,
  ) {}

  async onModuleInit() {
    const processors: Map<string, MessageHandler[]> =
      await this.discoveryService.discoverProcessors();

    for (const [queueName, handlers] of processors.entries()) {
      const queue: Queue = this.bullQueueManager.getQueue(queueName);

      for (const { handler, options } of handlers) {
        queue.process(options.concurrency || 1, async (job) => handler(job));
      }
    }
  }
}
