import type { PageOffsets } from './calculateHtrOffsets';

export function mergeContinuations(
  range: PageOffsets[],
  maxLineBreakLength: number,
): PageOffsets[] {
  const merged: PageOffsets[] = [];
  for (const offset of range) {
    const previous = merged.at(-1);
    if (previous && isContinuation(previous, offset, maxLineBreakLength)) {
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
 * - their gap is smaller than {@link maxLineBreakLength}
 */
function isContinuation(
  prev: PageOffsets,
  next: PageOffsets,
  maxLineBreakLength: number,
): boolean {
  const gap = next.start - prev.end;
  return prev.shortPageId === next.shortPageId
    && gap >= 0
    && gap <= maxLineBreakLength;
}
