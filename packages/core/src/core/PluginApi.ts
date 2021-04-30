/*
  Demo Plugin:
  class MyPlugin {
    apply(api: PluginApi) {
      console.log(api);
    }
  }
*/

import Application from 'koa';
import http from 'http';
import https from 'https';
import { StoreState } from './Server';

export type GlobalMethod = () => void;

export class PluginApi {
  constructor(private store: StoreState) {}

  /**
   * addMiddleWares 添加一个Koa中间价
   */
  public addMiddleWares(middleWares: Application.Middleware[]) {
    this.store.middleWares.push(...middleWares);
  }

  /**
   * addGlobalMethod 添加一个全局方法，例如模板渲染函数
   */
  public addGlobalMethod(methodConfig: {
    name: string;
    handler: GlobalMethod;
  }) {
    this.store.globalMethods.push(methodConfig);
  }

  /**
   * addControllers
   */
  public addControllers(controllers: any[]) {
    this.store.controllers.push(...controllers);
  }

  /**
   * onInit
   */
  public onInit(handler: (server: http.Server | https.Server) => void): void {
    if (typeof handler !== 'function') {
      throw new Error('handler must be function');
    }
    this.store.hooks.onInit.push(handler);
  }
}

export interface IPlugin {
  apply(api: PluginApi): void;
}
