import { describe, expect, it } from 'vitest';
import { buildPageLinks } from './buildPageLinks.ts';
import type { Element } from 'hast';
import type { ContentPage } from '../ContentPage.ts';

describe(buildPageLinks.name, () => {
  it('links to the portal url of a page', () => {
    expect(resolve('/pages/a.md')).toBe('/content/foo');
  });

  it('keeps the fragment', () => {
    expect(resolve('/pages/a.md#b')).toBe('/content/foo#b');
  });

  it.each([
    '/pages/b.md',
    '/assets/a.png',
    'https://foo.bar',
    '#a',
  ])('keeps a link to anything but a built page: %s', (href) => {
    expect(resolve(href)).toBe(href);
  });
});

function resolve(href: string) {
  const link: Element = { type: 'element', tagName: 'a', properties: { href }, children: [] };
  const page: ContentPage = {
    meta: { path: 'pages/a.md', title: 'Foo', slug: 'foo' },
    tree: { type: 'root', children: [link] },
  };
  buildPageLinks([page]);
  return link.properties.href;
}
