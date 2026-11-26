import type { SharableRouteState } from './collectSharableRouteState';
import { type ManifestRoute, toViewerRoute } from './ManifestRoute';

export function toManifestRoute(
  { ref, searchHit, searchHitQuery }: SharableRouteState,
  activeHitIndex: number | null,
): ManifestRoute {
  if (searchHit && activeHitIndex !== null) {
    return {
      type: 'hit',
      searchHit: { document: searchHit.document, hit: { hitIndex: activeHitIndex } },
      searchHitQuery: searchHitQuery ?? undefined,
    };
  }
  return toViewerRoute(ref);
}
