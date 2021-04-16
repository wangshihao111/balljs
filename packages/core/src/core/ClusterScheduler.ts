import cluster from 'cluster';
import { cpus } from 'os';

export type WorkerProcessType = number | 'default' | undefined;

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
    if (workers) {
      workerLength = workers === 'default' ? workerLength : workers;
    }
    if (cluster.isMaster) {
      console.log(`Master ${process.pid} is running`);
      // Fork workers.
      for (let i = 0; i < workerLength; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      this.tasks.forEach((task) => {
        new Promise(() => {
          task();
        });
      });
    }
  }
}
