/**
  配置文件格式：
  {
    plugins: [],
  }
 */
import path from 'path';
import { getWorkDirectory } from '../utils';

export interface IConfigPaths {
  controllers?: string[];
  services?: string[];
  interceptors?: string[];
}

export interface IConfig {
  plugins: string[];
  paths?: IConfigPaths;
}

export class Config {
  public workDir: string;

  public readonly cwd: string;

  public readonly userConfig: IConfig;

  constructor() {
    this.workDir = getWorkDirectory();
    this.cwd = process.cwd();
    this.userConfig = this.loadConfig();
  }

  loadConfig(): IConfig {
    const configFilePath = path.resolve(this.cwd, 'guku.config.js');
    try {
      return require(configFilePath);
    } catch (error) {
      console.log(222, error);

      return { plugins: [] };
    }
  }
}
