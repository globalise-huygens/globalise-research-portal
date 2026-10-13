import type { Offsets } from './getHighlight';

export type TextRangeMapping = {
  normalizedFrom: number;
  normalizedTo: number;
  shortPageId: string;
  htrPageOffset: number;
};

export type PageOffsets = Offsets & {
  shortPageId: string;
};

export function calculateHtrOffsets(
  offsets: Offsets[],
  mappings: TextRangeMapping[],
): PageOffsets[] {
  return offsets.flatMap((span) => mappings
    .filter((mapping) => overlaps(span, mapping))
    .map((mapping) => toPageOffsets(span, mapping)));
}

function overlaps(span: Offsets, mapping: TextRangeMapping): boolean {
  return mapping.normalizedFrom < span.end && span.start < mapping.normalizedTo;
}

function toPageOffsets(span: Offsets, mapping: TextRangeMapping): PageOffsets {
  const shift = mapping.htrPageOffset - mapping.normalizedFrom;
  return {
    shortPageId: mapping.shortPageId,
    start: Math.max(span.start, mapping.normalizedFrom) + shift,
    end: Math.min(span.end, mapping.normalizedTo) + shift,
  };
}
