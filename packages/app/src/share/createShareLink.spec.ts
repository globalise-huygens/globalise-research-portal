import { describe, expect, it } from 'vitest';
import { handle } from '@globalise/common/uri';
import type { ManifestRoute } from './ManifestRoute';
import { createShareLink } from './createShareLink';

const route: ManifestRoute = { type: 'scan', ref: { inventory: '1053', page: '0004' } };

describe(createShareLink.name, () => {
  it('links to the sharable href on the given origin', () => {
    const { href } = createShareLink(route, 'https://foo.bar', 'baz');
    expect(href).toBe(`https://foo.bar/${handle}/inventory:1053/0004`);
  });
});
