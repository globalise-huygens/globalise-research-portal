import type { ContentPage, PageMeta } from '@globalise/content';
import { getContentIndexServer, getContentPageServer } from '@globalise/content/serve';
import { isBlogPost } from './isBlogPost.ts';
import type { RouteLoaders } from '@globalise/router';

export type ContentPageLoaderData = {
  page: ContentPage;
  relatedPosts: PageMeta[];
};

export const routeLoaders: RouteLoaders = {
  '/content/blog': async () => {
    const pages = await getContentIndexServer();
    return pages
      .filter(isBlogPost)
      .sort((a, b) => publicationDate(b).localeCompare(publicationDate(a)));
  },
  '/content/': () => getContentIndexServer(),
  '/content/$slug': async ({ params }): Promise<ContentPageLoaderData> => {
    const page = await getContentPageServer({ data: params.slug });
    if (!isBlogPost(page.meta) || !page.meta.related?.length) {
      return { page, relatedPosts: [] };
    }
    const pages = await getContentIndexServer();
    const relatedPosts = page.meta.related.flatMap((slug) => {
      const post = pages.find((entry) =>
        entry.slug === slug && isBlogPost(entry),
      );
      return post ? [post] : [];
    });
    return { page, relatedPosts };
  },
};

function publicationDate(page: PageMeta): string {
  return page.datePublished ?? page.originalPublication?.date ?? '';
}
