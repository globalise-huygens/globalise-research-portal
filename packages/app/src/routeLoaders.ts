import type { ContentPage, PageMeta } from '@globalise/content';
import {
  getContentIndexServer,
  getContentPageServer,
} from '@globalise/content/serve';
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
    const relatedPosts = await getRelatedBlogPosts(page.meta);
    return { page, relatedPosts };
  },
};

function publicationDate(page: PageMeta): string {
  return page.datePublished ?? page.originalPublication?.date ?? '';
}

async function getRelatedBlogPosts(meta: PageMeta): Promise<PageMeta[]> {
  if (!isBlogPost(meta)) {
    return [];
  }

  // The archive landing page is the parent recorded on archived posts.
  const relatedSlugs = meta.related?.filter((slug) => slug !== 'archive');
  if (!relatedSlugs?.length) {
    return [];
  }

  const pages = await getContentIndexServer();
  const postsBySlug = new Map(
    pages.filter(isBlogPost).map((post) => [post.slug, post]),
  );
  return relatedSlugs
    .map((slug) => postsBySlug.get(slug))
    .filter((post) => post !== undefined);
}
