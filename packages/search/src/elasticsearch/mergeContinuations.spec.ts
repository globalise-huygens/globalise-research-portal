import { describe, expect, it } from 'vitest';
import { mergeContinuousOffsets } from './mergeContinuousOffsets.ts';

const maxLineBreakLength = '-\n'.length;

describe(mergeContinuousOffsets.name, () => {
  it('merges ranges separated by a line break', () => {
    const htr = 'foo bar-\nbaz bas';
    const ranges = [
      { canvasId: '1', start: 4, end: 7 },
      { canvasId: '1', start: 9, end: 12 },
    ];

    const merged = mergeContinuousOffsets(ranges, maxLineBreakLength);

    expect(merged.map(({ start, end }) => htr.slice(start, end))).toEqual(['bar-\nbaz']);
  });

  it('keeps ranges on different pages apart', () => {
    const ranges = [
      { canvasId: '1', start: 0, end: 3 },
      { canvasId: '2', start: 0, end: 3 },
    ];

    expect(mergeContinuousOffsets(ranges, maxLineBreakLength)).toEqual(ranges);
  });

  it('keeps ranges apart when the next one starts earlier', () => {
    const ranges = [
      { canvasId: '1', start: 4, end: 7 },
      { canvasId: '1', start: 0, end: 3 },
    ];

    expect(mergeContinuousOffsets(ranges, maxLineBreakLength)).toEqual(ranges);
  });

  it('keeps ranges apart when they skip text longer than a line break', () => {
    const ranges = [
      { canvasId: '1', start: 0, end: 4 },
      { canvasId: '1', start: 11, end: 14 },
    ];

    expect(mergeContinuousOffsets(ranges, maxLineBreakLength)).toEqual(ranges);
  });
});
