import {
  AbstractController,
  Controller,
  Get,
  useInterceptor,
  NextFunc,
  RouterCtx,
  autoWired,
} from '@guku/core';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';
import { DBService } from '../services/DBService';
import { UserService } from '../services/UserService';

@useInterceptor([AuthInterceptor])
@Controller('/')
export class IndexController extends AbstractController {
  age: number;

  @autoWired(UserService)
  userService!: UserService;

  @autoWired(DBService)
  db!: DBService;

  constructor() {
    super({});
    this.age = 999;
  }

  @Get('/')
  index(ctx: RouterCtx, next: NextFunc) {
    console.log(
      this.userService,
      this.db.user,
      this.userService === this.db.user
    );
    ctx.body = 'hello world';
  }
}
