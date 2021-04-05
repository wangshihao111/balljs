import { resolve } from "path";
import globby from "globby";
import { flatten } from "lodash";
import { CONTROLLER_DECORATOR_KEY } from '../utils';

export class ControllerLoader {
  private cwd: string;

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  async load(dirs?: string[]): Promise<any[]> {
    let basePath = 'dist/controllers';
    if (process.env.MONKEY_DEV === 'true') {
      basePath = 'lib/controllers';
    } else if (process.env.NODE_ENV==='development') {
      basePath = 'src/controllers';
    }
    const paths = [basePath, ...(dirs || [])].map((p) =>
      resolve(this.cwd, p)
    );
    const files = flatten(
      await Promise.all(
        paths.map(async (p) => {
          const list = await globby(["**/*.js"], {
            cwd: p,
          });
          return list.map((item) => resolve(p, item));
        })
      )
    );

    const allController = flatten(await Promise.all(files.map(importController)));  
    return allController;
  }
}

async function importController(file: string) {
  const res = await import(file);
  const exportVars = Object.values(res);
  return exportVars.filter((func: any) => Reflect.hasOwnMetadata(CONTROLLER_DECORATOR_KEY, func));
}
