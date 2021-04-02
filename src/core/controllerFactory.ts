import "reflect-metadata";
import {
  CONTROLLER_DECORATOR_KEY,
  getUrlPath,
  RequestMethodDecoratorKey,
  RequestMethodEnum,
} from "../utils";

export function controllerFactory(controllers: (new () => any)[]) {
  const routesMap: {path: string, method: string, handler: any}[]= [];
  controllers.forEach((Controller) => {
    if (!Reflect.hasOwnMetadata(CONTROLLER_DECORATOR_KEY, Controller)) {
      throw new Error("Invalid Controller.");
    }
    const basePath = Reflect.getMetadata(CONTROLLER_DECORATOR_KEY, Controller);
    const controller = Reflect.construct(Controller, []);
    Object.entries(Reflect.getPrototypeOf(controller) || {}).forEach(
      ([key, value]) => {
        [
          RequestMethodEnum.DELETE,
          RequestMethodEnum.GET,
          RequestMethodEnum.POST,
          RequestMethodEnum.PATCH,
          RequestMethodEnum.PUT,
        ].forEach((method) => {
          const metadataKey = RequestMethodDecoratorKey[method];
          if (Reflect.hasMetadata(metadataKey, controller, key)) {
            const path = Reflect.getMetadata(metadataKey, controller, key);            
            routesMap.push({path: getUrlPath(basePath, path), method: method.toLowerCase(), handler: value.bind(controller)})
          }
        });
      }
    );
  });
  return routesMap;
}

