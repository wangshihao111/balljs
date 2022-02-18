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
export type AppCtx = {
  ctx: RouterCtx;
} & Record<string, any>;

export type ObjectType = Record<string | number, any>;
