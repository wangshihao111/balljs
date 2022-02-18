// import { inject } from '../core';
import { VALUE_DECORATOR_KEY } from '../utils';
import { injectValue } from '../utils/injections';

export function Value(valueKey: string, defaultValue?: string) {
  return (target: any, key: string) => {
    Object.defineProperties(target, {
      [key]: {
        get() {
          let value = Reflect.getMetadata(VALUE_DECORATOR_KEY, target, key);
          if (!value) {
            value = injectValue(valueKey);
            Reflect.defineMetadata(
              VALUE_DECORATOR_KEY,
              value || defaultValue,
              target,
              key
            );
          }
          return value;
        },
        set() {
          // nothing
        },
      },
    });
  };
}
