export const indexFile = 'index.json';
export const pagesDir = 'pages';
export const assetsDir = 'assets';

export function toPageFile(slug: string): string {
  return `${pagesDir}/${slug}.json`;
}
