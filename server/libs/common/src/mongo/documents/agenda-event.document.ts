import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AgendaEventDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  data: any;

  @Prop({ required: true, index: true })
  scheduledAt: Date;
}

export const AgendaEventSchema = SchemaFactory.createForClass(AgendaEventDocument);
