import Koa from "koa";
import Router from "@koa/router";
import { controllerFactory } from "./controllerFactory";
import { IndexController } from "../controllers/IndexController";

export interface EntryParams {
  port: number;
  // routes: any[];
}

export const createApp = (config: EntryParams) => {
  const { port } = config;
  const app = new Koa();
  const router = new Router();
  const routesMap = controllerFactory([IndexController]);
  routesMap.forEach(({ path, method, handler }) => {
    (<any>router)[method](path, handler);
  });
  app.use(router.routes()).use(router.allowedMethods());
  app.listen(port, () => {
    console.log("app is Running at: http://localhost:4200");
  });
  return app;
};
