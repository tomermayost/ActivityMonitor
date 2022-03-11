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

    async getEventCountByUser(pagination?: { skip?: number, limit?: number }) {
        return await this.eventModel.aggregate([
            { $match: {} },
            { $group: { _id: '$user', events: { $sum: 1 } } },
            { $project: { 'user': '$_id', 'events': 1, '_id': 0 } },
            { $sort: { events: -1 } },
            { $skip: pagination && pagination.skip ? pagination.skip : 0 },
            { $limit: pagination && pagination.limit ? pagination.limit : 1000 },
        ]);
    }

    async getAvgEventsPerMinute() {
        const [res] = await this.eventModel.aggregate([
            {
                $group: {
                    _id: { $dateTrunc: { date: '$timestamp', unit: "minute", binSize: 1 } },
                    count: { $sum: 1 }
                }

            },
            { $group: { _id: null, avg_epm: { $avg: "$count" } } },
            { $project: { '_id': 0 } },

        ]);
        return res;
    }

    async getUsersVisitsSince(date: Date) {
        const [res] = await this.eventModel.aggregate([
            { $match: { 'timestamp': { $gte: date } } },
            { $group: { _id: '$user' } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { 'users_visiting_today': '$count', _id: 0 } },
        ])
        return res;
    }
}