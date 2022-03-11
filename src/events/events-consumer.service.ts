import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Queues } from '../utils/queues.enum';
import { DatabaseService } from '../database/database.service';

@Processor(Queues.EventsQueue)
export class EventsConsumerService {
    constructor(private dbService: DatabaseService) { }

    @Process(Queues.JobName)
    async fetchAndStoreNextEvent(job: Job) {
        await this.dbService.createEvent(JSON.parse(job.data));
        console.log(
            `Processed ${job.name} with job-id ${job.id} and data ${job.data}`,
        );
    }

}