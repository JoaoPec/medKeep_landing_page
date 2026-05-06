import { PublishMessageDto } from '../dtos';

export interface IBullQueueRetryService<T> {
  publish(publishMessageDto: PublishMessageDto<T>): Promise<void>;
}
