import type { EntityTagType } from '@globalise/design';
import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslQueryContainer, SearchHighlight, SearchHit } from '@elastic/elasticsearch/lib/api/types';
import type { ComponentType } from 'react';

export type SearchIndex<Hit, Result extends SearchResult> = {
  key: string;
  label: string;
  icon: EntityTagType;
  esIndex: string;
  compile(query: TreeQuery): QueryDslQueryContainer | null;
  hierarchyFacets: Record<string, HierarchyFacet>;
  rangeFacets: Record<string, RangeFacet>;
  source: string[];
  highlight?: SearchHighlight;
  toResult(hit: SearchHit<Hit>): Result;
  ResultComponent: ComponentType<{ result: Result }>;
};

// Code that works for every index (like getSearchQuery) can't use SearchIndex<unknown, SearchResult>:
// an index such as documents doesn't fit it, because its ResultComponent only accepts document results.
// These types pick only the fields that code needs and leave ResultComponent out, so every index fits.

// The fields needed to build an Elasticsearch query for an index.
export type IndexForQuery = Pick<SearchIndex<unknown, SearchResult>, 'compile' | 'hierarchyFacets' | 'rangeFacets'>;

// The fields needed to run a search on an index and turn the hits into results.
export type IndexForSearch = IndexForQuery & Pick<SearchIndex<unknown, SearchResult>, 'esIndex' | 'source' | 'highlight' | 'toResult'>;

export type HierarchyFacet = {
  tree: string;
};

export type RangeFacet = {
  buckets: string;
  start: string;
  end: string;
};

export type SearchResult = {
  id: string;
  type: EntityTagType;
  title: string;
};