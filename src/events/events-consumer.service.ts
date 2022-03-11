import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Queues } from '../utils/queues.enum';
import { DatabaseService } from '../database/database.service';

@Processor(Queues.EventsQueue)
export class EventsConsumerService {
    constructor(private eventService: DatabaseService) { }

    @Process(Queues.JobName)
    async fetchAndStoreNextEvent(job: Job) {

        await this.eventService.createEvent(JSON.parse(job.data));
        console.log(
            `Processing ${job.name} with job-id ${job.id} and data ${job.data}`,
        );
    }

}