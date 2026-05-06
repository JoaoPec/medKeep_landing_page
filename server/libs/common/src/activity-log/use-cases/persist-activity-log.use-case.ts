import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLogDocument } from '../../mongo';
import type { ActivityLogEnqueuePayload } from '../activity-log.types';

@Injectable()
export class PersistActivityLogUseCase {
  constructor(
    @InjectModel(ActivityLogDocument.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async execute(payload: ActivityLogEnqueuePayload): Promise<void> {
    const timestamp = payload.timestamp ?? new Date();
    await this.activityLogModel.create({
      timestamp,
      userType: payload.userType,
      userId: payload.userId,
      userName: payload.userName,
      userAvatar: payload.userAvatar,
      action: payload.action,
      description: payload.description,
      level: payload.level,
      category: payload.category,
      metadata: payload.metadata,
      ipAddress: payload.ipAddress,
    });
  }
}
