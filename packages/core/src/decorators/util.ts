import { inject } from '../core/ioc';
import { AUTO_WIRED_DECORATOR_KEY } from '../utils';

export function autoWired(cls: new () => any): any {
  const metadataValue = {
    value: null,
  };
  return (target: any, key: string) => {
    Reflect.defineMetadata(
      AUTO_WIRED_DECORATOR_KEY,
      metadataValue,
      target,
      key
    );
    Object.defineProperties(target, {
      [key]: {
        get() {
          let curValue = Reflect.getMetadata(
            AUTO_WIRED_DECORATOR_KEY,
            target,
            key
          )?.value;
          if (!curValue) {
            // inject value
            curValue = inject(cls);
            const newMetadataValue = {
              value: curValue, // 使用注入器注入值
            };
            Reflect.defineMetadata(
              AUTO_WIRED_DECORATOR_KEY,
              newMetadataValue,
              target,
              key
            );
          }
          return curValue;
        },
      },
    });
  };
}
