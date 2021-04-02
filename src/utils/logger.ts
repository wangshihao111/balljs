import chalk from "chalk";

export function createLogger(namespace: string) {
  return {
    debug: (...args: any[]) => {
      process.env.NODE_ENV === "development" &&
        console.log(`${chalk.redBright(namespace)}: `, ...args);
    },
    info(...args: any[]) {
      console.log(`Info: `, ...args);
    },
    success(...args: any[]) {
      console.log(`Success: `, ...args);
    },
    error(...args: any[]) {
      console.log(`Error: `, ...args);
    },
  };
}
