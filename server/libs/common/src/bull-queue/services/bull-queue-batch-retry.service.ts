import { Injectable } from '@nestjs/common';
import { IBullQueueBatchRetryService } from '../interfaces';
import { BullQueueRetryService } from './bull-queue-publisher-retry.service';
import { BULL_MESSAGE_BATCH_SIZE_LIMIT } from '../constants';
import { BullBatchRetryPublishInputDto } from '../dtos';
import { sleep, splitArrayIntoChunks } from '@app/common/utils';
@Injectable()
export class BullQueueBatchRetryService<T> implements IBullQueueBatchRetryService {
  constructor(private readonly bullQueueRetryService: BullQueueRetryService<T>) {}

  public async publish(
    bullBatchRetryPublishInputDto: BullBatchRetryPublishInputDto,
  ): Promise<void> {
    const messageChunks: Array<Array<Record<string, any>>> = splitArrayIntoChunks(
      bullBatchRetryPublishInputDto.messages,
      bullBatchRetryPublishInputDto.chunkSize || BULL_MESSAGE_BATCH_SIZE_LIMIT,
    );

    // Iterate over each chunk and publish them sequentially
    for (let i = 0; i < messageChunks.length; i++) {
      const messageChunk = messageChunks[i];
      const isLastChunk = i === messageChunks.length - 1;

      // Publish the current chunk
      await this.bullQueueRetryService.publish({
        queueName: bullBatchRetryPublishInputDto.queueName,
        data: messageChunk,
        options: {
          jobId: `batch-${i}-${Date.now()}`,
        },
      });

      // Optional delay for all but the last chunk to avoid unnecessary delays
      if (!isLastChunk && bullBatchRetryPublishInputDto.delayBetweenChunks > 0) {
        await sleep(bullBatchRetryPublishInputDto.delayBetweenChunks);
      }
    }
  }
}
