import { BullSubscribe, BullTopic } from '../bull-queue';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import type { ActivityLogEnqueuePayload } from './activity-log.types';
import { PersistActivityLogUseCase } from './use-cases/persist-activity-log.use-case';

@Injectable()
export class ActivityLogQueueProcessor {
  constructor(private readonly persistActivityLogUseCase: PersistActivityLogUseCase) {}

  @BullSubscribe(BullTopic.ActivityLog, { concurrency: 4 })
  public async handle(job: Job<ActivityLogEnqueuePayload>): Promise<void> {
    await this.persistActivityLogUseCase.execute(job.data);
  }
}
