import { Suspense, useCallback, useEffect, useRef } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { usePagination, useSearchState } from '@knaw-huc/faceted-search-react';
import searchQueryOptions from './queries/searchQueryOptions';
import Result, { DocumentResultContent } from './Result';
import classes from './Results.module.css';

import type { DocumentSearchResult, SearchResult } from './elasticsearch/search.server';

const isDocument = (result: SearchResult): result is DocumentSearchResult => result.type === 'document';

export default function Results() {
  return (
    <Suspense fallback={'Loading...'}>
      <ResultPages/>
    </Suspense>
  );
}

function ResultPages() {
  const { pageSize } = usePagination();
  const { query, facetValues } = useSearchState();
  const {
    data: { pages },
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(searchQueryOptions({ query: query ?? '', facets: facetValues }, pageSize));
  const loadingResultsRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      void fetchNextPage();
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
    <div className={classes.results}>
      <ul>
        {pages.map((pageItems, idx) =>
          <ResultItems key={idx} items={pageItems}/>)}
      </ul>

      <div className={classes.loadingResults} ref={loadingResultsRef}>
        {isFetchingNextPage && 'Loading...'}
      </div>
    </div>
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
