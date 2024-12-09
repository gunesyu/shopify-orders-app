import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  test(): string {
    return 'OK';
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
