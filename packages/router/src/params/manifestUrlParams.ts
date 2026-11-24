import { asString } from './urlParams.ts';
import { type SearchUrlParams, validateSearchUrlParams } from './searchUrlParams.ts';

export type ManifestUrlParams = SearchUrlParams & {
  snippet?: string;
  'hit-index'?: number;
};

export function validateManifestUrlParams(params: Record<string, unknown>): ManifestUrlParams {
  return {
    ...validateSearchUrlParams(params),
    snippet: asString(params.snippet),
    'hit-index': asIndex(params['hit-index']),
  };
}

function asIndex(value: unknown): number | undefined {
  const index = Number(asString(value));
  return Number.isInteger(index) && index >= 0 ? index : undefined;
}
