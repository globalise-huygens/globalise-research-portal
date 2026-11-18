import { describe, expect, it } from 'vitest';
import { isLocal } from './validateLocalLinks.ts';

describe(isLocal.name, () => {
  it.each([
    'a.md',
    '../a.md',
    'b/a.png',
    '/b/a.md',
    'a.md#b',
  ])('accepts relative and root path: %s', (link) => {
    expect(isLocal(link)).toBe(true);
  });

  it.each([
    'https://foo.bar',
    'mailto:foo@bar.baz',
    '//foo.bar/a.png',
  ])('rejects external link: %s', (link) => {
    expect(isLocal(link)).toBe(false);
  });

  it('rejects anchor', () => {
    expect(isLocal('#a')).toBe(false);
  });

  it('rejects empty link', () => {
    expect(isLocal('')).toBe(false);
  });
});
