import { Controller, Get, HttpCode } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('teapot')
  @HttpCode(418)
  teapot(): string {
    return this.appService.teapot()
  }
}
