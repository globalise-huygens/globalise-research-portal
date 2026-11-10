import type { Offsets } from '@knaw-huc/faceted-search-react';

export function findActiveEsHitIndex(
  esHits: Offsets[],
  snippet: Offsets | null,
): number | null {
  if (!snippet) {
    return null;
  }
  const index = esHits.findIndex((esHit) => snippet.start <= esHit.start && esHit.start < snippet.end);
  return index === -1 ? null : index;
}
