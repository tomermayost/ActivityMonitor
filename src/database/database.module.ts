import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/event.schema';
import { Queues } from '../utils/queues.enum';
import { DatabaseService } from './database.service';



@Module({
  imports: [BullModule.registerQueue({
    name: Queues.EventsQueue,
  }),
  MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService]

})
export class DatabaseModule { }
