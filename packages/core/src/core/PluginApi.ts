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

export class PluginApi {
  private store: StoreState;

  constructor(store: StoreState) {
    this.store = store;
  }

  /**
   * addMiddleWares
   */
  public addMiddleWares(middleWares: Application.Middleware[]) {
    this.store.middleWares.push(...middleWares);
  }
}

export interface IPlugin {
  apply(api: PluginApi): void;
}
