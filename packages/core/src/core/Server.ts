import Koa from 'koa';
import Router from '@koa/router';
import { createLogger, isFirstWorker } from '@guku/utils';
import { Config } from './Config';
import { Container } from './Container';
import { GlobalMethod, PluginApi } from './PluginApi';
import Application from 'koa';
import { AppCtx } from '../utils';

const logger = createLogger('Server');

export interface ServerOptions {
  controllers?: any[];
  port?: number;
  appCtx?: AppCtx;
}

export interface StoreState {
  controllers: any[];
  middleWares: Application.Middleware[];
  globalMethods: { name: string; handler: GlobalMethod }[];
}

export class Server {
  private app: Koa;

  private config: Config;

  private container: Container;

  private options: ServerOptions;

  private store: StoreState;

  constructor(options: ServerOptions = {}) {
    this.options = options;
    this.store = {
      middleWares: [],
      globalMethods: [],
      controllers: [],
    };
    this.config = new Config();

    this.initPlugins();
    this.container = new Container(
      this.config,
      this.store,
      this.options.appCtx
    );
    this.app = new Koa();
    this.init();
  }

  private init() {
    const router = new Router();

    this.container.routesMap.forEach(({ path, method, handler }) => {
      (<any>router)[method](path, handler);
    });
    this.store.middleWares.forEach((middleware) => this.app.use(middleware));
    this.app.use(router.routes()).use(router.allowedMethods());
  }

  private initPlugins() {
    const plugins = (this.config.userConfig.plugins || [])
      .map(this.loadPlugin)
      .filter(Boolean);
    isFirstWorker() && logger.info(`Loaded ${plugins.length} Plugins.`);
    plugins.forEach((instance) => {
      instance.apply(new PluginApi(this.store));
    });
  }

  start(): void {
    const { port } = this.options;
    this.app.listen(port || 3030, () => {
      isFirstWorker() &&
        logger.success(`App is running at: http://localhost:${port}`);
    });
  }

  private loadPlugin(plugin: string) {
    // TODO: LOAD PLUGIN
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Plugin = require(plugin);
      return new Plugin();
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}
