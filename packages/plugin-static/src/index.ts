import { PluginApi } from '@balljs/core';
import koaStatic, { Options } from 'koa-static';
import path from 'path';
import { createLogger, isFirstWorker } from '@balljs/utils';

const logger = createLogger('PluginStatic');

export type PluginStaticOpts = Options & {
  root: string;
};

export default class PluginSocket {
  constructor(
    private opts: PluginStaticOpts = {
      root: path.resolve(process.cwd(), 'public'),
      gzip: true,
    }
  ) {}
  apply(api: PluginApi) {
    isFirstWorker() && logger.info(`Statics served from ${this.opts.root}`);
    const { root, ...rest } = this.opts;
    api.addMiddleWares([koaStatic(root, rest)]);
  }
}
