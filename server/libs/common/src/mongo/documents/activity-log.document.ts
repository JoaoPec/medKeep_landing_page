import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'activity_logs',
  timestamps: false,
})
export class ActivityLogDocument extends Document {
  @Prop({ type: Date, required: true, index: true })
  timestamp: Date;

  @Prop({ required: true, index: true })
  userType: string;

  @Prop()
  userId?: string;

  @Prop()
  userName?: string;

  @Prop()
  userAvatar?: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  level: string;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  @Prop()
  ipAddress?: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLogDocument);

ActivityLogSchema.index({ timestamp: -1 });
