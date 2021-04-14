import commander from 'commander';
import { runBuild } from './actions/build';
import { runStart } from './actions/start';

// eslint-disable-next-line @typescript-eslint/no-var-requires
commander.version(require('../package.json').version, '查看版本号');

commander.command('start').action(() => {
  runStart();
});

commander.command('build').action(() => {
  runBuild();
});

commander.parse(process.argv);
