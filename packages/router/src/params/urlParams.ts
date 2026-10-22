import { asArray } from '@globalise/common';

export type UrlParams = Record<string, string | string[]>;

export function parseUrlParams(query: string): UrlParams {
  const params: UrlParams = {};
  const searchParams = new URLSearchParams(query);
  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);
    params[key] = values.length === 1 ? values[0] : values;
  }
  return params;
}

export function stringifyUrlParams(params: object): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const item of asArray(value)) {
      searchParams.append(key, String(item));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function asString(value: unknown): string | undefined {
  return typeof value === 'string' || typeof value === 'number' ? `${value}` : undefined;
}
