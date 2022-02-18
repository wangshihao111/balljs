import { ParameterizedContext, Request } from 'koa';

export interface IRequest<T = any> extends Request {
  body: T;
}

export interface RouterCtx<T = any> extends ParameterizedContext {
  request: IRequest<T>;
}
