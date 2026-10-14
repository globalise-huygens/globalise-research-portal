import { describe, expect, it } from 'vitest';
import { mergeContinuations } from './mergeContinuations';

const maxLineBreakLength = '-\n'.length;

describe(mergeContinuations.name, () => {
  it('merges ranges separated by a line break', () => {
    const htr = 'foo bar-\nbaz bas';
    const ranges = [
      { shortPageId: '1', start: 4, end: 7 },
      { shortPageId: '1', start: 9, end: 12 },
    ];

    const merged = mergeContinuations(ranges, maxLineBreakLength);

    expect(merged.map(({ start, end }) => htr.slice(start, end))).toEqual(['bar-\nbaz']);
  });

  it('keeps ranges on different pages apart', () => {
    const ranges = [
      { shortPageId: '1', start: 0, end: 3 },
      { shortPageId: '2', start: 0, end: 3 },
    ];

    expect(mergeContinuations(ranges, maxLineBreakLength)).toEqual(ranges);
  });

  it('keeps ranges apart when the next one starts earlier', () => {
    const ranges = [
      { shortPageId: '1', start: 4, end: 7 },
      { shortPageId: '1', start: 0, end: 3 },
    ];

    expect(mergeContinuations(ranges, maxLineBreakLength)).toEqual(ranges);
  });

  it('keeps ranges apart when they skip text longer than a line break', () => {
    const ranges = [
      { shortPageId: '1', start: 0, end: 4 },
      { shortPageId: '1', start: 11, end: 14 },
    ];

    expect(mergeContinuations(ranges, maxLineBreakLength)).toEqual(ranges);
  });
});
