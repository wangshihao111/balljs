import {
  AbstractController,
  Controller,
  Get,
  useInterceptor,
  NextFunc,
  RouterCtx,
} from '@monkey/core';

@useInterceptor([])
@Controller('/')
export class IndexController extends AbstractController {
  age: number;
  constructor() {
    super({});
    this.age = 999;
  }

  @Get('/')
  index(ctx: RouterCtx, next: NextFunc) {
    ctx.body = 'hello world';
  }
}
