import { IConfig } from '@guku/core';
import PluginSocket from '@guku/plugin-socket';
import path from 'path';

export default {
  plugins: [
    require.resolve('../plugin.js'),
    '@guku/plugin-static',
    new PluginSocket({
      prefix: '/socket',
      dirs: [path.resolve(__dirname, './socketControllers')],
    }),
  ],
  /**
   * 扫描路径
   */
  paths: {
    controllers: [],
    interceptors: [],
    services: [],
  },
} as IConfig;
