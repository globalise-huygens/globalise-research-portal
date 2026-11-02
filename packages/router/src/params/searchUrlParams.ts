import { asArray } from '@globalise/common';
import { asString } from './urlParams.ts';
import { facets, type FacetKey } from './facetDefinitions.ts';

export type SearchUrlParams = {
  q?: string;
  sort?: string;
} & Partial<Record<FacetKey, string[]>>;

export function validateSearchUrlParams(params: Record<string, unknown>): SearchUrlParams {
  const validated: SearchUrlParams = {
    q: asString(params.q),
    sort: asString(params.sort),
  };
  for (const { key } of facets) {
    const values = asArray(params[key]).map(asString).filter((value) => value !== undefined);
    if (values.length) {
      validated[key] = values;
    }
  }
  return validated;
}
