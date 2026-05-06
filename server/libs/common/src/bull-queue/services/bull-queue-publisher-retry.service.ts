import { Injectable, Logger } from '@nestjs/common';
import { IBullQueueRetryService } from '../interfaces';
import { BullQueuePublisherService } from './bull-queue-publisher.service';
import { PublishMessageDto } from '../dtos';
import { sleep } from '@app/common/utils';

@Injectable()
export class BullQueueRetryService<T> implements IBullQueueRetryService<T> {
  private readonly logger = new Logger(BullQueueRetryService.name);
  private readonly maxRetries: number = 100;

  constructor(private readonly bullQueuePublisherService: BullQueuePublisherService) {}

  public async publish<T>(publishDto: PublishMessageDto<T>): Promise<void> {
    let delay: number = 1000;
    let attempts: number = 0;

    while (attempts < this.maxRetries) {
      try {
        await this.bullQueuePublisherService.publish(publishDto);
        break;
      } catch (error) {
        attempts += 1;
        this.logger.error(`Failed publish: attempt ${attempts} failed: ${error.message}`);

        if (attempts >= this.maxRetries) {
          throw error;
        }

        await sleep(delay);
        delay *= 2;
      }
    }
  }
}
