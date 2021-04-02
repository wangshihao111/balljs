import { RequestMethods, RequestMethodDecoratorKey } from "../utils";

function decoratorFactory(method: RequestMethods) {
  return (path: string) => (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(RequestMethodDecoratorKey[method], path, target, key);
  };
}

const Post = decoratorFactory("POST");
const Get = decoratorFactory("GET");
const Put = decoratorFactory("PUT");
const Delete = decoratorFactory("DELETE");
const Patch = decoratorFactory("PATCH");

export { Post, Get, Put, Delete, Patch };
