import type { PageOffsets } from './calculateHtrOffsets';

export function mergeContinuousOffsets(
  range: PageOffsets[],
  maxDistance: number,
): PageOffsets[] {
  const merged: PageOffsets[] = [];
  for (const offset of range) {
    const previous = merged.at(-1);
    if (previous && isContinuation(previous, offset, maxDistance)) {
      previous.end = offset.end;
      // do not push current
    } else {
      merged.push(offset);
    }
  }
  return merged;
}

/**
 * Consider two ranges as one when
 * - next is after prev
 * - their gap is smaller than {@link maxDistance}
 */
function isContinuation(
  prev: PageOffsets,
  next: PageOffsets,
  maxDistance: number,
): boolean {
  const gap = next.start - prev.end;
  return prev.canvasId === next.canvasId
    && gap >= 0
    && gap <= maxDistance;
}
