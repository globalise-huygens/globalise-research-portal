import { describe, expect, it } from 'vitest';
import { Annotation } from './AnnoModel';
import { indexLineNumbers } from './indexLineNumbers';

describe('indexLineNumbers', () => {
  it('keeps source line numbers when a line has no rendered words', () => {
    const annotations = Object.fromEntries([
      annotation('block', 'block'),
      annotation('line-1', 'line'),
      annotation('line-without-words', 'line'),
      annotation('line-3', 'line'),
    ].map((item) => [item.id, item]));

    expect(indexLineNumbers(annotations)).toEqual({
      'line-1': 1,
      'line-without-words': 2,
      'line-3': 3,
    });
  });
});

function annotation(
  id: string,
  textGranularity: Annotation['textGranularity'],
): Annotation {
  return {
    id,
    type: 'Annotation',
    body: [],
    target: [],
    textGranularity,
  };
}
