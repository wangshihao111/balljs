import { CommonInterceptor, Interceptor, RouterCtx } from '@guku/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async beforeHandle(ctx: RouterCtx): Promise<void> {
    console.log('before', ctx);
  }
  afterHandle() {
    throw new Error('Method not implemented.');
  }
}
