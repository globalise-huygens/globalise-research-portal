import { asString } from './urlParams.ts';

export type ContentUrlParams = {
  q?: string;
};

export function validateContentUrlParams(
  params: Record<string, unknown>,
): ContentUrlParams {
  return { q: asString(params.q) };
}
