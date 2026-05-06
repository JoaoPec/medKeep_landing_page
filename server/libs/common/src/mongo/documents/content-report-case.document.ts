import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: true })
export class ContentReportSubmissionSubdoc {
  @Prop()
  reporterUserId?: string;

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ required: true })
  reporterType: string;

  @Prop({ required: true })
  reasonCode: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  attachmentUrls: string[];

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;
}

const ContentReportSubmissionSchema = SchemaFactory.createForClass(ContentReportSubmissionSubdoc);

@Schema({
  collection: 'content_report_cases',
  timestamps: true,
})
export class ContentReportCaseDocument extends Document {
  @Prop({ required: true, index: true })
  targetKind: string;

  @Prop({ required: true, index: true })
  targetId: string;

  @Prop()
  targetName?: string;

  @Prop()
  targetOwnerProfileId?: string;

  @Prop()
  targetOwnerName?: string;

  @Prop()
  targetOwnerType?: string;

  @Prop()
  targetThumbnailUrl?: string;

  @Prop({ default: 'PENDING', index: true })
  status: string;

  @Prop({ required: true })
  lastReasonCode: string;

  @Prop({ default: 0 })
  submissionCount: number;

  @Prop({ type: [ContentReportSubmissionSchema], default: [] })
  submissions: ContentReportSubmissionSubdoc[];

  @Prop()
  resolvedAt?: Date;

  @Prop()
  resolvedBy?: string;

  @Prop()
  resolution?: string;
}

export const ContentReportCaseSchema = SchemaFactory.createForClass(ContentReportCaseDocument);

ContentReportCaseSchema.index({ targetKind: 1, targetId: 1 }, { unique: true });
ContentReportCaseSchema.index({ status: 1, updatedAt: -1 });
