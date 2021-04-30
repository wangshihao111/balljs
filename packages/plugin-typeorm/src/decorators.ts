import { connections } from './store';

const INJECT_CONNECTION_KEY = 'INJECT_CONNECTION_KEY';

export function InjectConnection(name: string) {
  return (target: any, key: string) => {
    console.log(target);

    Reflect.defineProperty(target, key, {
      get() {
        let value = Reflect.getMetadata(INJECT_CONNECTION_KEY, target, key);
        if (!value) {
          value = connections.get(name);
        }
        return value;
      },
    });
  };
}
