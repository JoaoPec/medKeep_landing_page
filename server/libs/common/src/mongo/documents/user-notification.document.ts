import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'user_notifications',
  timestamps: true,
})
export class UserNotificationDocument extends Document {
  /** When audience is ADMIN_GLOBAL, may be null (single feed row for all admins). */
  @Prop({ index: true })
  recipientUserId?: string;

  @Prop({ required: true, index: true })
  audience: string;

  @Prop({ required: true, index: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: false, index: true })
  read: boolean;

  @Prop()
  link?: string;

  @Prop()
  actorUserId?: string;

  @Prop()
  actorUserName?: string;

  @Prop()
  actorAvatarUrl?: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  @Prop()
  relatedEntityId?: string;

  @Prop()
  relatedEntityType?: string;
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotificationDocument);

UserNotificationSchema.index({ recipientUserId: 1, read: 1, createdAt: -1 });
UserNotificationSchema.index({ audience: 1, createdAt: -1 });
