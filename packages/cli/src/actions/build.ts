import { spawn } from 'child_process';
import rimraf from 'rimraf';
import path from 'path';
import { cwd } from '../utils';

export async function runBuild(): Promise<void> {
  rimraf.sync(path.resolve(cwd, 'dist'), {});
  return new Promise((resolve, reject) => {
    const command = 'tsc --outDir dist';
    const child = spawn(command, {
      shell: true,
      cwd: cwd,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    child.on('close', () => {
      resolve();
    });
    child.on('error', (e) => {
      reject(e);
    });
  });
}
