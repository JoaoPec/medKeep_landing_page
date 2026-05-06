import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PartnershipNetworkTokenDocument extends Document {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const PartnershipNetworkTokenSchema = SchemaFactory.createForClass(
  PartnershipNetworkTokenDocument,
);
