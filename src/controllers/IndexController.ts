import { AbstractController } from "../core/AbstractController";
import { Controller, Get, useInterceptor } from "../decorators";
import { NextFunc, RouterCtx } from '../utils';

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
