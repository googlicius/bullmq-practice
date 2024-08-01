import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/add-noti')
  addNoti(@Body('mes') message: string) {
    this.appService.addNotification(message);

    return {
      ok: 'OK',
    };
  }
}
