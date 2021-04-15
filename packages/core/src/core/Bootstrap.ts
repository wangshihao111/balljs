import { Server } from './Server';

export interface BootstrapStartOpts {
  port?: number;
}

export interface BootstrapStartMicroServiceOpts {
  port?: number;
}

export class Bootstrap {
  static start(opts: BootstrapStartOpts = {}): void {
    const server = new Server({ port: opts.port });
    server.start();
  }

  static startMicroService(opts: BootstrapStartMicroServiceOpts): void {
    console.log(opts);
  }
}
