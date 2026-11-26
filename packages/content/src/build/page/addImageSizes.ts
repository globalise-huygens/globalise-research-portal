import { existsSync } from 'node:fs';
import { imageSizeFromFile } from 'image-size/fromFile';
import { visit } from 'unist-util-visit';
import { isLocal, resolveLink } from './validateLocalLinks.ts';
import type { Element, Root } from 'hast';
import type { VFile } from 'vfile';

/**
 * Size local images, so browsers reserve their space before they load
 */
export async function addImageSizes(tree: Root, source: VFile): Promise<void> {
  const images: Element[] = [];
  visit(tree, 'element', (node) => {
    if (node.tagName === 'img') {
      images.push(node);
    }
  });
  await Promise.all(images.map((image) => addImageSize(image, source)));
}

async function addImageSize(image: Element, source: VFile): Promise<void> {
  const { src, width, height } = image.properties;
  if (typeof src !== 'string' || !isLocal(src) || width || height) {
    return;
  }
  const file = resolveLink(source, src);
  if (!existsSync(file)) {
    return;
  }
  const size = await imageSizeFromFile(file);
  image.properties.width = size.width;
  image.properties.height = size.height;
}
