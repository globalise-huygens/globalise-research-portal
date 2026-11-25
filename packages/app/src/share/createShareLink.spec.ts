import { describe, expect, it } from 'vitest';
import { createShareLink } from './createShareLink';

const page = { inventory: '1053', page: '0004' };
const route = { ref: page, searchHit: null, searchHitQuery: null, activeEsHitIndex: null };

describe(createShareLink.name, () => {
  it('links to the sharable href on the given origin', () => {
    const { href } = createShareLink(route, 'https://foo.bar', 'baz');
    expect(href).toBe('https://foo.bar/hdl:20.500.14722/inventory:1053/0004');
  });
});
