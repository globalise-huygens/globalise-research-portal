import { describe, expect, it } from 'vitest';
import { findSnippetHit } from './findSnippetHit';
import { POST_TAG, PRE_TAG } from './highlightTags';

const text = 'Op huyden is het schip van Batavia naer Bantam vertrocken';

describe(findSnippetHit.name, () => {
  it('finds the offsets of the first hit in the snippet', () => {
    const snippet = `schip van ${PRE_TAG}Batavia${POST_TAG} naer ${PRE_TAG}Bantam${POST_TAG}`;
    expect(findSnippetHit(text, snippet)).toEqual({ start: 27, end: 34 });
  });

  it('returns null when the snippet is not in the text', () => {
    expect(findSnippetHit(text, `${PRE_TAG}Ambon${POST_TAG}`)).toBeNull();
  });

  it('returns null when the snippet has no hit', () => {
    expect(findSnippetHit(text, 'schip van')).toBeNull();
  });
});
