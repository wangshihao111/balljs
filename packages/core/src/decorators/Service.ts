import { SERVICE_DECORATOR_KEY } from '../utils';

export function Service() {
  return (target: any): any => {
    Reflect.defineMetadata(SERVICE_DECORATOR_KEY, true, target);
    return target;
  };
}
