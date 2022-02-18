import { Next } from 'koa';
import { RouterCtx } from './context';

export type RequestMethods = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';

export type NextFunc = Next;

export interface RequestMethodDecoratorValue {
  method: RequestMethods;
  path: string;
}

export type AppCtx = {
  ctx: RouterCtx;
} & Record<string, any>;

export type ObjectType = Record<string | number, any>;
