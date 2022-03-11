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

    async registerEvent(dto: EventDto) {
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

    async getEvents() {
        return await this.dbServeice.getEventCountByUser();
    }

    async getAllEvents() {
        return await this.dbServeice.getAllEvents();
    }
}
