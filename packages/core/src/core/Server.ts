import Koa from 'koa';
import Router from '@koa/router';
import { createLogger } from '../utils';
// import { controllerFactory } from "./controllerFactory";
// import { ControllerLoader } from "./ControllerLoader";
import { Config } from './Config';
import { Container } from './Container';

const logger = createLogger('Server');

export interface ServerOptions {
  controllers?: any[];
}

export class Server {
  private app: Koa;

  private config: Config;

  private container: Container;

  private options: ServerOptions;

  constructor(options: ServerOptions) {
    this.options = options;
    this.config = new Config();
    this.container = new Container(this.config);
    this.app = new Koa();
    this.init();
  }

  private async init() {
    const router = new Router();

    this.container.routesMap.forEach(({ path, method, handler }) => {
      (<any>router)[method](path, handler);
    });
    this.app.use(router.routes()).use(router.allowedMethods());
  }

  start(port = 3000): void {
    this.app.listen(port, () => {
      logger.success(`App is running at: http://localhost:${port}`);
    });
  }
}
