import { CONTROLLER_DECORATOR_KEY } from '../utils';

export function Controller(basePath?: string) {
  return (target: any) => {
    Reflect.defineMetadata(CONTROLLER_DECORATOR_KEY, basePath || '/' , target);
    return target;
  }
}