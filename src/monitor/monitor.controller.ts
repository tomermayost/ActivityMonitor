import { Body, Controller, Post } from '@nestjs/common';
import { EventDto } from './dto';
import { MonitorService } from './monitor.service';
@Controller('monitor')
export class MonitorController {
    constructor(private monitorService: MonitorService) { }
    @Post('event')
    registerEvent(@Body() eventDto: EventDto) {
        return this.monitorService.registerEvent()
    }
}
