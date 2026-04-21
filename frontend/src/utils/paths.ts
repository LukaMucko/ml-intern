const BASE_PATH = import.meta.env.BASE_URL || '/';

export function appPath(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const base = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!base) return normalizedPath;
  if (normalizedPath === '/') return `${base}/`;
  return `${base}${normalizedPath}`;
}
