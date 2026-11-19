import { asArray } from '@globalise/common';
import { asString } from './urlParams.ts';
import { facets, type FacetKey } from './facetDefinitions.ts';

export type SearchUrlParams = {
  q?: string;
  sort?: string;
  page?: number;
} & Partial<Record<FacetKey, string[]>>;

export function validateSearchUrlParams(params: Record<string, unknown>): SearchUrlParams {
  const validated: SearchUrlParams = {
    q: asString(params.q),
    sort: asString(params.sort),
    page: asPage(params.page),
  };
  for (const { key } of facets) {
    const values = asArray(params[key]).map(asString).filter((value) => value !== undefined);
    if (values.length) {
      validated[key] = values;
    }
  }
  return validated;
}

function asPage(value: unknown): number | undefined {
  const page = Number(asString(value));
  return Number.isInteger(page) && page > 1 ? page : undefined;
}
