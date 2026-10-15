import type { CanvasId } from '@globalise/common/document';
import type { Offsets } from '@knaw-huc/faceted-search-react';

export type TextRangeMapping = {
  normalizedFrom: number;
  normalizedTo: number;
  canvasId: CanvasId;
  htrPageOffset: number;
};

export type PageOffsets = Offsets & {
  canvasId: CanvasId;
};

export function calculateHtrOffsets(
  range: Offsets,
  docMappings: TextRangeMapping[],
): PageOffsets[] {
  const rangeMappings = docMappings
    .filter((mapping) => isOverlapping(range, mapping));
  return rangeMappings
    .map((mapping) => toHtrPageOffsets(range, mapping));
}

/**
 * Do the (normalized) {@link range} offsets have any overlap
 * with the normalized {@link mapping} offsets?
 */
function isOverlapping(
  range: Offsets,
  mapping: TextRangeMapping,
): boolean {
  return mapping.normalizedFrom < range.end
    && range.start < mapping.normalizedTo;
}

/**
 * Shift that part of a range that falls within the mapping
 */
function toHtrPageOffsets(
  range: Offsets,
  mapping: TextRangeMapping,
): PageOffsets {
  const htrShift = mapping.htrPageOffset - mapping.normalizedFrom;

  // The shift only applies within the mapping, so crop the range when overflowing:
  const normalizedStart = Math.max(range.start, mapping.normalizedFrom);
  const normalizedEnd = Math.min(range.end, mapping.normalizedTo);

  return {
    canvasId: mapping.canvasId,
    start: normalizedStart + htrShift,
    end: normalizedEnd + htrShift,
  };
}
