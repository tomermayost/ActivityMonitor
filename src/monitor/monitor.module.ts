import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsProducerService } from '../events/events-producer.service';
import { DatabaseService } from '../database/database.service';
import { Event, EventSchema } from '../database/schema/event.schema';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'events',
    }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
  ],

  controllers: [MonitorController],
  providers: [MonitorService, EventsProducerService, DatabaseService]
})
export class MonitorModule { }
