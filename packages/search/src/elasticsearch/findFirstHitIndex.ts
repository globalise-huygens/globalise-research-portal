import type { HtrHit } from '@globalise/common/document';

export function findFirstHitIndex(
  hits: HtrHit[],
  esHitIndex: number | null,
): number | null {
  if(esHitIndex === null) {
    return null;
  }
  const index = hits.findIndex((hit) => hit.esHitIndex === esHitIndex);
  return index === -1
    ? null
    : index;
}
