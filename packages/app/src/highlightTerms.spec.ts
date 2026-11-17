import { describe, expect, it } from 'vitest';
import { createSnippet, splitByTerms } from './highlightTerms.ts';

describe(splitByTerms.name, () => {
  it('marks the matched terms', () => {
    expect(splitByTerms('a Foo b', ['foo'])).toEqual([
      { text: 'a ', isMatch: false },
      { text: 'Foo', isMatch: true },
      { text: ' b', isMatch: false },
    ]);
  });

  it('marks every match of every term', () => {
    expect(splitByTerms('FOO a foo b Bar', ['foo', 'bar'])).toEqual([
      { text: 'FOO', isMatch: true },
      { text: ' a ', isMatch: false },
      { text: 'foo', isMatch: true },
      { text: ' b ', isMatch: false },
      { text: 'Bar', isMatch: true },
    ]);
  });

  it('keeps the text whole without terms', () => {
    expect(splitByTerms('foo', [])).toEqual([{ text: 'foo', isMatch: false }]);
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
