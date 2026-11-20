import { getRouteApi, toHref } from '@globalise/router';
import { Link } from 'react-aria-components';
import { BlogCards } from './BlogCards.tsx';
import { useContentSearchIndex } from './useContentSearchIndex.ts';
import { isBlogPost } from './isBlogPost.ts';
import type { ContentIndex } from '@globalise/content';
import './BlogIndex.css';

const route = getRouteApi('/content/blog');

export function BlogIndex() {
  const pages: ContentIndex = route.useLoaderData();
  const { q } = route.useSearch();
  const searchIndex = useContentSearchIndex();
  const matchingSlugs = q && searchIndex
    ? new Set(searchIndex.search(q).map((result) => String(result.id)))
    : undefined;
  const posts = pages.filter((page) =>
    isBlogPost(page) && (!matchingSlugs || matchingSlugs.has(page.slug)),
  );

  return (
    <main className="blog-index">
      <header className="intro">
        <div>
          <Link href={toHref({ to: '/content' })} className="back">
            <span aria-hidden="true">←</span> Back to content
          </Link>
          <h1>Explore the blog</h1>
          <p>Read archived posts from the Globalise project website.</p>
        </div>
      </header>
      {posts.length > 0
        ? <BlogCards posts={posts}/>
        : <p className="empty">No blog posts are available.</p>}
    </main>
  );
}
