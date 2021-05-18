import { Controller, Get, RouterCtx, autoWired, AppCtx } from '@balljs/core';
import { AppService } from '../services/AppService';

@Controller('/')
export class IndexController {
  age: number;

  @autoWired(AppService)
  appService!: AppService;

  constructor(private appCtx: AppCtx) {
    this.age = 999;
  }

  @Get('/')
  index(ctx: RouterCtx) {
    ctx.body = this.appService.generateHello();
  }
}
