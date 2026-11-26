import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { VFile } from 'vfile';
import { addImageSizes } from './addImageSizes.ts';
import type { Element, Properties, Root } from 'hast';

describe(addImageSizes.name, () => {
  let source: VFile;

  beforeEach(() => {
    const contentDir = mkdtempSync(join(tmpdir(), 'content-'));
    writeFileSync(
      join(contentDir, 'foo.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"/>'
    );
    source = new VFile({ cwd: contentDir, path: join(contentDir, 'bar.md') });
  });

  it('sizes local images', async () => {
    const image = createImage({ src: '/foo.svg' });
    await addImageSizes(createTree(image), source);
    expect(image.properties).toEqual({ src: '/foo.svg', width: 40, height: 20 });
  });

  it('keeps sizes set by the author', async () => {
    const image = createImage({ src: '/foo.svg', width: 10 });
    await addImageSizes(createTree(image), source);
    expect(image.properties).toEqual({ src: '/foo.svg', width: 10 });
  });

  it('skips external and missing images', async () => {
    const external = createImage({ src: 'https://foo.bar/baz.png' });
    const missing = createImage({ src: '/baz.png' });
    await addImageSizes(createTree(external, missing), source);
    expect(external.properties).toEqual({ src: 'https://foo.bar/baz.png' });
    expect(missing.properties).toEqual({ src: '/baz.png' });
  });
});

function createImage(properties: Properties): Element {
  return { type: 'element', tagName: 'img', properties, children: [] };
}

function createTree(...children: Element[]): Root {
  return { type: 'root', children };
}
