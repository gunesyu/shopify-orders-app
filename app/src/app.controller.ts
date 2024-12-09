import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  test(): string {
    return 'OK';
  }

  @Get()
  getHello(@Query('shop') shop: string) {
    return this.appService.getHello(shop);
  }
}
