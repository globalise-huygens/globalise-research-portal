export const indexFile = 'index.json';
export const searchIndexFile = 'search-index.json';
export const pagesDir = 'pages';
export const assetsDir = 'assets';
export const contentRoute = '/content';

export function toPageFile(slug: string): string {
  return `${pagesDir}/${slug}.json`;
}

export function toPageUrl(slug: string): string {
  return `${contentRoute}/${slug}`;
}
