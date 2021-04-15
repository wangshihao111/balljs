import {
  Controller,
  Get,
  useInterceptor,
  RouterCtx,
  autoWired,
  AppCtx,
} from '@guku/core';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';
import { DBService } from '../services/DBService';
import { UserService } from '../services/UserService';

@useInterceptor([AuthInterceptor])
@Controller('/')
export class IndexController {
  age: number;

  @autoWired(UserService)
  userService!: UserService;

  @autoWired(DBService)
  db!: DBService;

  constructor(private appCtx: AppCtx) {
    this.age = 999;
  }

  @Get('/')
  index(ctx: RouterCtx) {
    console.log(this.appCtx);
    console.log(
      this.userService,
      this.db.user,
      this.userService === this.db.user
    );
    ctx.body = 'hello world';
  }
}
