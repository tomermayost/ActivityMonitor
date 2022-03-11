import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventDto } from './dto';
import { MonitorService } from './monitor.service';

@Controller('api/monitor')
export class MonitorController {
    constructor(private monitorService: MonitorService) { }

    @Post('event')
    async registerEvent(@Body() dto: EventDto) {
        await this.monitorService.registerEvent(dto);
        return dto;
    }

    @Get('event')
    async getEvents() {
        return await this.monitorService.getEvents()
    }

    @Get('event/all')
    async getAllEvents() {
        return await this.monitorService.getAllEvents()
    }
}
