import { Vault } from '@iiif/helpers/vault';
import { LazyTiledImage } from '../LazyCollectionViewerModel.ts';
import { getImageServiceId } from '@knaw-huc/osd-iiif-viewer';

export function createLazyTiledImages(
  vault: Vault,
  manifestId: string,
  gap = 0.02,
): LazyTiledImage[] {
  const manifest = vault.get({ id: manifestId, type: 'Manifest' });
  const images: LazyTiledImage[] = [];
  let y = 0;
  for (const item of manifest.items) {
    const canvas = vault.get(item);
    const imageServiceUrl = getImageServiceId(vault, canvas);
    if (!imageServiceUrl) {
      continue;
    }
    const height = canvas.height / canvas.width;
    images.push({
      y,
      height,
      canvasId: canvas.id,
      imageServiceUrl,
    });
    y += height + gap;
  }
  return images;
}