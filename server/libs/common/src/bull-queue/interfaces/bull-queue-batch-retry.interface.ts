import { BullBatchRetryPublishInputDto } from '../dtos';

export interface IBullQueueBatchRetryService {
  publish(bullBatchRetryPublishInputDto: BullBatchRetryPublishInputDto): Promise<void>;
}
