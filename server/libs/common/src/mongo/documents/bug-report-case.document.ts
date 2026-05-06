import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: true })
export class BugReportSubmissionSubdoc {
  @Prop()
  reporterUserId?: string;

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ required: true })
  reporterType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  attachmentUrls: string[];

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;
}

const BugReportSubmissionSchema = SchemaFactory.createForClass(BugReportSubmissionSubdoc);

@Schema({
  collection: 'bug_report_cases',
  timestamps: true,
})
export class BugReportCaseDocument extends Document {
  /** Same as `surface`; kept for API parity with aggregated bug reports. */
  @Prop({ required: true, index: true })
  targetId: string;

  @Prop({ required: true, unique: true, index: true })
  surface: string;

  @Prop({ default: 'PENDING', index: true })
  status: string;

  @Prop({ default: 0 })
  submissionCount: number;

  @Prop({ type: [BugReportSubmissionSchema], default: [] })
  submissions: BugReportSubmissionSubdoc[];

  @Prop()
  resolvedAt?: Date;

  @Prop()
  resolvedBy?: string;

  @Prop()
  resolution?: string;

  @Prop()
  assignedTo?: string;

  @Prop()
  assignedToName?: string;
}

export const BugReportCaseSchema = SchemaFactory.createForClass(BugReportCaseDocument);

BugReportCaseSchema.index({ status: 1, updatedAt: -1 });
