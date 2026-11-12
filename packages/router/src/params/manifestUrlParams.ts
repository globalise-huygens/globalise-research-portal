import type { SearchMiddleware } from '@tanstack/react-router';
import { createViewerPath, parseCanvasId, parseManifestId } from '@globalise/common/uri';
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

export function findViewerPath({ manifest, canvas }: ManifestUrlParams): string {
  const page = canvas ? parseCanvasId(canvas) : undefined;
  const inventory = manifest ? parseManifestId(manifest) : undefined;
  return createViewerPath(page ?? inventory ?? defaultInventory);
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

const defaultInventory = { inventory: '1053' };

const manifestScopedKeys = ['canvas', 'document', 'documentId', 'snippet'] as const;
