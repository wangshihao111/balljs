import { getWorkDirectory } from "../utils";

export class Config {
  public workDir: string;

  public readonly cwd: string;

  constructor(opts?: { cwd?: string }) {
    this.workDir = getWorkDirectory();
    this.cwd = process.cwd();
  }
}
