import type { PageMeta } from '@globalise/content';

export function isBlogPost(page: PageMeta): boolean {
  return page.type === 'archived-post' &&
    page.path.startsWith('pages/about/archive/blog/');
}

export function blogPostDate(page: PageMeta): string | undefined {
  return page.datePublished ?? page.originalPublication?.date;
}
