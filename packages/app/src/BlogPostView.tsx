import { useEffect, useRef } from 'react';
import { toHref } from '@globalise/router';
import { IconArrowLeftAlt } from '@globalise/design';
import { Link } from 'react-aria-components';
import type { ContentPage, PageMeta } from '@globalise/content';
import { BlogCards } from './BlogCards.tsx';
import { blogPostDate } from './blogPost.ts';
import type { BlogPostMeta } from './blogPost.ts';
import { renderHtmlTree } from './renderHtmlTree.ts';
import {
  clearClientSearchQueryHighlight,
  highlightClientSearchQuery,
} from './highlightClientSearchQuery.ts';

type BlogPostViewProps = {
  meta: BlogPostMeta;
  tree: ContentPage['tree'];
  query?: string;
  relatedPosts: BlogPostMeta[];
};

export function BlogPostView({
  meta,
  tree,
  query,
  relatedPosts,
}: BlogPostViewProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = articleRef.current;
    if (!article || !query) {
      return;
    }
    const hitRanges = highlightClientSearchQuery(article, query);
    const firstHitElement = hitRanges[0]?.startContainer.parentElement;
    firstHitElement?.scrollIntoView({ block: 'center' });
    return clearClientSearchQueryHighlight;
  }, [meta, tree, query]);

  const [first] = tree.children;
  const startsWithTitle = first?.type === 'element' && first.tagName === 'h1';
  const title = startsWithTitle
    ? renderHtmlTree({ ...tree, children: [first] })
    : <h1>{meta.title}</h1>;
  const body = startsWithTitle
    ? { ...tree, children: tree.children.slice(1) }
    : tree;
  const date = blogPostDate(meta);
  const byline = meta.authors.join(', ');

  return (
    <main className="blog-post">
      <article ref={articleRef}>
        <header className="heading">
          <Link href={toHref({ to: '/content/blog' })}>
            <IconArrowLeftAlt width="16" height="16" aria-hidden="true"/>
            All blog posts
          </Link>
          {title}
          {meta.subtitle && <p className="subtitle">{meta.subtitle}</p>}
          {(byline || date) && (
            <p className="byline">
              {byline}
              {byline && date && ' · '}
              {date && <time dateTime={date}>{formatDate(date)}</time>}
            </p>
          )}
        </header>
        {meta.hero && <PostHero hero={meta.hero}/>}
        <div className="prose">{renderHtmlTree(body)}</div>
      </article>
      {relatedPosts.length > 0 && (
        <section className="related" aria-labelledby="related-posts">
          <h2 id="related-posts">Related posts</h2>
          <BlogCards posts={relatedPosts} heading="h3"/>
        </section>
      )}
    </main>
  );
}

function PostHero({ hero }: { hero: NonNullable<PageMeta['hero']> }) {
  const { src, alt, caption, credit, source, licence } = hero;
  const attribution = [credit, licence].filter(Boolean).join(' · ');
  const sourceUrl = source?.startsWith('https://') ? source : undefined;
  const hasCaption = Boolean(caption ?? sourceUrl) || attribution.length > 0;
  return (
    <figure className="hero">
      <img src={src} alt={alt ?? ''} fetchPriority="high"/>
      {hasCaption && (
        <figcaption>
          {caption && <span>{caption}</span>}
          {attribution && <span>{attribution}</span>}
          {sourceUrl && <a href={sourceUrl}>Image source</a>}
        </figcaption>
      )}
    </figure>
  );
}

const dateFormat = new Intl.DateTimeFormat('en', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

function formatDate(date: string): string {
  return dateFormat.format(new Date(date));
}
