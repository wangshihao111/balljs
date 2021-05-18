import { PluginApi } from '@balljs/core';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { setConnections } from './store';

export * from './decorators';

export default class PluginTypeOrm {
  connections: Map<string, Connection>;

  constructor(
    private opts: {
      connsConfig: { name: string; config: ConnectionOptions }[];
    }
  ) {
    this.connections = new Map();
  }
  async apply(api: PluginApi) {
    await Promise.all(
      this.opts.connsConfig.map(async ({ name, config }) => {
        this.connections.set(name, await createConnection(config));
      })
    );
    setConnections(this.connections);
    api.addAppCtx({
      name: 'orm',
      field: {
        getConnection: (name: string) => this.connections.get(name),
      },
    });
  }
}
