import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './HtmlValue.tsx';

describe(renderMarkdown.name, () => {
  it.each([
    ['*Omhouwer*', '<em>Omhouwer</em>'],
    ['First\nSecond', 'First<br>\nSecond'],
    [
      '[Getty AAT](https://www.getty.edu/)',
      '<a href="https://www.getty.edu/">Getty AAT</a>',
    ],
    [
      'https://www.zotero.org/item',
      '<a href="https://www.zotero.org/item">https://www.zotero.org/item</a>',
    ],
    ['**Bold** <strong>HTML</strong>', 'Bold &lt;strong&gt;HTML&lt;/strong&gt;'],
    ['[Link](javascript:alert(1))', '[Link](javascript:alert(1))'],
  ])('renders %s safely', (markdown, html) => {
    expect(renderMarkdown(markdown)).toBe(html);
  });
});
