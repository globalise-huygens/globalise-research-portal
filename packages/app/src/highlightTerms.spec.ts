import { describe, expect, it } from 'vitest';
import { createSnippet, splitByTerms } from './highlightTerms.ts';

describe(splitByTerms.name, () => {
  it('puts matched terms at odd positions', () => {
    expect(splitByTerms('Colonial Archives of Batavia', ['archives'])).toEqual(['Colonial ', 'Archives', ' of Batavia']);
  });

  it('matches whole words only', () => {
    expect(splitByTerms('archives', ['arch'])).toEqual(['archives']);
  });

  it('keeps the text whole without terms', () => {
    expect(splitByTerms('archives', [])).toEqual(['archives']);
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
