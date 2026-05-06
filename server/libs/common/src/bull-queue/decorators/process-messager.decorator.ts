import { SetMetadata } from '@nestjs/common';
import { BULL_QUEUE_PROCESS } from '../constants';
import { ProcessMessageOptions } from '../interfaces';

export const BullSubscribe = (
  queueName: string,
  options?: Omit<ProcessMessageOptions, 'queueName'>,
) =>
  SetMetadata(BULL_QUEUE_PROCESS, {
    queueName,
    concurrency: options?.concurrency,
  });
