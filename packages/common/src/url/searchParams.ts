import { asArray } from '../util/asArray.ts';

export type SearchParams = Record<string, string | string[]>;

export function parseSearch(searchStr: string): SearchParams {
  const search: SearchParams = {};
  const params = new URLSearchParams(searchStr);
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    search[key] = values.length === 1 ? values[0] : values;
  }
  return search;
}

export function stringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    for (const item of asArray(value)) {
      params.append(key, String(item));
    }
  }
  const searchStr = params.toString();
  return searchStr ? `?${searchStr}` : '';
}
