import { describe, expect, it } from 'vitest';
import { tagAnnotatedHits } from './tagAnnotatedHits';
import { POST_TAG, PRE_TAG } from './highlightTags';

describe(tagAnnotatedHits.name, () => {
  it('tags a hit', () => {
    expect(tagAnnotatedHits('a [b](_hit_term=b) c')).toBe(`a ${PRE_TAG}b${POST_TAG} c`);
  });

  it('tags a hit containing an annotation', () => {
    expect(tagAnnotatedHits('a [b c](_hit_term=b+c&type%3APerson) d')).toBe(`a ${PRE_TAG}b c${POST_TAG} d`);
  });

  it('removes annotations that are not hits', () => {
    expect(tagAnnotatedHits('[a](type%3APlace) [b](_hit_term=b) [c](type%3APerson)')).toBe(`a ${PRE_TAG}b${POST_TAG} c`);
  });

  it('tags two hits', () => {
    expect(tagAnnotatedHits('a [b](_hit_term=b) [c](_hit_term=c)')).toBe(`a ${PRE_TAG}b${POST_TAG} ${PRE_TAG}c${POST_TAG}`);
  });

  it('returns text without annotations unchanged', () => {
    expect(tagAnnotatedHits('a b c')).toBe('a b c');
  });
});
