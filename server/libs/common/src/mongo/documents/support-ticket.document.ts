import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: true })
export class SupportTicketMessageSubdoc {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  senderType: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  attachmentUrls: string[];

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;
}

const SupportTicketMessageSchema = SchemaFactory.createForClass(SupportTicketMessageSubdoc);

@Schema({
  collection: 'support_tickets',
  timestamps: true,
})
export class SupportTicketDocument extends Document {
  @Prop({ required: true })
  openedBy: string;

  @Prop({ required: true, index: true })
  requesterId: string;

  @Prop({ required: true })
  requesterName: string;

  @Prop({ required: true })
  requesterEmail: string;

  @Prop({ required: true })
  requesterType: string;

  @Prop()
  requesterAvatarUrl?: string;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ required: true, index: true })
  priority: string;

  @Prop({ default: 'OPEN', index: true })
  status: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  assignedTo?: string;

  @Prop()
  assignedToName?: string;

  @Prop({ type: [SupportTicketMessageSchema], default: [] })
  messages: SupportTicketMessageSubdoc[];

  @Prop()
  resolvedAt?: Date;

  @Prop()
  closedAt?: Date;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicketDocument);

SupportTicketSchema.index({ status: 1, updatedAt: -1 });
SupportTicketSchema.index({ requesterId: 1, createdAt: -1 });
