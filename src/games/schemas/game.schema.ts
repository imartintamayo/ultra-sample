import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import {
  PublisherDocument,
  Publisher,
} from '../../publishers/schemas/publisher.schema';

@Schema()
export class Game {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  releaseDate: Date;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Publisher.name })
  publisher: PublisherDocument;
}

export type GameDocument = Game & Document;
export const GameSchema = SchemaFactory.createForClass(Game);
