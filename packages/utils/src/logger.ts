import chalk from 'chalk';
import { isFirstWorker } from './common';

export function createLogger(namespace: string) {
  return {
    debug: (...args: any[]) => {
      process.env.NODE_ENV === 'development' &&
        isFirstWorker() &&
        console.log(`DEBUG (${chalk.redBright(namespace)}) : `, ...args);
    },
    info(...args: any[]) {
      console.log(chalk.blueBright(`Info (${namespace}) :`), ...args);
    },
    infoOnly(...args: any[]) {
      isFirstWorker() &&
        console.log(chalk.blueBright(`Info (${namespace}) :`), ...args);
    },
    success(...args: any[]) {
      console.log(chalk.greenBright(...args));
    },
    successOnly(...args: any[]) {
      isFirstWorker() && console.log(chalk.greenBright(...args));
    },
    error(...args: any[]) {
      console.log(chalk.red(`Error (${namespace}) :`), ...args);
    },
    errorOnly(...args: any[]) {
      isFirstWorker() &&
        console.log(chalk.red(`Error (${namespace}) : `), ...args);
    },
  };
}
