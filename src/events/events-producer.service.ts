import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EventDto } from '../monitor/dto';
import { Queues } from '../utils/queues.enum';

@Injectable()
export class EventsProducerService {
    constructor(@InjectQueue(Queues.EventsQueue) private eventsQueue: Queue) { }

    async produceEvent(event: EventDto) {
        await this.eventsQueue.add(Queues.JobName, JSON.stringify(event))
    }

}
