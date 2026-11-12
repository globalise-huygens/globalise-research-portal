import { asString } from './urlParams.ts';
import { type SearchUrlParams, validateSearchUrlParams } from './searchUrlParams.ts';

export type ManifestUrlParams = SearchUrlParams & {
  document?: string;
  documentId?: string;
  snippet?: string;
};

export function validateManifestUrlParams(params: Record<string, unknown>): ManifestUrlParams {
  return {
    ...validateSearchUrlParams(params),
    document: asString(params.document),
    documentId: asString(params.documentId),
    snippet: asString(params.snippet),
  };
}
