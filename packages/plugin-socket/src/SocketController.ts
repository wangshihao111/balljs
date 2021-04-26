export const SOCKET_CONTROLLER_DECORATOR_KEY =
  'PLUGIN_SOCKET_CONTROLLER_DECORATOR_KEY';

export const SOCKET_CONTROLLER_ACTION_DECORATOR_KEY =
  'SOCKET_CONTROLLER_ACTION_DECORATOR_KEY';

export type SocketControllerDecoratorValue = {};

export type SocketPluginStore = {
  controllers: any[];
};

export const store: SocketPluginStore = {
  controllers: [],
};

export function SocketController(prefix: string) {
  return (target: any) => {
    store.controllers.push(target);
    Reflect.defineMetadata(SOCKET_CONTROLLER_DECORATOR_KEY, prefix, target);
  };
}

export function Action(type: string) {
  return (target: any, key: string) => {
    Reflect.defineMetadata(
      SOCKET_CONTROLLER_ACTION_DECORATOR_KEY,
      type,
      target,
      key
    );
  };
}
