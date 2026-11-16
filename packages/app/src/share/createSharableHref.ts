import { toViewerHref, validateSearchUrlParams } from '@globalise/router';
import type { SharableRouteState } from './collectSharableRouteState';

export function createSharableHref(
  { ref, searchHit, searchHitQuery, activeEsHitIndex }: SharableRouteState,
): string {
  if (searchHit && activeEsHitIndex !== null) {
    const { query: q, facets } = searchHitQuery ?? { facets: {} };
    return toViewerHref(searchHit.document, {
      ...validateSearchUrlParams({ q, ...facets }),
      'hit-index': activeEsHitIndex,
    });
  }
  return toViewerHref(ref, {});
}
