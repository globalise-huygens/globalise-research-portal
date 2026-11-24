import getSearchState, { type GlobaliseSearchState } from './getSearchState';
import { validateSearchUrlParams } from '@globalise/router';
import type { SearchHitQuery, SearchHitRequest, SearchHitTarget } from '@globalise/common/document';
import { createDocumentName } from '@globalise/common/uri';
import { toSearchState } from '../url';

export type ManifestSearchState = GlobaliseSearchState & {
  docDbId: string;
  target: SearchHitTarget;
};

export default function getManifestSearchState(
  searchHit: SearchHitRequest | null,
  searchContext: SearchHitQuery | null,
): ManifestSearchState | undefined {
  if (!searchHit) {
    return;
  }
  const { query: q, facets } = searchContext ?? { facets: {} };
  const searchUrlParams = validateSearchUrlParams({ q, ...facets });
  return {
    ...getSearchState(toSearchState(searchUrlParams)),
    docDbId: createDocumentName(searchHit.document),
    target: searchHit.target,
  };
}
