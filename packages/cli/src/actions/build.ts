import { spawn } from 'child_process';
import rimraf from 'rimraf';
import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import { cwd } from '../utils';

// TODO: 输出文件路径与输入文件路径应该可配

const distPath = path.resolve(cwd, 'dist');

export async function runBuild(): Promise<void> {
  await build();
  await copyFiles();
}

async function build(): Promise<void> {
  rimraf.sync(distPath, {});
  return new Promise((resolve, reject) => {
    const command = 'npx tsc --outDir dist --declaration false';
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

async function copyFiles() {
  const dir = path.resolve(cwd, 'src');
  const allFiles = globby
    .sync(['**/*.*'], {
      cwd: dir,
    })
    .filter((f) => !/\.[jt]s$/.test(f));
  await Promise.all(
    allFiles.map(async (f) => {
      const p = path.resolve(dir, f);
      const content = await fs.readFile(p, 'utf-8');
      await fs.writeFile(path.resolve(distPath, f), content, 'utf-8');
    })
  );
}
