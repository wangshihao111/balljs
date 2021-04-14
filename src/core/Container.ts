import { createPool, Injector } from "some-di";
import globby from "globby";
import { resolve } from "path";
import { flatten, uniq } from "lodash";
import { AbstractController } from "./AbstractController";
import { Config } from "./Config";
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
} from "../utils";

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
    this.loadedControllers = this.loadDecorated("controllers");
    this.loadedInterceptors = this.loadDecorated("interceptors");
    const { inject, Inject, container } = createPool({
      providers: [...this.loadedInterceptors],
    });
    this.inject = inject;
    this.routesMap = this.runFactory();
  }

  private loadDecorated(type: "controllers" | "interceptors") {
    const { workDir, cwd } = this.config;
    const keyMap = {
      controllers: CONTROLLER_DECORATOR_KEY,
      interceptors: INTERCEPTOR_DECORATOR_KEY,
    };
    const paths = [resolve(workDir, type)].map((p) => resolve(cwd, p));
    const files = flatten(
      paths.map((p) => {
        const list = globby.sync(["**/*.js", "**/*.ts"], {
          cwd: p,
          ignore: ["**/*.d.ts"],
        });
        return list.map((item) => resolve(p, item));
      })
    );
    const allClass = flatten(
      files.map((file) => importDecorated(file, keyMap[type]))
    );
    return allClass;
  }

  private runFactory() {
    const routesMap: { path: string; method: string; handler: any }[] = [];
    this.loadedControllers.forEach((Controller) => {
      if (!Reflect.hasOwnMetadata(CONTROLLER_DECORATOR_KEY, Controller)) {
        console.log(Controller);
        
        throw new Error("Invalid Controller.", );
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
            const handler = async (ctx: RouterCtx, next: NextFunc) => {
              for (const interceptor of interceptors) {
                const interceptorInstance = Reflect.construct(interceptor, []);
              }
            };
            routesMap.push({
              path: getUrlPath(basePath, path),
              method: method.toLowerCase(),
              handler: value.bind(controller),
            });
          }
        }
      );
    });
    return routesMap;
  }
}
