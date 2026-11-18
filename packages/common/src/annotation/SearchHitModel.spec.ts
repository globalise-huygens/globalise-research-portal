import { describe, expect, it } from 'vitest';
import { isSearchHitBody, searchHitBody } from './SearchHitModel';

describe(isSearchHitBody.name, () => {
  it('recognizes the search hit tag', () => {
    expect(isSearchHitBody(searchHitBody)).toBe(true);
  });

  it('ignores other textual bodies', () => {
    const body = {
      type: 'TextualBody',
      value: 'Chermitz',
      purpose: 'supplementing',
    } as const;
    expect(isSearchHitBody(body)).toBe(false);
  });
});
