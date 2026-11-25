import type { SharableRouteState } from './collectSharableRouteState';
import { type ManifestRoute, toViewerRoute } from './ManifestRoute';

export function toManifestRoute(
  { ref, searchHit, searchHitQuery, activeEsHitIndex }: SharableRouteState,
): ManifestRoute {
  if (searchHit && activeEsHitIndex !== null) {
    return {
      type: 'hit',
      searchHit: { document: searchHit.document, hit: { esHitIndex: activeEsHitIndex } },
      searchHitQuery: searchHitQuery ?? undefined,
    };
  }
  return toViewerRoute(ref);
}
