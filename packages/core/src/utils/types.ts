import Router from '@koa/router';
import { Next, ParameterizedContext } from 'koa';

export type RequestMethods = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';

export type RouterCtx = ParameterizedContext<
  any,
  Router.RouterParamContext<any, any>,
  any
> & {
  appCtx: AppCtx;
};

export type NextFunc = Next;

export interface RequestMethodDecoratorValue {
  method: RequestMethods;
  path: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppCtx {
  name?: string;
}
