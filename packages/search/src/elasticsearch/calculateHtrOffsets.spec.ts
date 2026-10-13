import { describe, expect, it } from 'vitest';
import {
  calculateHtrOffsets,
  type TextRangeMapping,
} from './calculateHtrOffsets';

describe(calculateHtrOffsets.name, () => {
  it('maps normalized to htr offsets for a word with a line break', () => {
    const normalized = 'foo barbaz bas';
    const htr = 'foo bar-\nbaz bas';
    const mappings: TextRangeMapping[] = [
      { htrPageOffset: 0, normalizedFrom: 0, normalizedTo: 7, shortPageId: '1' },
      { htrPageOffset: 9, normalizedFrom: 7, normalizedTo: 14, shortPageId: '1' },
    ];
    const barbaz = 'barbaz';
    const barbazOffsets = {
      start: normalized.indexOf(barbaz),
      end: normalized.indexOf(barbaz) + barbaz.length,
    };

    const hits = calculateHtrOffsets([barbazOffsets], mappings);

    expect(hits).toEqual([
      { shortPageId: '1', start: 4, end: 7 },
      { shortPageId: '1', start: 9, end: 12 },
    ]);
    const htrSnippets = hits.map(({ start, end }) => htr.slice(start, end));
    expect(htrSnippets).toEqual(['bar', 'baz']);
  });
});
