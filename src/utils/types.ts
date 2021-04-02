import Router from '@koa/router';
import { Next, ParameterizedContext } from 'koa';

export type RequestMethods = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';

export type RouterCtx = ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>;

export type NextFunc = Next;