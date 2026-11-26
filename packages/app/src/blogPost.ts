import type { PageMeta } from '@globalise/content';

export type BlogPostMeta = PageMeta & {
  type: 'archived-post';
  path: `pages/about/archive/blog/${string}`;
};

export function isBlogPost(page: PageMeta): page is BlogPostMeta {
  return page.type === 'archived-post' &&
    page.path.startsWith('pages/about/archive/blog/');
}

export function blogPostDate(page: PageMeta): string | undefined {
  return page.datePublished ?? page.originalPublication?.date;
}
