import {
  Controller,
  Get,
  useInterceptor,
  RouterCtx,
  autoWired,
  AppCtx,
  Post,
  Value,
} from '@balljs/core';
import { InjectConnection } from '@balljs/plugin-typeorm';
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

  @Value('appName')
  appName!: string;

  @Value('server')
  server!: any;

  @InjectConnection('test')
  connection: any;

  constructor(private appCtx: AppCtx) {
    this.age = 999;
  }

  @Get('/hello')
  index(ctx: RouterCtx) {
    console.log('Value appName', this.appName, this.server);
    console.log(this.appCtx.orm, this.connection);
    console.log(
      this.userService,
      this.db.user,
      this.userService === this.db.user
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log(ctx.appCtx.render?.(), ctx.appCtx.ctx.request.query);

    ctx.appCtx.ctx.body = ctx.body + 'hello world';
  }
  @Post('/hello')
  postIndex(ctx: RouterCtx) {
    ctx.body = ctx.request.body;
  }
}
