import type { SearchMiddleware } from '@tanstack/react-router';
import { asString } from './urlParams.ts';
import { type SearchUrlParams, validateSearchUrlParams } from './searchUrlParams.ts';

export type ManifestUrlParams = SearchUrlParams & {
  manifest?: string;
  canvas?: string;
  document?: string;
  documentId?: string;
  snippet?: string;
};

export function validateManifestUrlParams(params: Record<string, unknown>): ManifestUrlParams {
  return {
    ...validateSearchUrlParams(params),
    manifest: asString(params.manifest),
    canvas: asString(params.canvas),
    document: asString(params.document),
    documentId: asString(params.documentId),
    snippet: asString(params.snippet),
  };
}

export const resetUrlParamsOnManifestChange: SearchMiddleware<ManifestUrlParams> = ({ search: current, next }) => {
  const params = next(current);
  if (params.manifest === current.manifest) {
    return params;
  }
  const reset = { ...params };
  for (const key of manifestScopedKeys) {
    if (reset[key] === current[key]) {
      delete reset[key];
    }
  }
  return reset;
};

const manifestScopedKeys = ['canvas', 'document', 'documentId', 'snippet'] as const;
