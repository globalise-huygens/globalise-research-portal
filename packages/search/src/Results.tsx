import { Suspense, useCallback, useEffect, useRef } from 'react';
import { useInfiniteSearch } from '@knaw-huc/panoptes-react';
import { useSearchState } from '@knaw-huc/faceted-search-react';
import { EntityTagType } from '@globalise/design';
import Result, { DocumentResultContent } from './Result';
import classes from './Results.module.css';

export type SearchResult = {
  id: string;
  type: EntityTagType;
  title: string;
};

export type DocumentSearchResult = SearchResult & {
  type: 'document';
  archive: string[];
  text: string;
  observances: {
    type: EntityTagType;
    observedText: string;
    from: number,
    to: number,
    id: string;
  }[];
};

const isDocument = (result: SearchResult): result is DocumentSearchResult => result.type === 'document';

import QueryExpansion from './queryExpansion/QueryExpansion';
import { TermSelectionProvider } from './queryExpansion/TermSelectionProvider';

export default function Results() {
  return (
    <>
      <div>
        <TermSelectionProvider>
          <QueryExpansion/>
        </TermSelectionProvider>
      </div>

      <Suspense fallback={'Loading...'}>
        <ResultPages/>
      </Suspense>
    </>
  );
}

function ResultPages() {
  const state = useSearchState();
  const { items, fetchNextPage, isFetchingNextPage } = useInfiniteSearch<SearchResult>(state);
  const loadingResultsRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      fetchNextPage();
    }
  }, [fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback);
    if (loadingResultsRef.current) {
      observer.observe(loadingResultsRef.current);
    }

    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <>
      <ul className={classes.results}>
        {items.map((pageItems, idx) =>
          <ResultItems key={idx} items={pageItems}/>)}
      </ul>

      <div className={classes.loadingResults} ref={loadingResultsRef}>
        {isFetchingNextPage && 'Loading...'}
      </div>
    </>
  );
}

function ResultItems({ items }: { items: SearchResult[] }) {
  return (
    <>
      {items.map((result) => (
        <Result key={result.id} type={result.type} begin="01.01.1610" end="31.12.1610" title={result.title}
          subline={['scan(s): 23', 'location(s): Amsterdam, Bantum']}>
          {isDocument(result) && <DocumentResultContent {...result}/>}
        </Result>
      ))}
    </>
  );
}
