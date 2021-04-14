import { AbstractController } from "@monkey/core/src/core/AbstractController";
import { Controller, Get, useInterceptor } from "@monkey/core/src/decorators";
import { NextFunc, RouterCtx } from '@monkey/core/src/utils';

@useInterceptor([])
@Controller("/")
export class IndexController extends AbstractController {
  age: number;
  constructor() {
    super({});
    this.age = 999;
  }

  @Get("/")
  index(ctx: RouterCtx, next: NextFunc) {
    ctx.body='hello world'
  }
}
