import { type UriUrlParams, validateUriUrlParams } from './uriUrlParams.ts';

export function validateCatalogUrlParams(params: Record<string, unknown>): UriUrlParams {
  return validateUriUrlParams(params);
}
