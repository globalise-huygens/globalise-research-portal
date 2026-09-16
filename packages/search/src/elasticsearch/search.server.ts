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

export function getSearchQuery(query?: string, selected?: Record<string, string[]>): QueryDslQueryContainer | undefined {
  if (!query && !selected) {
    return undefined;
  }

  return {
    bool: {
      must: [
        ...(query ? [{
          query_string: {
            query: query,
            default_field: 'text',
          },
        }] : []),
        ...(selected && Object.keys(selected).length > 0 ? [{
          terms: Object.keys(selected).reduce<Record<string, string[]>>((acc, key) => {
            acc[facets[key].tree] = selected[key];
            return acc;
          }, {}),
        }] : []),
      ],
    },
  };
}
