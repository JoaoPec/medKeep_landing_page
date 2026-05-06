import { BullJobOptions } from './bull-job-options.dto';

export interface PublishMessageDto<T> {
  queueName: string;
  data: T | T[];
  options?: BullJobOptions;
}
