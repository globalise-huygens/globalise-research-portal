import { describe, expect, it } from 'vitest';
import { createSnippet, findTerms } from './highlightTerms.ts';

describe(findTerms.name, () => {
  it('finds the matched terms', () => {
    expect(findTerms('a Foo b', ['foo'])).toEqual([{ start: 2, end: 5 }]);
  });

  it('finds every match of every term', () => {
    expect(findTerms('FOO a foo b Bar', ['foo', 'bar'])).toEqual([
      { start: 0, end: 3 },
      { start: 6, end: 9 },
      { start: 12, end: 15 },
    ]);
  });

  it('finds nothing without terms', () => {
    expect(findTerms('foo', [])).toEqual([]);
  });
});

describe(createSnippet.name, () => {
  const text = `${'a '.repeat(50)}foo${' b'.repeat(100)}`;

  it('cuts the text around the first match', () => {
    const snippet = createSnippet(text, ['foo']);
    expect(snippet).toMatch(/^\[\.\.\] .*foo.* \[\.\.\]$/);
  });

  it('is empty without a match', () => {
    expect(createSnippet(text, ['bar'])).toBe('');
  });
});
