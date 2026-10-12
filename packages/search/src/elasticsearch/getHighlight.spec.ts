import { describe, expect, it } from 'vitest';
import { getHighlight } from './getHighlight';
import { POST_TAG, PRE_TAG } from './highlightTags';

describe(getHighlight.name, () => {
  it('removes markers and returns the offsets of all highlights', () => {
    expect(getHighlight(`van ${PRE_TAG}Batavia${POST_TAG} naer ${PRE_TAG}Bantam${POST_TAG}`, PRE_TAG, POST_TAG)).toEqual({
      text: 'van Batavia naer Bantam',
      spans: [{ start: 4, end: 11 }, { start: 17, end: 23 }],
    });
  });

  it('throws on an unclosed start marker', () => {
    expect(() => getHighlight(`van ${PRE_TAG}Batavia`, PRE_TAG, POST_TAG)).toThrow('Unclosed start marker at 4');
  });
});
