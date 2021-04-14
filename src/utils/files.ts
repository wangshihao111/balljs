export async function importDecoratedAsync(file: string, key: any) {
  const res = await import(file);
  const exportVars = Object.values(res);
  return exportVars.filter((func: any) => Reflect.hasOwnMetadata(key, func));
}

export function importDecorated(file: string, key: any) {
  const res = require(file);
  const exportVars = Object.values(res);
  return exportVars.filter((func: any) => Reflect.hasOwnMetadata(key, func));
}