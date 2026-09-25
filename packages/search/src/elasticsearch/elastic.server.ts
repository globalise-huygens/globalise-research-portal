import type { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

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

export function getSearchQuery(query?: string, selected?: Record<string, string[]>): QueryDslQueryContainer | null {
  if (!query && !selected) {
    return null;
  }

  const esQuery = applyQueryString(query);
  const filters = applySelectedFacets(selected);

  return {
    bool: {
      must: esQuery ?? undefined,
      filter: filters ?? undefined,
    },
  };
}

function applyQueryString(query?: string): QueryDslQueryContainer[] | null {
  if (!query || query === '') {
    return null;
  }

  return [{
    query_string: {
      query: query,
      default_field: 'text',
    },
  }];
}

function applySelectedFacets(selected?: Record<string, string[]>): QueryDslQueryContainer[] | null {
  if (!selected || Object.keys(selected).length === 0) {
    return null;
  }

  return Object.entries(selected).map(([key, value]) => ({ terms: { [facets[key].tree]: value } }));
}
