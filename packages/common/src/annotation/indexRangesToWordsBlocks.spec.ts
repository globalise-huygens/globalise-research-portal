import { describe, expect, it } from 'vitest';
import {
  indexRangesToWordsBlocks,
  type OffsetRange,
} from './indexRangesToWordsBlocks.ts';

const words: OffsetRange[] = [
  { id: 'w1', start: 0, end: 5 },
  { id: 'w2', start: 6, end: 10 },
  { id: 'w3', start: 11, end: 15 },
];

const wordToBlock = { w1: 'b1', w2: 'b1', w3: 'b2' };

describe(indexRangesToWordsBlocks.name, () => {
  it('maps a range to every overlapping word', () => {
    const { toWords } = indexRangesToWordsBlocks(
      [{ id: 'e1', start: 3, end: 8 }],
      words,
      wordToBlock,
    );
    expect(toWords).toEqual({ e1: ['w1', 'w2'] });
  });

  it('maps a range to the block of its first word', () => {
    const { toBlock } = indexRangesToWordsBlocks(
      [{ id: 'e1', start: 8, end: 13 }],
      words,
      wordToBlock,
    );
    expect(toBlock).toEqual({ e1: 'b1' });
  });

  it('treats touching boundaries as no overlap', () => {
    const { toWords, toBlock } = indexRangesToWordsBlocks(
      [{ id: 'e1', start: 5, end: 6 }],
      words,
      wordToBlock,
    );
    expect(toWords).toEqual({});
    expect(toBlock).toEqual({});
  });

  it('skips ranges without overlapping words', () => {
    const { toWords } = indexRangesToWordsBlocks(
      [{ id: 'e1', start: 20, end: 25 }],
      words,
      wordToBlock,
    );
    expect(toWords).toEqual({});
  });

  it('omits the block when the first word has none', () => {
    const { toWords, toBlock } = indexRangesToWordsBlocks(
      [{ id: 'e1', start: 0, end: 3 }],
      words,
      {},
    );
    expect(toWords).toEqual({ e1: ['w1'] });
    expect(toBlock).toEqual({});
  });

  it('returns empty indexes without words', () => {
    const { toWords, toBlock } = indexRangesToWordsBlocks(
      [{ id: 'e1', start: 0, end: 3 }],
      [],
      wordToBlock,
    );
    expect(toWords).toEqual({});
    expect(toBlock).toEqual({});
  });
});
