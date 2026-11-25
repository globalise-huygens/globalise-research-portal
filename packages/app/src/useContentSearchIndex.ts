import { useQuery } from '@tanstack/react-query';
import MiniSearch from 'minisearch';
import { contentSearchIndexOptions } from '@globalise/content';
import { getContentSearchIndexServer } from '@globalise/content/serve';
import type { ContentSearchIndex } from '@globalise/content';

export function useContentSearchIndex() {
  return useQuery({
    queryKey: ['content-search-index'],
    queryFn: () => getContentSearchIndexServer(),
    select: loadContentSearchIndex,
    staleTime: Infinity,
  });
}

function loadContentSearchIndex(searchIndex: string): ContentSearchIndex {
  return MiniSearch.loadJSON(searchIndex, contentSearchIndexOptions);
}
