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
      name: '111',
      ctx: {} as any,
    };
    clusterScheduler
      .register(() => {
        const server = new Server({ port: opts.port, appCtx });
        server.start();
      })
      .schedule({ workers: workersProcess });
  }

  static startMicroService(opts: BootstrapStartMicroServiceOpts): void {
    console.log(opts);
  }
}
