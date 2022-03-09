import { Module } from '@nestjs/common';
import { MonitorModule } from './monitor/monitor.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [MonitorModule, PrismaModule],
  providers: [PrismaService],
})
export class AppModule { }
