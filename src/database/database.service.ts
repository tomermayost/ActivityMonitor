import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from '../monitor/dto';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class DatabaseService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) { }

    async createEvent(dto: EventDto) {
        await this.eventModel.create(dto);
    }

    async findAllEvents() {
        return await this.eventModel.find().exec();
    }

    async getEventCountByUser() {
        return await this.eventModel.aggregate([
            { $match: {} },
            { $group: { _id: '$user', total: { $sum: '$summable' } } },
            { $project: { 'user': '$_id', 'total': 1, '_id': 0 } }
        ]);
    }

    async getAllEvents() {
        return await this.eventModel.find().exec();
    }
}
