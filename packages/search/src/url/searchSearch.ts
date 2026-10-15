import { asArray } from '@globalise/common';
import type { SearchState } from '@knaw-huc/faceted-search-react';
import { facets, type FacetKey } from '../Facets';

export type SearchSearch = {
  q?: string;
  sort?: string;
} & Partial<Record<FacetKey, string[]>>;

export function validateSearchSearch(search: Record<string, unknown>): SearchSearch {
  const validated: SearchSearch = {
    q: asString(search.q),
    sort: asString(search.sort),
  };
  for (const { key } of facets) {
    const values = asArray(search[key]).map(asString).filter((value) => value !== undefined);
    if (values.length) {
      validated[key] = values;
    }
  }
  return validated;
}

export function toSearchSearch({ query, sort, facetValues }: SearchState): SearchSearch {
  return validateSearchSearch({ ...facetValues, q: query, sort });
}

export function toSearchState({ q, sort, ...facetValues }: SearchSearch): SearchState {
  return { query: q, sort, facetValues, page: 1 };
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' || typeof value === 'number' ? `${value}` : undefined;
}
