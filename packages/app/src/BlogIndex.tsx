import { getRouteApi, toHref } from '@globalise/router';
import { IconArrowTopRight } from '@globalise/design';
import { Link } from 'react-aria-components';
import { BlogCards } from './BlogCards.tsx';
import { useContentSearchIndex } from './useContentSearchIndex.ts';
import type { ContentIndex } from '@globalise/content';
import './BlogIndex.css';

const route = getRouteApi('/content/blog');

export function BlogIndex() {
  const posts: ContentIndex = route.useLoaderData();
  const { q } = route.useSearch();

  return (
    <main className="blog-index">
      <header className="intro">
        <Link href={toHref({ to: '/content' })} className="back">
          <IconArrowTopRight width="16" height="16" aria-hidden="true"/>
          Back to content
        </Link>
        <h1>Explore the blog</h1>
        <p>Read archived posts from the Globalise project website.</p>
      </header>
      {q ? <BlogSearchResults posts={posts} query={q}/> : <BlogPostList posts={posts}/>}
    </main>
  );
}

function BlogSearchResults({ posts, query }: { posts: ContentIndex; query: string }) {
  const { data: searchIndex, isError } = useContentSearchIndex();
  if (isError) {
    return <p className="empty" role="status">Blog search is unavailable.</p>;
  }
  if (!searchIndex) {
    return <p className="empty" role="status">Searching blog posts…</p>;
  }
  const matchingSlugs = new Set(searchIndex.search(query).map(({ id }) => String(id)));
  const matches = posts.filter(({ slug }) => matchingSlugs.has(slug));
  return <BlogPostList posts={matches} emptyMessage="No blog posts match your search."/>;
}

function BlogPostList({
  posts,
  emptyMessage = 'No blog posts are available.',
}: {
  posts: ContentIndex;
  emptyMessage?: string;
}) {
  if (!posts.length) {
    return <p className="empty">{emptyMessage}</p>;
  }
  return <BlogCards posts={posts}/>;
}
