import globby from 'globby';
import { resolve } from 'path';
import { flatten, uniq } from 'lodash';
import { createLogger } from '@guku/utils';
import { Config } from './Config';
import {
  CONTROLLER_DECORATOR_KEY,
  INTERCEPTOR_DECORATOR_KEY,
  importDecorated,
  getUrlPath,
  NextFunc,
  RouterCtx,
  USE_INTERCEPTOR_DECORATOR_KEY,
  REQUEST_METHOD_DECORATOR_KEY,
  RequestMethodDecoratorValue,
  SERVICE_DECORATOR_KEY,
  AppCtx,
} from '../utils';
import { initIoc, inject } from './ioc';
import { CommonInterceptor } from '../decorators';
import { StoreState } from './Server';

const logger = createLogger('Container');

export class Container {
  private loadedControllers: any[];

  private loadedInterceptors: any[];

  private config;

  private store: StoreState;

  public readonly routesMap: any[];

  private appCtx: AppCtx;

  constructor(config: Config, store: StoreState, appCtx: AppCtx = {}) {
    this.config = config;
    this.store = store;
    this.loadedControllers = [];
    this.loadedControllers = this.loadDecorated('controllers');
    this.loadedInterceptors = this.loadDecorated('interceptors');
    this.appCtx = appCtx;
    this.registerGlobalMethods();
    initIoc({
      providers: [
        ...this.loadedInterceptors,
        ...this.loadDecorated('services'),
        {
          provide: 'config',
          useValue: Object.freeze(this.config),
        },
      ],
    });
    this.routesMap = this.runFactory();
  }

  private loadDecorated(type: 'controllers' | 'interceptors' | 'services') {
    const {
      workDir,
      cwd,
      userConfig: { paths: configPaths = {} },
    } = this.config;
    const keyMap = {
      controllers: CONTROLLER_DECORATOR_KEY,
      interceptors: INTERCEPTOR_DECORATOR_KEY,
      services: SERVICE_DECORATOR_KEY,
    };
    const paths = [
      resolve(workDir, type),
      ...(configPaths[type] || []),
    ].map((p) => resolve(cwd, p));
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
      const controller = Reflect.construct(Controller, [
        Object.freeze(this.appCtx),
      ]);
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

  private createRequestHandler(interceptors: any[], oldHandler: any) {
    const handlers: any[] = [];
    // TODO: process afterHooks
    interceptors.forEach((i) => {
      const instance = inject<CommonInterceptor>(i);
      handlers.push(instance.beforeHandle);
    });
    return async (ctx: RouterCtx, next: NextFunc): Promise<void> => {
      ctx.appCtx = Object.freeze(this.appCtx);
      try {
        for (const handler of handlers) {
          await handler(ctx);
        }
        await oldHandler(ctx, next);
      } catch (error) {
        ctx.status = error.status || 400;
        ctx.body = error.message;
      }
    };
  }

  private registerGlobalMethods() {
    const { globalMethods = [] } = this.store;
    globalMethods.forEach(({ name, handler }) => {
      (<any>this.appCtx)[name] = handler;
    });
  }
}
