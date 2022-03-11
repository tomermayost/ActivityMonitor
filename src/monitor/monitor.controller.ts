import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EventDto } from './dto';
import { MonitorService } from './monitor.service';

@Controller('api/monitor')
export class MonitorController {
    constructor(private monitorService: MonitorService) { }

    @Post('events')
    async registerEvent(@Body() dto: EventDto) {
        await this.monitorService.queueEvent(dto);
        return dto;
    }

    @Get('events/user')
    async getEventsPerUser(
        @Query('skip') skip: string, @Query('limit') limit: string) {
        return await this.monitorService.getEventsPerUser({ skip: parseInt(skip), limit: parseInt(limit) })
    }

    @Get('events/avg_epm')
    async getAvgEventsPerMinute() {
        return await this.monitorService.getAvgEventsPerMinute()
    }

    @Get('user/visits')
    async getUsersVisitingToday() {
        return await this.monitorService.getUsersVisitingToday();
    }
}
