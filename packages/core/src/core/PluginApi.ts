/*
  Demo Plugin:
  class MyPlugin {
    apply(api: PluginApi) {
      console.log(api);
    }
  }
*/

import Application from 'koa';
import { StoreState } from './Server';

export type GlobalMethod = () => void;

export class PluginApi {
  private store: StoreState;

  constructor(store: StoreState) {
    this.store = store;
  }

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
}

export interface IPlugin {
  apply(api: PluginApi): void;
}
