import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventsProducerService } from '../events/events-producer.service';
import { DatabaseService } from '../database/database.service';
import { EventDto } from './dto';


@Injectable()
export class MonitorService {
    constructor(
        private eventsProducer: EventsProducerService,
        private dbServeice: DatabaseService
    ) { }

    async queueEvent(dto: EventDto) {
        try {
            enrichEventWithTimestamp();
            await this.eventsProducer.produceEvent(dto)
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException("something went wrong.. please check the logs for further details");
        }

        function enrichEventWithTimestamp() {
            dto.timestamp = new Date();
        }
    }

    async getEventsPerUser(pagination?: { skip?: number, limit?: number }) {
        const startOfDay = this.getStartOfDay()
        return await this.dbServeice.getEventCountByUser(startOfDay, pagination);
    }

    async getAvgEventsPerMinute() {
        return await this.dbServeice.getAvgEventsPerMinute()
    }

    async getUsersVisitingToday() {
        const startOfDay = this.getStartOfDay()
        return await this.dbServeice.getUsersVisitsSince(startOfDay);
    }

    private getStartOfDay() {
        return new Date(new Date().setUTCHours(0, 0, 0, 0));
    }
}
