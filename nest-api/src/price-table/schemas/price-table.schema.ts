import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PriceTableDocument = HydratedDocument<PriceTable>;

@Schema()
export class PriceTable {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  doctags: string;

  @Prop({ required: true })
  organization_id: string;

  @Prop({ required: true })
  filename: string;
}

export const PriceTableSchema = SchemaFactory.createForClass(PriceTable);
