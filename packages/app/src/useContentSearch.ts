import { useQuery } from '@tanstack/react-query';
import MiniSearch from 'minisearch';
import { fetchJson } from '@globalise/common';
import { contentSearchOptions } from '@globalise/content';
import type { AsPlainObject } from 'minisearch';
import type { ContentSearchDocument } from '@globalise/content';

const searchIndexUrl = '/content/search-index';

export function useContentSearch(): MiniSearch<ContentSearchDocument> | undefined {
  const { data } = useQuery({
    queryKey: ['content-search-index'],
    queryFn: ({ signal }) => fetchJson<AsPlainObject>(searchIndexUrl, { signal }),
    select: loadSearchIndex,
    staleTime: Infinity,
  });
  return data;
}

function loadSearchIndex(searchIndex: AsPlainObject): MiniSearch<ContentSearchDocument> {
  return MiniSearch.loadJS(searchIndex, contentSearchOptions);
}
