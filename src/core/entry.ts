import Koa from "koa";
import Router from "@koa/router";
import { controllerFactory } from "./controllerFactory";
import { ControllerLoader } from "./ControllerLoader";

export interface EntryParams {
  port: number;
  controllers?: any[];
}

export const createApp = async (config: EntryParams) => {
  const { port, controllers = [] } = config;
  const app = new Koa();
  const router = new Router();

  const routesMap = controllerFactory(
    [...(await new ControllerLoader(process.cwd()).load()), ...controllers]
  );

  routesMap.forEach(({ path, method, handler }) => {
    (<any>router)[method](path, handler);
  });
  app.use(router.routes()).use(router.allowedMethods());
  app.listen(port, () => {
    console.log("app is Running at: http://localhost:4200");
  });
  return app;
};
