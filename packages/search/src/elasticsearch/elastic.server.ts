import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import parseQuery from './parseQuery.server';

export type Facet = {
  tree: string;
};

export const facets: Record<string, Facet> = {
  'ead': {
    tree: 'eadIdPaths.tree',
  },
  'profession': {
    tree: 'professionIdPaths.tree',
  },
  'document_type': {
    tree: 'documentTypeIdPaths.tree',
  },
};

export function getSearchQuery(query?: TreeQuery, selected?: Record<string, string[]>): QueryDslQueryContainer | null {
  if (!query && !selected) {
    return null;
  }

  const esQuery = query ? parseQuery(query) : undefined;
  const filters = selected && Object.keys(selected).length > 0
    ? Object.entries(selected).map(([key, value]) => ({ terms: { [facets[key].tree]: value } }))
    : undefined;
  
  return {
    bool: {
      must: esQuery,
      filter: filters,
    },
  };
}
