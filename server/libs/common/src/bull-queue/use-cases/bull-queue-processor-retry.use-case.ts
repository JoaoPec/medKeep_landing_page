import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Injectable()
export class BullQueueProcessorRetryUseCase {
  private readonly logger = new Logger(BullQueueProcessorRetryUseCase.name);

  execute(queue: Queue): void {
    queue.on('failed', async (job: Job, error: Error) => {
      this.logger.error(`Job failed: ${job.id}, error: ${error.message}`);

      if (job.attemptsMade >= job.opts.attempts) {
        this.logger.log(`Re-adding job ${job.id} to the queue for retry...`);

        await Promise.all([job.discard(), job.remove()]);
      }
    });
  }
}
