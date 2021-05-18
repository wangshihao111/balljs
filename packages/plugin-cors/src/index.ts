import { PluginApi } from '@balljs/core';
import cors, { Options } from '@koa/cors';

export type PluginCorsOpts = Options;

export default class PluginSocket {
  constructor(private opts: PluginCorsOpts) {}
  apply(api: PluginApi) {
    api.addMiddleWares([cors(this.opts)]);
  }
}
