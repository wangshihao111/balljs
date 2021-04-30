import { IConfig } from '@guku/core';
import PluginSocket from '@guku/plugin-socket';
import PluginTypeOrm from '@guku/plugin-typeorm';
import path from 'path';

export default {
  plugins: [
    require.resolve('../plugin.js'),
    '@guku/plugin-static',
    '@guku/plugin-cors',
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
