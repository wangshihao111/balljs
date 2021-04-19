import chokidar from 'chokidar';
import { spawn, ChildProcessByStdio } from 'child_process';
import { debounce } from 'lodash';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kill from 'treekill';
import { cwd } from '../utils';

let initial = true;

export async function runDev(opts: { watch?: string[]; entry: string }) {
  const { watch, entry } = opts;
  console.log(opts);

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
    console.log(initial ? '开发服务启动.' : '文件变动，重新加载..');
    initial = false;

    const binPath = require.resolve('ts-node/dist/bin.js');

    child = spawn(`node ${binPath} ${entry}`, {
      cwd,
      shell: true,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        INSIDER_DEV: 'true',
        NODE_ENV: 'development',
      },
    });
  }, 800);

  watcher.on('all', onChange);
}
