import { Module } from '@nestjs/common';
import { MonitorModule } from './monitor/monitor.module';
import { BullModule } from '@nestjs/bull';
import { EventsProducerService } from './events/events-producer.service';
import { EventsConsumerService } from './events/events-consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { Event, EventSchema } from './database/schema/event.schema';
import { DatabaseModule } from './database/database.module';
import { Queues } from './utils/queues.enum';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      }
    }),
    BullModule.registerQueue({
      name: Queues.EventsQueue,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MonitorModule,
    DatabaseModule,
  ],
  providers: [EventsProducerService, EventsConsumerService, DatabaseService],
  exports: [BullModule]
})
export class AppModule { }


