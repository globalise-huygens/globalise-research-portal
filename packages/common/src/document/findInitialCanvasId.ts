import type { CanvasId } from './ManifestViewerSlice';
import { createCanvasId, parseDocumentName } from '../uri';

export function findInitialCanvasId(
  { canvas, document }: { canvas?: CanvasId; document?: string },
  activeHitCanvasId?: CanvasId,
): CanvasId | undefined {
  if (canvas) {
    return canvas;
  }
  if (activeHitCanvasId) {
    return activeHitCanvasId;
  }
  if (document) {
    const range = parseDocumentName(document);
    return range && createCanvasId(range);
  }
  return undefined;
}
