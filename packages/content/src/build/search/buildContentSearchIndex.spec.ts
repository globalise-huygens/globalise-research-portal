import { describe, expect, it } from 'vitest';
import { buildContentSearchIndex } from './buildContentSearchIndex.ts';
import type { Element } from 'hast';
import type { ContentPage } from '../../ContentPage.ts';

describe(buildContentSearchIndex.name, () => {
  const index = buildContentSearchIndex([
    createPage('a', 'Foo', 'lorem ipsum'),
    createPage('b', 'Bar', 'dolor sit'),
  ]);

  it('finds a page by a word in its body', () => {
    expect(findSlugs('ipsum')).toEqual(['a']);
  });

  it('finds a page by its title', () => {
    expect(findSlugs('bar')).toEqual(['b']);
  });

  it('finds a page by prefix', () => {
    expect(findSlugs('ips')).toEqual(['a']);
  });

  it('ignores a typo, so every hit matches the page literally', () => {
    expect(findSlugs('ipum')).toEqual([]);
  });

  function findSlugs(query: string): string[] {
    return index.search(query).map((hit) => String(hit.id));
  }
});

function createPage(slug: string, title: string, body: string): ContentPage {
  const paragraph: Element = { type: 'element', tagName: 'p', properties: {}, children: [{ type: 'text', value: body }] };
  return {
    meta: { path: `${slug}.md`, title, slug },
    tree: { type: 'root', children: [paragraph] },
  };
}
