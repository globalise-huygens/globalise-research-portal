import { Viewer } from 'openseadragon';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';

export function findCenterScan(
  viewer: Viewer,
  canvases: LazyTiledImage[],
): string | null {
  if (!canvases.length) {
    return null;
  }
  const bounds = viewer.viewport.getBounds(true);
  const center = bounds.y + bounds.height / 2;
  let closest = canvases[0];
  let closestDistance = Infinity;

  for (const canvas of canvases) {
    const distance = Math.abs(canvas.y + canvas.height / 2 - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = canvas;
    }
  }
  return closest.canvasId;
}