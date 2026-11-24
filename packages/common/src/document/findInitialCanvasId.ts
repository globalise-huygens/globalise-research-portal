import type { CanvasId } from './ManifestViewerSlice';
import { type ViewerRef, createCanvasId } from '../uri';

export function findInitialCanvasId(
  ref: ViewerRef,
  activeHitCanvasId?: CanvasId,
): CanvasId | undefined {
  if ('endPage' in ref) {
    return activeHitCanvasId ?? createCanvasId(ref);
  }
  if ('page' in ref) {
    return createCanvasId(ref);
  }
  return activeHitCanvasId;
}
