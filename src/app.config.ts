import { IConfig } from '@balljs/core';
import PluginSocket from '@balljs/plugin-socket';
import PluginTypeOrm from '@balljs/plugin-typeorm';
import path from 'path';

export default {
  plugins: [
    require.resolve('../plugin.js'),
    '@balljs/plugin-static',
    '@balljs/plugin-cors',
    new PluginSocket({
      prefix: '/socket',
      dirs: [path.resolve(__dirname, './socketControllers')],
    }),
    new PluginTypeOrm({ connsConfig: [] }),
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
