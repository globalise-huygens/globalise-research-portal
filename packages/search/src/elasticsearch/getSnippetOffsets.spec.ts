import { describe, expect, it } from 'vitest';
import { getSnippetOffsets } from './getSnippetOffsets';

const text = 'foo bar baz bas';

describe(getSnippetOffsets.name, () => {
  it('finds the offsets of the snippet in the text', () => {
    expect(getSnippetOffsets(text, 'bar baz')).toEqual({ start: 4, end: 11 });
  });

  it('returns null when the snippet is not in the text', () => {
    expect(getSnippetOffsets(text, 'bass')).toBeNull();
  });
});
