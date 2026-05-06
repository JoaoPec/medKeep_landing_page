import { splitArrayIntoChunks } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { BULL_MESSAGE_BATCH_SIZE_LIMIT } from '../constants';
import { PublishMessageDto } from '../dtos';
import { BullJobOptions } from '../dtos/bull-job-options.dto';
import { BullQueueManager } from './bull-queue-manager.service';

@Injectable()
export class BullQueuePublisherService {
  constructor(private readonly bullQueueManager: BullQueueManager) {}

  private async publishBatch<T>(queue: Queue, data: T[], options?: BullJobOptions) {
    const chunks: T[][] = splitArrayIntoChunks(
      data,
      options?.batchSize ?? BULL_MESSAGE_BATCH_SIZE_LIMIT,
    );
    const bulkJobs: Promise<Job[]>[] = [];

    for (const chunk of chunks) {
      const jobs = chunk.map((item) => ({
        data: item,
        opts: options,
      }));

      bulkJobs.push(queue.addBulk(jobs));
    }

    await Promise.all(bulkJobs);
  }

  async publish<T>(publishDto: PublishMessageDto<T>): Promise<void> {
    const { queueName, data, options } = publishDto;
    const queue: Queue = this.bullQueueManager.getQueue(queueName);

    // Handle arrays by creating individual jobs for each item
    if (Array.isArray(data)) {
      // If batch option is enabled, use batch processing
      if (options?.batch) {
        await this.publishBatch(queue, data, options);
        return;
      }

      // Otherwise, add each item as a separate job
      const jobs = data.map((item) => ({
        data: item,
        opts: options,
      }));

      await queue.addBulk(jobs);
      return;
    }

    // For single items, add as a single job
    await queue.add(data, options);
  }
}
