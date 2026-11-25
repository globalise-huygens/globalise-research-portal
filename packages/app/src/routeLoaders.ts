import type { ContentPage, PageMeta } from '@globalise/content';
import {
  getContentIndexServer,
  getContentPageServer,
} from '@globalise/content/serve';
import { blogPostDate, isBlogPost } from './blogPost.ts';
import type { RouteLoaders } from '@globalise/router';

export type ContentPageLoaderData = {
  page: ContentPage;
  relatedPosts: PageMeta[];
};

export const routeLoaders: RouteLoaders = {
  '/': async () => {
    const pages = await getContentIndexServer();
    const featuredPosts = pages.filter((page) =>
      page.featured &&
      (page.status === 'approved' || page.status === 'published') &&
      isBlogPost(page),
    );
    return sortBlogPosts(featuredPosts).slice(0, 3);
  },
  '/content/blog': async () => {
    const pages = await getContentIndexServer();
    return sortBlogPosts(pages.filter(isBlogPost));
  },
  '/content/': () => getContentIndexServer(),
  '/content/$slug': async ({ params }): Promise<ContentPageLoaderData> => {
    const page = await getContentPageServer({ data: params.slug });
    const relatedPosts = await getRelatedBlogPosts(page.meta);
    return { page, relatedPosts };
  },
};

function sortBlogPosts(pages: PageMeta[]): PageMeta[] {
  return pages.sort((a, b) =>
    (blogPostDate(b) ?? '').localeCompare(blogPostDate(a) ?? ''),
  );
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
  const requestedSlugs = new Set(relatedSlugs);
  const postsBySlug = new Map<string, PageMeta>();
  for (const page of pages) {
    if (requestedSlugs.has(page.slug) && isBlogPost(page)) {
      postsBySlug.set(page.slug, page);
    }
  }

  const relatedPosts: PageMeta[] = [];
  for (const slug of relatedSlugs) {
    const post = postsBySlug.get(slug);
    if (post) {
      relatedPosts.push(post);
    }
  }
  return relatedPosts;
}
