import { useQuery } from '@tanstack/react-query';
import MiniSearch from 'minisearch';
import { contentSearchIndexOptions } from '@globalise/content';
import { getContentSearchIndexServer } from '@globalise/content/serve';
import type { ContentSearchIndex } from '@globalise/content';

export function useContentSearchIndex(): ContentSearchIndex | undefined {
  const { data } = useQuery({
    queryKey: ['content-search-index'],
    queryFn: () => getContentSearchIndexServer(),
    select: loadContentSearchIndex,
    staleTime: Infinity,
  });
  return data;
}

function loadContentSearchIndex(searchIndex: string): ContentSearchIndex {
  return MiniSearch.loadJSON(searchIndex, contentSearchIndexOptions);
}
