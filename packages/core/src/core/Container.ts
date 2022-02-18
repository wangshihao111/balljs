import globby from 'globby';
import { resolve } from 'path';
import fs from 'fs';
import { flatten, uniq } from 'lodash';
import { createLogger, isFirstWorker } from '@balljs/utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import properties from 'properties';
import { Config } from './Config';
import {
  CONTROLLER_DECORATOR_KEY,
  INTERCEPTOR_DECORATOR_KEY,
  importDecorated,
  getUrlPath,
  USE_INTERCEPTOR_DECORATOR_KEY,
  REQUEST_METHOD_DECORATOR_KEY,
  SERVICE_DECORATOR_KEY,
  getWorkDirectory,
} from '../utils';

import {
  RequestMethodDecoratorValue,
  RouterCtx,
  NextFunc,
  AppCtx,
} from '../types';
import { initIoc, inject } from './ioc';
import { CommonInterceptor } from '../decorators';
import { StoreState } from './Server';

const logger = createLogger('Container');

export class Container {
  private loadedControllers: any[];

  private loadedInterceptors: any[];

  public readonly routesMap: any[];

  private properties: any;

  constructor(
    private config: Config,
    private store: StoreState,
    private appCtx: AppCtx = { ctx: {} as any }
  ) {
    const { userConfig } = config;
    this.loadedControllers = [];
    this.properties = this.loadProperties();
    this.loadedControllers = uniq([
      ...this.loadDecorated('controllers'),
      ...(userConfig.controllers || []),
      ...store.controllers,
    ]);
    this.loadedInterceptors = uniq([
      ...this.loadDecorated('interceptors'),
      ...(userConfig.interceptors || []),
      ...store.interceptors,
    ]);
    this.registerAppCtx();
    initIoc({
      providers: [
        ...this.loadedInterceptors,
        ...uniq([
          ...this.loadDecorated('services'),
          ...(userConfig.services || []),
          ...store.services,
        ]),
        {
          provide: 'config',
          useValue: Object.freeze(this.config),
        },
        {
          provide: '__properties',
          useValue: Object.freeze(this.properties),
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
    isFirstWorker() && logger.info(`Loaded ${allClass.length} ${type}.`);
    return allClass;
  }

  private runFactory() {
    const routesMap: { path: string; method: string; handler: any }[] = [];
    this.loadedControllers.forEach((Controller) => {
      if (!Reflect.hasOwnMetadata(CONTROLLER_DECORATOR_KEY, Controller)) {
        throw new Error('Invalid Controller.');
      }
      const basePath = Reflect.getMetadata(
        CONTROLLER_DECORATOR_KEY,
        Controller
      );
      const controller = Reflect.construct(Controller, [this.appCtx]);
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
    const responseHandler: any[] = [];
    // TODO: process response interceptor
    interceptors.forEach((i) => {
      const instance = inject<CommonInterceptor>(i);
      if (instance.request) {
        handlers.push(instance.request.bind(instance));
      }
      if (instance.response) {
        responseHandler.push(instance.response.bind(instance));
      }
    });
    return async (ctx: RouterCtx, next: NextFunc): Promise<void> => {
      const appCtx = Object.create(this.appCtx);
      appCtx.ctx = ctx;
      ctx.appCtx = appCtx;
      try {
        for (const handler of handlers) {
          await handler(ctx);
        }
        await oldHandler(ctx, next);
        for (const handler of responseHandler) {
          await handler(ctx);
        }
      } catch (error: any) {
        ctx.status = error.status || 400;
        ctx.body = error.message;
      }
    };
  }

  private registerAppCtx() {
    const { globalMethods = [], appCtx } = this.store;
    globalMethods.forEach(({ name, handler }) => {
      (<any>this.appCtx)[name] = handler;
    });
    Object.entries(appCtx).forEach(([key, field]) => {
      this.appCtx[key] = field;
    });
  }

  private loadProperties() {
    const target = `app${
      process.env.SERVER_APP_ENV
        ? '.' + process.env.SERVER_APP_ENV.toLowerCase()
        : ''
    }.properties`;
    const loadEnvContent = (file: string): any => {
      const path = resolve(this.config.cwd, getWorkDirectory(), file);
      try {
        const fileContent = fs.readFileSync(path, 'utf8');
        return properties.parse(fileContent, { namespaces: true });
      } catch (error) {
        // nothing
        return {};
      }
    };
    const baseProps = loadEnvContent('app.properties');
    const envProps = loadEnvContent(target);
    return {
      ...baseProps,
      ...envProps,
    };
  }
}
