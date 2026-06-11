import { Rect, Viewer } from 'openseadragon';
import { LazyTiledImage } from '../LazyCollectionViewerModel.ts';

export function fitLayout(
  viewer: Viewer,
  canvas: LazyTiledImage,
  heightViewportFraction?: number,
) {
  const aspect = viewer.viewport.getAspectRatio();
  const viewportHeight = heightViewportFraction
    ? canvas.height / heightViewportFraction
    : canvas.height;
  const viewportWidth = viewportHeight * aspect;
  const rect = new Rect(
    0.5 - viewportWidth / 2,
    canvas.y - (viewportHeight - canvas.height) / 2,
    viewportWidth,
    viewportHeight,
  );
  viewer.viewport.fitBounds(rect, !!heightViewportFraction);
}