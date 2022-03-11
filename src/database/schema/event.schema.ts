import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
    @Prop()
    type: string;

    @Prop()
    page: string;

    @Prop({ index: true })
    user: string;

    @Prop()
    element_id: string;

    @Prop({ type: Date, default: Date.now, index: true })
    timestamp: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);