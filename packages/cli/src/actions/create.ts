import { createLogger } from '@balljs/utils';
import { spawn } from 'child_process';
import { copy, readFile, writeFile } from 'fs-extra';
import path from 'path';

const logger = createLogger('CLI:create');

export const runCreate = async ({ name }: { name: string }) => {
  const from = path.resolve(__dirname, '../../template');
  const dest = path.resolve(process.cwd(), name);
  logger.info('Generating files...');
  await copy(from, dest, {
    recursive: true,
  });
  const pkgPath = path.resolve(dest, 'package.json');
  const pkgContent = await readFile(pkgPath, 'utf8');
  await writeFile(pkgPath, pkgContent.replace('PROJECT_NAME', name));
  logger.success('Generate files successfully.');
  logger.info('Installing dependencies...');
  await new Promise((resolve, reject) => {
    const child = spawn(`yarn`, {
      cwd: dest,
      shell: true,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    child.on('error', (err) => reject(err));
    child.on('exit', (code) => {
      resolve(code);
    });
  });
  logger.success('Install dependencies successfully.');
  logger.success(
    `Successfully create project.\nThen you can run:\ncd ${name}\nyarn install \n yarn dev`
  );
};
