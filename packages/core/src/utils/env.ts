import { resolve } from "path";
/**
 * 获得当前工作目录。根据环境变量区分：
 * INSIDER_DEV=true: src
 * NODE_ENV=development: src
 * NODE_ENV=production: dist
 */
export function getWorkDirectory(base?: string) {
  if (
    process.env.INSIDER_DEV === "true" ||
    process.env.NODE_ENV === "development"
  ) {
    return "src"
  } else if (process.env.NODE_ENV === "production") {
    return "dist"
  }
  return '';
}
