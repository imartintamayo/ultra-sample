import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Publisher } from './publisher.schema';

@Schema()
export class Game {
    @Prop()
    title: string;

    @Prop()
    price: number;

    @Prop()
    releaseDate: Date;

    @Prop([String])
    tags: string[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Publisher' })
    publisher: Publisher;
}

export type GameDocument = Game & Document;
export const GameSchema = SchemaFactory.createForClass(Game);