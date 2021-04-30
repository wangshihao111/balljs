import { AppCtx } from '../utils';
import { ClusterScheduler, WorkerProcessType } from './ClusterScheduler';
import { Server } from './Server';

export interface BootstrapStartOpts {
  port?: number;
  // default is the number of cpus
  workersProcess?: WorkerProcessType;
}

export interface BootstrapStartMicroServiceOpts extends BootstrapStartOpts {
  port?: number;
}

const clusterScheduler = new ClusterScheduler();

export class Bootstrap {
  static start(opts: BootstrapStartOpts = {}): void {
    const { workersProcess = 'default' } = opts;
    if (typeof workersProcess === 'number' && workersProcess < 1) {
      throw new Error('You should have at least one worker process.');
    }
    const appCtx: AppCtx = {
      ctx: {} as any,
    };
    clusterScheduler
      .register(async () => {
        const server = new Server({ port: opts.port, appCtx });
        await server.init();
        server.start();
      })
      .schedule({ workers: workersProcess });
  }

  static startMicroService(opts: BootstrapStartMicroServiceOpts): void {
    console.log(opts);
  }
}
