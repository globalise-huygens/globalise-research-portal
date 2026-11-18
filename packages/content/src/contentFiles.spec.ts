import { describe, expect, it } from 'vitest';
import { toHref } from '@globalise/router';
import { contentRoute, toPageUrl } from './contentFiles.ts';

describe('contentRoute', () => {
  it('is the start of the content page route', () => {
    const route = toHref({ to: '/content/$slug', params: { slug: 'foo' } });
    expect(route.startsWith(contentRoute)).toBe(true);
  });
});

describe(toPageUrl.name, () => {
  it('adds the slug to the content route', () => {
    expect(toPageUrl('foo')).toBe('/content/foo');
  });
});
