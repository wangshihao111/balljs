import { resolve } from 'path';
import { readdirSync } from 'fs-extra';
import { spawn } from 'child_process';
import { cwd } from '../utils';
import { runBuild } from './build';

export async function runStart(): Promise<void> {
  const entry = resolve(process.cwd(), 'dist/index.js');
  try {
    if (!readdirSync(resolve(cwd, 'dist')).length) {
      await runBuild();
    }
  } catch (error) {
    await runBuild();
  }
  spawn(`node ${entry}`, {
    shell: true,
    cwd: process.cwd(),
    stdio: ['inherit', 'inherit', 'inherit'],
    env: {
      NODE_ENV: 'production',
    },
  });
}
