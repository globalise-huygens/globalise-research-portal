import type { PageMeta } from '@globalise/content';

export function isBlogPost(page: PageMeta): boolean {
  return page.type === 'archived-post' &&
    page.path.startsWith('pages/about/archive/blog/');
}
