import {
  INTERCEPTOR_DECORATOR_KEY,
  USE_INTERCEPTOR_DECORATOR_KEY,
} from '../utils';
import { RouterCtx } from '../types';

export function Interceptor() {
  return (target: any) => {
    Reflect.defineMetadata(INTERCEPTOR_DECORATOR_KEY, {}, target);
  };
}

export function useInterceptor(interceptors: any[]) {
  return (target: any) => {
    Reflect.defineMetadata(USE_INTERCEPTOR_DECORATOR_KEY, interceptors, target);
  };
}

export interface CommonInterceptor {
  request(ctx: RouterCtx): any;
  response?: (ctx: RouterCtx) => any;
}
