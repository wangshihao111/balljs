import { PluginApi } from '@balljs/core';
import { Connection, createServer } from 'sockjs';
import globby from 'globby';
import path from 'path';
import { createLogger } from '@balljs/utils';
import {
  SOCKET_CONTROLLER_ACTION_DECORATOR_KEY,
  SOCKET_CONTROLLER_DECORATOR_KEY,
  store,
} from './SocketController';
import { getHandlerKey } from './utils';
export * from './SocketController';

export interface PluginSocketOptions {
  prefix: string;
  dirs?: string[]; // SocketController 扫描路径
}

const logger = createLogger('PluginSocket');

export default class PluginSocket {
  private _opt: PluginSocketOptions;

  private conns: Record<string, Connection>;

  private handlersMap: Map<string, any>;

  constructor(opt: PluginSocketOptions) {
    this._opt = opt;
    this.handlersMap = new Map();
    this.conns = {};
    this.loadControllers();

    store.controllers.forEach((Controller: any) => {
      const prefix: string = Reflect.getMetadata(
        SOCKET_CONTROLLER_DECORATOR_KEY,
        Controller
      );
      const controller = Reflect.construct(Controller, []);

      Object.entries(Reflect.getPrototypeOf(controller) || {}).forEach(
        ([key, value]) => {
          const action = Reflect.getMetadata(
            SOCKET_CONTROLLER_ACTION_DECORATOR_KEY,
            controller,
            key
          );
          if (typeof action === 'string') {
            this.handlersMap.set(
              getHandlerKey(prefix, action),
              value.bind(controller)
            );
          }
        }
      );
    });
  }
  apply(api: PluginApi) {
    api.addControllers([]);
    const socketServer = createServer();
    socketServer.on('connection', (conn: Connection) => {
      if (!conn) return;
      this.conns[conn.id] = conn;
      conn.on('data', async (msg: string) => {
        logger.debug('receivedData:', msg);
        try {
          const req: { type: string; payload: any } = JSON.parse(msg);
          const { type, payload } = req;
          const handler = this.handlersMap.get(req.type);
          logger.debug('got handler', type, payload, handler);
          const success = (data: any) => {
            const res = {
              type,
              data,
              status: 'success',
            };
            conn.write(JSON.stringify(res));
          };
          const failure = (data: any) => {
            const res = {
              type,
              data,
              status: 'failed',
            };
            conn.write(JSON.stringify(res));
          };
          const progress = (data: any) => {
            const res = {
              type,
              data,
              status: 'progress',
            };
            conn.write(JSON.stringify(res));
          };
          if (handler) {
            await handler(payload, { success, failure, progress });
          }
        } catch (error) {
          console.error('cannot parse JSON.');
        }
      });
    });
    api.onInit((server) => {
      const prefix = this._opt.prefix || '/ss';
      logger.info('Socket initialized with prefix', prefix);
      socketServer.installHandlers(server, {
        prefix,
      });
    });
  }

  private loadControllers() {
    const dirs = this._opt.dirs || [];
    dirs.forEach((dir) => {
      const files = globby.sync(['**/*.ts', '**/*.js'], {
        cwd: dir,
        ignore: ['**/*.d.ts'],
      });
      files.forEach((file: string) => {
        try {
          require(path.resolve(dir, file));
        } catch (error) {
          // nothing
        }
      });
    });
  }
}
