import { describe, expect, it } from 'vitest';
import { toHref } from './toHref.ts';

describe(toHref.name, () => {
  it('builds the path with its url params', () => {
    const uri = 'https://example.org/a b';
    const href = toHref({ to: '/catalog', search: { uri } });
    expect(href).toBe('/catalog?uri=https%3A%2F%2Fexample.org%2Fa+b');
  });

  it('writes lists as repeated params', () => {
    const archives = ['1.04.02', '1.10.28'];
    const href = toHref({ to: '/search', search: { q: 'Batavia', ead: archives } });
    expect(href).toBe('/search?q=Batavia&ead=1.04.02&ead=1.10.28');
  });

  it('builds the bare path without url params', () => {
    const href = toHref({ to: '/map' });
    expect(href).toBe('/map');
  });
});

describe(`${toHref.name} types`, () => {
  it('rejects unknown url params, even next to known ones', () => {
    // @ts-expect-error documnetId is no manifest url param
    toHref({ to: '/manifest', search: { manifest: 'm1', documnetId: 'd1' } });
  });

  it('rejects url params of the wrong type', () => {
    // @ts-expect-error facets are lists
    toHref({ to: '/manifest', search: { ead: '1.04.02' } });
  });

  it('rejects unknown paths', () => {
    // @ts-expect-error no such route
    toHref({ to: '/foo' });
  });

  it('rejects options that need the current page', () => {
    // @ts-expect-error relative paths need the current page
    toHref({ to: '..' });
    // @ts-expect-error keeping params needs the current page
    toHref({ to: '/manifest', search: true });
  });
});
