import {
  RequestMethods,
  REQUEST_METHOD_DECORATOR_KEY,
  RequestMethodDecoratorValue,
} from "../utils";

function decoratorFactory(method: RequestMethods) {
  return (path: string) => (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    const decoratorValue: RequestMethodDecoratorValue = {
      method,
      path,
    };
    Reflect.defineMetadata(
      REQUEST_METHOD_DECORATOR_KEY,
      decoratorValue,
      target,
      key
    );
  };
}

const Post = decoratorFactory("POST");
const Get = decoratorFactory("GET");
const Put = decoratorFactory("PUT");
const Delete = decoratorFactory("DELETE");
const Patch = decoratorFactory("PATCH");

export { Post, Get, Put, Delete, Patch };
