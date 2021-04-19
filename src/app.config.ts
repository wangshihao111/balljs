import { IConfig } from '@guku/core';

export default {
  plugins: [require.resolve('../plugin.js')],
  /**
   * 扫描路径
   */
  paths: {
    controllers: [],
    interceptors: [],
    services: [],
  },
} as IConfig;
