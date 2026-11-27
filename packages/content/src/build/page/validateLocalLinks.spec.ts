import { VFile } from 'vfile';
import { describe, expect, it } from 'vitest';
import { isLocal, validateLocalLinks } from './validateLocalLinks.ts';
import type { Element } from 'hast';

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

describe(validateLocalLinks.name, () => {
  it.each([
    ['/b.png', 'outside the assets'],
    ['../assets/b.png', 'outside the assets'],
    ['/assets/../b.png', 'path contains ..'],
    ['/assets/b.md', 'unknown image type: .md'],
  ])('warns why an image is not served as an asset: %s', (src, why) => {
    expect(readUnservedImage(src)).toContain(why);
  });

  it('accepts an image served as an asset', () => {
    expect(readUnservedImage('/assets/b.png')).toBeUndefined();
  });
});

function readUnservedImage(src: string): string | undefined {
  const image: Element = { type: 'element', tagName: 'img', properties: { src }, children: [] };
  const issues = validateLocalLinks({ type: 'root', children: [image] }, new VFile({ path: 'a.md' }));
  return issues.find(({ ruleId }) => ruleId === 'unserved-image')?.reason;
}
