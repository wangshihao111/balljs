import { createLogger, WORKER_ENV_NTH } from '@balljs/utils';
import cluster from 'cluster';
import { cpus } from 'os';

export type WorkerProcessType = number | 'default' | undefined | 'single';

const logger = createLogger('Bootstrap');

export class ClusterScheduler {
  tasks: (() => void)[];

  constructor() {
    this.tasks = [];
  }

  register(task: () => void) {
    this.tasks.push(task);
    return this;
  }

  schedule({ workers }: { workers: WorkerProcessType }) {
    let workerLength = cpus().length;
    if (workers === 'single') {
      this.runTasks();
    } else {
      if (workers) {
        workerLength = workers === 'default' ? workerLength : workers;
      }
      if (cluster.isMaster) {
        logger.info(`Master ${process.pid} is running`);
        // Fork workers.
        for (let i = 0; i < workerLength; i++) {
          cluster.fork({ [WORKER_ENV_NTH]: i });
        }

        cluster.on('exit', (worker, code, signal) => {
          const { pid } = worker.process;
          logger.error(
            `worker ${worker.process.pid} died. Restarting worker...`
          );
          const newWorker = cluster.fork();
          logger.info(
            `Worker ${pid} restarted, latest worker is ${newWorker.process.pid}.`
          );
        });
      } else {
        this.runTasks();
      }
    }
  }

  private runTasks() {
    this.tasks.forEach((task) => {
      new Promise(() => {
        task();
      });
    });
  }
}
