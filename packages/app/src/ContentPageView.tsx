import { useEffect, useRef } from 'react';
import { toHref } from '@globalise/router';
import { Link } from 'react-aria-components';
import { isBlogPost } from './isBlogPost.ts';
import { BlogCards } from './BlogCards.tsx';
import { renderHtmlTree } from './renderHtmlTree.ts';
import { clearClientSearchQueryHighlight, highlightClientSearchQuery } from './highlightClientSearchQuery.ts';
import type { ContentPage, PageMeta } from '@globalise/content';
import './ContentPageView.css';

type ContentPageViewProps = {
  page: ContentPage;
  query?: string;
  relatedPosts: PageMeta[];
};

export function ContentPageView({ page, query, relatedPosts }: ContentPageViewProps) {
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
  }, [page, query]);

  if (isBlogPost(page.meta)) {
    const { meta, tree } = page;
    const [first, ...rest] = tree.children;
    const startsWithTitle = first?.type === 'element' && first.tagName === 'h1';
    const title = startsWithTitle
      ? renderHtmlTree({ ...tree, children: [first] })
      : <h1>{meta.title}</h1>;
    const body = startsWithTitle ? { ...tree, children: rest } : tree;
    const date = meta.datePublished ?? meta.originalPublication?.date;
    const byline = meta.authors.join(', ');

    return (
      <main className="blog-post">
        <article ref={articleRef}>
          <header className="heading">
            <Link href={toHref({ to: '/content/blog' })}>All blog posts</Link>
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
            <BlogCards posts={relatedPosts}/>
          </section>
        )}
      </main>
    );
  }

  return (
    <article ref={articleRef} className="content-page">
      {renderHtmlTree(page.tree)}
    </article>
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
