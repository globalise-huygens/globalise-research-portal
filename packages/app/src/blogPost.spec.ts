import { describe, expect, expectTypeOf, it } from 'vitest';
import type { PageMeta } from '@globalise/content';
import { isBlogPost } from './blogPost.ts';
import type { BlogPostMeta } from './blogPost.ts';

const page: PageMeta = {
  title: 'Title',
  summary: 'Summary',
  type: 'archived-post',
  slug: 'post',
  status: 'draft',
  authors: [],
  featured: false,
  path: 'pages/about/archive/blog/post.md',
};

describe(isBlogPost.name, () => {
  it('selects archived posts in the blog directory and narrows their type', () => {
    const pages = [
      page,
      { ...page, type: 'page' },
      { ...page, path: 'pages/about/archive/mission.md' },
      { ...page, path: 'pages/about/archive/blog-other/post.md' },
    ];
    const posts = pages.filter(isBlogPost);

    expect(posts).toEqual([page]);
    expectTypeOf(posts).toEqualTypeOf<BlogPostMeta[]>();
  });
});
