import { asString } from './urlParams.ts';

export type UriUrlParams = {
  uri?: string;
};

export function validateUriUrlParams(params: Record<string, unknown>): UriUrlParams {
  return { uri: asString(params.uri) };
}
