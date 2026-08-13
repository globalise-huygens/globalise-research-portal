import { isUrl } from '../util/isUrl.ts';

/**
 * Convert an ID uri into a json url by adding `.json` when missing.
 */
export function getJsonUrl(uri: string): string {
  const result = uri.endsWith('.json') ? uri : `${uri}.json`;
  if (!isUrl(result)) {
    throw new Error(`Could not create url from uri ${uri}`);
  }
  return result;
}
