import { describe, expect, it } from 'vitest';
import { isLocal } from './validateLinks.ts';

describe(isLocal.name, () => {
  it.each([
    'other.md',
    '../other.md',
    'images/map.png',
    '/docs/intro.md',
    'other.md#section',
  ])('accepts relative and root path: %s', (link) => {
    expect(isLocal(link)).toBe(true);
  });

  it.each([
    'https://example.com',
    'mailto:info@example.com',
    '//example.com/map.png',
  ])('rejects external link: %s', (link) => {
    expect(isLocal(link)).toBe(false);
  });

  it('rejects anchor', () => {
    expect(isLocal('#section')).toBe(false);
  });

  it('rejects empty link', () => {
    expect(isLocal('')).toBe(false);
  });
});
