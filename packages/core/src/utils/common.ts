export function getUrlPath(base: string, ...args: string[]) {
  let finalUrl = base;
  if (!finalUrl.startsWith('/')) {
    finalUrl = `/${finalUrl}`
  }
  finalUrl = finalUrl.replace(/\/$/, '');
  finalUrl += '/' + args.map(p => p.replace(/^\//, '').replace(/\/$/, ''))
  return finalUrl;
}