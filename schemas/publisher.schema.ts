import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Publisher {
    @Prop()
    name: string;

    @Prop()
    siret: number;

    @Prop()
    phone: string;
}

export type PublisherDocument = Publisher & Document;
export const PublisherSchema = SchemaFactory.createForClass(Publisher);