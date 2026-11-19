import { useEffect, useRef } from 'react';
import { renderHtmlTree } from './renderHtmlTree.ts';
import { clearClientSearchQueryHighlight, highlightClientSearchQuery } from './highlightClientSearchQuery.ts';
import type { ContentPage } from '@globalise/content';
import './ContentPageView.css';

type ContentPageViewProps = {
  page: ContentPage;
  query?: string;
};

export function ContentPageView({ page, query }: ContentPageViewProps) {
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

  return (
    <article ref={articleRef} className="content-page">
      {renderHtmlTree(page.tree)}
    </article>
  );
}
