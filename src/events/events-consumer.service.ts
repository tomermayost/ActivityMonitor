import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Queues } from '../utils/queues.enum';
import { DatabaseService } from '../database/database.service';
import { Logger } from '@nestjs/common';

@Processor(Queues.EventsQueue)
export class EventsConsumerService {
    private readonly logger = new Logger(EventsConsumerService.name)
    constructor(private dbService: DatabaseService) { }

    @Process(Queues.JobName)
    async fetchAndStoreNextEvent(job: Job) {
        await this.dbService.createEvent(JSON.parse(job.data));
        this.logger.debug(
            `Processed ${job.name} with job-id ${job.id} and data ${job.data}`,
        );
    }
}