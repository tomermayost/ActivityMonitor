import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';

@Module({
  controllers: [MonitorController],
  providers: [MonitorService, PrismaService]
})
export class MonitorModule { }
