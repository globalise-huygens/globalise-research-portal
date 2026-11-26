import { useEffect, type RefObject } from 'react';
import type { ContentPage } from '@globalise/content';
import {
  clearClientSearchQueryHighlight,
  highlightClientSearchQuery,
} from './highlightClientSearchQuery.ts';

export function useQueryHighlight(
  articleRef: RefObject<HTMLElement | null>,
  tree: ContentPage['tree'],
  query?: string,
) {
  useEffect(() => {
    const article = articleRef.current;
    if (!article || !query) {
      return;
    }
    const [firstHit] = highlightClientSearchQuery(article, query);
    const firstHitElement = firstHit?.startContainer.parentElement;
    if (firstHitElement) {
      firstHitElement.scrollIntoView({ block: 'center' });
    } else {
      article.scrollIntoView({ block: 'start' });
    }
    return clearClientSearchQueryHighlight;
  }, [articleRef, tree, query]);
}
