import { Viewer } from 'openseadragon';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';

export function findCenterScan(
  viewer: Viewer,
  canvases: LazyTiledImage[],
): number {
  const bounds = viewer.viewport.getBounds(true);
  const center = bounds.y + bounds.height / 2;
  let closest = 0;
  let closestDistance = Infinity;

  for (let i = 0; i < canvases.length; i++) {
    const { y, height } = canvases[i];
    const distance = Math.abs(y + height / 2 - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = i;
    }
  }
  return closest;
}