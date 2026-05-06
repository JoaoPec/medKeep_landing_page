import { BullQueuePublisherService, BullTopic } from '../../bull-queue';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ActivityLogEnqueuePayload } from '../activity-log.types';
import type { ActivityLogConfigShape } from '../config';
import { isActivityLogLevelAllowed } from '../helpers';

@Injectable()
export class EnqueueActivityLogUseCase {
  constructor(
    private readonly bullQueuePublisherService: BullQueuePublisherService,
    private readonly configService: ConfigService,
  ) {}

  async execute(payload: ActivityLogEnqueuePayload): Promise<void> {
    const cfg = this.configService.get<ActivityLogConfigShape>('activityLog');
    if (!cfg || !cfg.enabled) {
      return;
    }
    if (!isActivityLogLevelAllowed(payload.level, cfg.minLevel, cfg.skipDebug)) {
      return;
    }

    await this.bullQueuePublisherService.publish({
      queueName: BullTopic.ActivityLog,
      data: payload,
    });
  }
}
