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
    '/b.png',
    '../assets/b.png',
    '/assets/b.md',
  ])('warns about an image that is not served as an asset: %s', (src) => {
    expect(readImageRules(src)).toContain('unserved-image');
  });

  it('accepts an image served as an asset', () => {
    expect(readImageRules('/assets/b.png')).not.toContain('unserved-image');
  });
});

function readImageRules(src: string): string[] {
  const image: Element = { type: 'element', tagName: 'img', properties: { src }, children: [] };
  const issues = validateLocalLinks({ type: 'root', children: [image] }, new VFile({ path: 'a.md' }));
  return issues.map(({ ruleId }) => ruleId);
}
