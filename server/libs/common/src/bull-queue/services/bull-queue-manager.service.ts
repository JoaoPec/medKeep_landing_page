import { Injectable } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { BullQueueConfigService } from './bull-queue-config.service';
import { BullQueueProcessorRetryUseCase } from '../use-cases';

@Injectable()
export class BullQueueManager {
  private readonly queues = new Map<string, Queue>();

  constructor(
    private readonly configService: BullQueueConfigService,
    private readonly bullQueueProcessorRetryUseCase: BullQueueProcessorRetryUseCase,
  ) {}

  createQueue(name: string): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name);
    }

    const queue: Queue = new Bull(name, {
      redis: this.configService.redisConfig,
      defaultJobOptions: this.configService.defaultJobOptions,
    });

    this.bullQueueProcessorRetryUseCase.execute(queue);

    this.queues.set(name, queue);
    return queue;
  }

  getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      return this.createQueue(name);
    }

    return this.queues.get(name);
  }

  getAllQueues(): Map<string, Queue> {
    return this.queues;
  }
}
