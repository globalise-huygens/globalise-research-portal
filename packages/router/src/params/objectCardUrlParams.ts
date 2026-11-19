import { type UriUrlParams, validateUriUrlParams } from './uriUrlParams.ts';

export function validateObjectCardUrlParams(params: Record<string, unknown>): UriUrlParams {
  return validateUriUrlParams(params);
}
