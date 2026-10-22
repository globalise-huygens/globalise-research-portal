import type { CanvasId } from './ManifestViewerSlice';

export type CanvasTextLength = {
  canvasId: CanvasId;
  length: number;
};

export function findCanvasAtCharOffset(
  canvases: CanvasTextLength[],
  charOffset: number,
): CanvasId | undefined {
  let end = 0;
  for (const { canvasId, length } of canvases) {
    end += length;
    if (charOffset < end) {
      return canvasId;
    }
  }
}
