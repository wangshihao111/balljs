import commander from 'commander';
import { runBuild } from './actions/build';
import { runDev } from './actions/dev';
import { runStart } from './actions/start';

// eslint-disable-next-line @typescript-eslint/no-var-requires
commander.version(require('../package.json').version, '查看版本号');

commander
  .command('start')
  .description('启动身产环境')
  .action(() => {
    runStart();
  });

commander
  .command('build')
  .description('生产环境打包')
  .action(() => {
    runBuild();
  });

commander
  .command('dev')
  .description('启动开发服务')
  .option('-w, --watch <watch>', '监听的文件')
  .option('-e, --entry <entry>', '入口文件路径')
  .action((command) => {
    runDev({
      watch: command.watch?.split(' '),
      entry: command.entry || 'src/index',
    });
  });

commander.parse(process.argv);
