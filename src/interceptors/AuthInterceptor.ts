import {
  BadRequestException,
  CommonInterceptor,
  Interceptor,
  RouterCtx,
} from '@balljs/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async beforeHandle(ctx: RouterCtx): Promise<void> {
    if (!ctx.query.name) {
      throw new BadRequestException();
    }
  }
  afterHandle() {
    throw new Error('Method not implemented.');
  }
}
