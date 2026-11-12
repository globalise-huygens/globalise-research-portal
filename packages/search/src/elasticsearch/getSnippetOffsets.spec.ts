import { describe, expect, it } from 'vitest';
import { getSnippetOffsets } from './getSnippetOffsets';

const text = 'foo bar baz bas';

describe(getSnippetOffsets.name, () => {
  it('finds the offsets of the first hit in the snippet', () => {
    const snippet = 'bar [baz](_hit_term=baz) [bas](_hit_term=bas)';
    expect(getSnippetOffsets(text, snippet)).toEqual({ start: 8, end: 11 });
  });

  it('skips annotations that are not hits', () => {
    const snippet = '[bar](type%3AFoo) [baz](_hit_term=baz&type%3ABar)';
    expect(getSnippetOffsets(text, snippet)).toEqual({ start: 8, end: 11 });
  });

  it('returns null when the snippet is not in the text', () => {
    expect(getSnippetOffsets(text, '[bass](_hit_term=bass)')).toBeNull();
  });

  it('returns null when the snippet has no hit', () => {
    expect(getSnippetOffsets(text, 'bar [baz](type%3AFoo)')).toBeNull();
  });
});
