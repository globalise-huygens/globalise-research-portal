import type { SearchHitQuery, SearchHitRef } from '@globalise/common/document';
import { type ManifestUrlParams, toViewerHref, validateSearchUrlParams } from '@globalise/router';
import type { ManifestRoute } from './ManifestRoute';

export function createSharableHref(route: ManifestRoute): string {
  switch (route.type) {
    case 'hit': {
      const { searchHit: { document, hit }, searchHitQuery } = route;
      return toViewerHref(document, {
        ...toSearchUrlParams(searchHitQuery),
        ...toSearchHitUrlParams(hit),
      });
    }
    case 'document':
      return toViewerHref(route.ref, {});
    default:
      return toViewerHref(route.ref, toSearchUrlParams(route.searchHitQuery));
  }
}

function toSearchUrlParams(searchHitQuery?: SearchHitQuery): ManifestUrlParams {
  const { query: q, facets } = searchHitQuery ?? { facets: {} };
  return validateSearchUrlParams({ q, ...facets });
}

function toSearchHitUrlParams(hit: SearchHitRef): ManifestUrlParams {
  return 'snippet' in hit
    ? { snippet: hit.snippet }
    : { 'hit-index': hit.hitIndex };
}
