import { Injector } from 'some-di';
import globby from 'globby';
import { resolve } from 'path';
import { flatten, uniq } from 'lodash';
import { Config } from './Config';
import {
  CONTROLLER_DECORATOR_KEY,
  INTERCEPTOR_DECORATOR_KEY,
  importDecorated,
  getUrlPath,
  NextFunc,
  // RequestMethodDecoratorKey,
  // RequestMethodEnum,
  RouterCtx,
  USE_INTERCEPTOR_DECORATOR_KEY,
  REQUEST_METHOD_DECORATOR_KEY,
  RequestMethodDecoratorValue,
  SERVICE_DECORATOR_KEY,
  createLogger,
} from '../utils';
import { initIoc, inject } from './ioc';

const logger = createLogger('Container');

export class Container {
  private loadedControllers: any[];

  private loadedInterceptors: any[];

  private interceptorMap: Map<any, any>;

  private config;

  private inject: Injector;

  public readonly routesMap: any[];

  constructor(config: Config) {
    this.loadedControllers = [];
    this.interceptorMap = new Map();
    this.config = config;
    this.loadedControllers = this.loadDecorated('controllers');
    this.loadedInterceptors = this.loadDecorated('interceptors');
    initIoc({
      providers: [
        ...this.loadedInterceptors,
        ...this.loadDecorated('services'),
      ],
    });
    this.inject = inject;
    this.routesMap = this.runFactory();
  }

  private loadDecorated(type: 'controllers' | 'interceptors' | 'services') {
    const { workDir, cwd } = this.config;
    const keyMap = {
      controllers: CONTROLLER_DECORATOR_KEY,
      interceptors: INTERCEPTOR_DECORATOR_KEY,
      services: SERVICE_DECORATOR_KEY,
    };
    const paths = [resolve(workDir, type)].map((p) => resolve(cwd, p));
    const files = flatten(
      paths.map((p) => {
        const list = globby.sync(['**/*.js', '**/*.ts'], {
          cwd: p,
          ignore: ['**/*.d.ts'],
        });
        return list.map((item) => resolve(p, item));
      })
    );
    const allClass = uniq(
      flatten(files.map((file) => importDecorated(file, keyMap[type])))
    );
    logger.info(`Loaded ${allClass.length} ${type}.`);
    return allClass;
  }

  private runFactory() {
    const routesMap: { path: string; method: string; handler: any }[] = [];
    this.loadedControllers.forEach((Controller) => {
      if (!Reflect.hasOwnMetadata(CONTROLLER_DECORATOR_KEY, Controller)) {
        console.log(Controller);
        throw new Error('Invalid Controller.');
      }
      const basePath = Reflect.getMetadata(
        CONTROLLER_DECORATOR_KEY,
        Controller
      );
      const controller = Reflect.construct(Controller, []);
      const interceptors: any[] = uniq(
        Reflect.getMetadata(USE_INTERCEPTOR_DECORATOR_KEY, Controller) || []
      );

      Object.entries(Reflect.getPrototypeOf(controller) || {}).forEach(
        ([key, value]) => {
          if (
            Reflect.hasMetadata(REQUEST_METHOD_DECORATOR_KEY, controller, key)
          ) {
            const {
              path,
              method,
            }: RequestMethodDecoratorValue = Reflect.getMetadata(
              REQUEST_METHOD_DECORATOR_KEY,
              controller,
              key
            );
            const handler = this.createRequestHandler(
              interceptors,
              value.bind(controller)
            );
            routesMap.push({
              path: getUrlPath(basePath, path),
              method: method.toLowerCase(),
              handler,
            });
          }
        }
      );
    });
    return routesMap;
  }

  createRequestHandler(interceptors: any[], oldHandler: any) {
    // TODO: use interceptors
    return async (ctx: RouterCtx, next: NextFunc): Promise<void> => {
      oldHandler(ctx, next);
    };
  }
}
