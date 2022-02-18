import { inject } from '../core';
import { ObjectType } from '../types';

export function injectValue<T = ObjectType>(key: string): T {
  return (inject<any>('__properties') || {})[key];
}
