import { AbstractController } from "../core/AbstractController";
import { Controller, Get } from "../decorators";
import { NextFunc, RouterCtx } from '../utils';

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
