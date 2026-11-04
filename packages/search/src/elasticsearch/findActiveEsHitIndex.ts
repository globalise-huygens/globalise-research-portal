import type { Offsets } from '@knaw-huc/faceted-search-react';

export function findActiveEsHitIndex(
  esHits: Offsets[],
  snippetHit: Offsets | null,
): number | null {
  if (!snippetHit) {
    return null;
  }
  const index = esHits.findIndex((esHit) => esHit.start === snippetHit.start);
  return index === -1 ? null : index;
}
