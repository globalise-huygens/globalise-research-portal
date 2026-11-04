import { describe, expect, it } from 'vitest';
import {
  calculateHtrOffsets,
  type TextRangeMapping,
} from './calculateHtrOffsets';

describe(calculateHtrOffsets.name, () => {
  it('maps a hit on a word with a line break', () => {
    const normalized = 'foo barbaz bas';
    const htr = 'foo bar-\nbaz bas';
    const mappings: TextRangeMapping[] = [
      { htrPageOffset: 0, normalizedFrom: 0, normalizedTo: 7, canvasId: '1' },
      { htrPageOffset: 9, normalizedFrom: 7, normalizedTo: 14, canvasId: '1' },
    ];
    const barbaz = 'barbaz';
    const barbazOffsets = {
      start: normalized.indexOf(barbaz),
      end: normalized.indexOf(barbaz) + barbaz.length,
    };

    const hits = calculateHtrOffsets(barbazOffsets, mappings);

    expect(hits).toEqual([
      { canvasId: '1', start: 4, end: 7 },
      { canvasId: '1', start: 9, end: 12 },
    ]);
    const htrSnippets = hits.map(({ start, end }) => htr.slice(start, end));
    expect(htrSnippets).toEqual(['bar', 'baz']);
  });

  it('maps a hit with a range mapped to an earlier position', () => {
    const normalized = 'foo bar';
    const htr = 'bar foo';
    const mappings: TextRangeMapping[] = [
      { htrPageOffset: 4, normalizedFrom: 0, normalizedTo: 3, canvasId: '1' },
      { htrPageOffset: 0, normalizedFrom: 4, normalizedTo: 7, canvasId: '1' },
    ];

    const hits = calculateHtrOffsets({ start: 0, end: normalized.length }, mappings);

    const htrSnippets = hits.map(({ start, end }) => htr.slice(start, end));
    expect(htrSnippets).toEqual(['foo', 'bar']);
  });

  it('maps a hit that continues on the next page onto both pages', () => {
    const mappings: TextRangeMapping[] = [
      { htrPageOffset: 0, normalizedFrom: 0, normalizedTo: 3, canvasId: '1' },
      { htrPageOffset: 0, normalizedFrom: 4, normalizedTo: 7, canvasId: '2' },
    ];

    const hits = calculateHtrOffsets({ start: 0, end: 7 }, mappings);

    expect(hits).toEqual([
      { canvasId: '1', start: 0, end: 3 },
      { canvasId: '2', start: 0, end: 3 },
    ]);
  });
});
