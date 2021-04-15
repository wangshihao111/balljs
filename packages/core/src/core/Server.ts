import Koa from 'koa';
import Router from '@koa/router';
import { createLogger } from '@guku/utils';
import { Config } from './Config';
import { Container } from './Container';

const logger = createLogger('Server');

export interface ServerOptions {
  controllers?: any[];
  port?: number;
}

export class Server {
  private app: Koa;

  private config: Config;

  private container: Container;

  private options: ServerOptions;

  constructor(options: ServerOptions = {}) {
    this.options = options;
    this.config = new Config();
    this.container = new Container(this.config);
    this.app = new Koa();
    this.init();
  }

  private init() {
    const router = new Router();

    this.container.routesMap.forEach(({ path, method, handler }) => {
      (<any>router)[method](path, handler);
    });
    this.app.use(router.routes()).use(router.allowedMethods());
  }

  start(): void {
    const { port } = this.options;
    this.app.listen(port || 3030, () => {
      logger.success(`App is running at: http://localhost:${port}`);
    });
  }
}
