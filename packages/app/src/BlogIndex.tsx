import { getRouteApi, toHref } from '@globalise/router';
import { IconArrowTopRight } from '@globalise/design';
import { Link } from 'react-aria-components';
import { BlogCards } from './BlogCards.tsx';
import type { BlogPostMeta } from './blogPost.ts';
import './BlogIndex.css';

const route = getRouteApi('/content/blog');

export function BlogIndex() {
  const posts: BlogPostMeta[] = route.useLoaderData();

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
      {posts.length > 0
        ? <BlogCards posts={posts}/>
        : <p className="empty">No blog posts are available.</p>}
    </main>
  );
}
