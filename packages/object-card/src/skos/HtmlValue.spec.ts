import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sanitize } = vi.hoisted(() => ({
  sanitize: vi.fn((html: string) => html.replace(/<\/?strong>/g, '')),
}));

vi.mock('dompurify', () => ({
  default: { sanitize },
}));

import { renderMarkdown } from './HtmlValue.tsx';

describe(renderMarkdown.name, () => {
  beforeEach(() => {
    sanitize.mockClear();
  });

  it('renders emphasis', () => {
    expect(renderMarkdown('*Omhouwer*')).toBe('<em>Omhouwer</em>');
    expect(sanitize).toHaveBeenCalledWith('<em>Omhouwer</em>', {
      ALLOWED_TAGS: ['em', 'br'],
      ALLOWED_ATTR: [],
    });
  });

  it('renders line breaks', () => {
    expect(renderMarkdown('First line\nSecond line')).toBe(
      'First line<br>\nSecond line',
    );
  });

  it('does not render unsupported Markdown', () => {
    expect(renderMarkdown('[GLOBALISE](https://globalise.huygens.knaw.nl/)'))
      .toBe('[GLOBALISE](https://globalise.huygens.knaw.nl/)');
    expect(renderMarkdown('**Strong**')).toBe('Strong');
  });

  it('escapes raw HTML', () => {
    expect(renderMarkdown('<img src=x onerror=alert(1)>')).toBe(
      '&lt;img src=x onerror=alert(1)&gt;',
    );
  });

  it('preserves plain text', () => {
    expect(renderMarkdown('A plain definition.')).toBe('A plain definition.');
  });
});
