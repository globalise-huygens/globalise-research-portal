import { describe, expect, it } from 'vitest';
import { createSnippet, splitByTerms } from './highlightTerms.ts';

describe(splitByTerms.name, () => {
  it('marks the matched terms', () => {
    expect(splitByTerms('Colonial Archives of Batavia', ['archives'])).toEqual([
      { text: 'Colonial ', isMatch: false },
      { text: 'Archives', isMatch: true },
      { text: ' of Batavia', isMatch: false },
    ]);
  });

  it('marks every match of every term', () => {
    expect(splitByTerms('VOC and voc in Batavia', ['voc', 'batavia'])).toEqual([
      { text: 'VOC', isMatch: true },
      { text: ' and ', isMatch: false },
      { text: 'voc', isMatch: true },
      { text: ' in ', isMatch: false },
      { text: 'Batavia', isMatch: true },
    ]);
  });

  it('keeps the text whole without terms', () => {
    expect(splitByTerms('archives', [])).toEqual([{ text: 'archives', isMatch: false }]);
  });
});

describe(createSnippet.name, () => {
  const text = `${'a '.repeat(50)}archives${' b'.repeat(100)}`;

  it('cuts the text around the first match', () => {
    const snippet = createSnippet(text, ['archives']);
    expect(snippet).toMatch(/^\[\.\.\] .*archives.* \[\.\.\]$/);
  });

  it('is empty without a match', () => {
    expect(createSnippet(text, ['batavia'])).toBe('');
  });
});
