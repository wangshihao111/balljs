import {
  BadRequestException,
  CommonInterceptor,
  Interceptor,
  RouterCtx,
} from '@balljs/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async request(ctx: RouterCtx): Promise<void> {
    if (!ctx.query.name) {
      throw new BadRequestException();
    }
  }
  response() {
    throw new Error('Method not implemented.');
  }
}
