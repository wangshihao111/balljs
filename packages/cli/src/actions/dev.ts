import chokidar from 'chokidar';
import { spawn, ChildProcessByStdio } from 'child_process';
import { debounce } from 'lodash';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kill from 'treekill';
import { createLogger } from '@balljs/utils';
import { cwd } from '../utils';

let initial = true;

const logger = createLogger('CLI');

export async function runDev(opts: { watch?: string[]; entry: string }) {
  const { watch, entry } = opts;

  const watcher = chokidar.watch(
    watch?.length ? watch : ['src/**/*.ts', 'src/**/*.js'],
    {
      cwd,
    }
  );

  let child: ChildProcessByStdio<any, any, any>;

  const onChange = debounce(() => {
    if (child) {
      kill(child.pid);
    }
    logger.info(initial ? '开发服务启动中...' : '文件变动，重新加载中...');
    initial = false;

    const binPath = require.resolve('ts-node/dist/bin.js');

    child = spawn(`node ${binPath} ${entry}`, {
      cwd,
      shell: true,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
        INSIDER_DEV: 'true',
        NODE_ENV: 'development',
      },
    });
  }, 800);

  watcher.on('all', onChange);
}
