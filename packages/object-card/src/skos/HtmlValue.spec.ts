import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './HtmlValue.tsx';

describe(renderMarkdown.name, () => {
  it.each([
    ['*Omhouwer*', '<em>Omhouwer</em>'],
    ['First\nSecond', 'First<br>\nSecond'],
    ['Plain text', 'Plain text'],
    ['[Getty AAT](https://www.getty.edu/)', '[Getty AAT](https://www.getty.edu/)'],
    ['https://www.zotero.org/item', 'https://www.zotero.org/item'],
    ['**Bold** <strong>HTML</strong>', 'Bold &lt;strong&gt;HTML&lt;/strong&gt;'],
  ])('renders %s safely', (markdown, html) => {
    expect(renderMarkdown(markdown)).toBe(html);
  });
});
