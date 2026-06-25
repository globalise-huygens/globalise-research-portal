const ATTRIBUTE = 'data-canvas-index';

export const canvasIndexAttribute = ATTRIBUTE;

export const canvasIndexSelector = `[${ATTRIBUTE}]`;

export function getCanvasIndex(el: HTMLElement): number | null {
  const value = el.dataset.canvasIndex;
  if (!value) {
    return null;
  }
  const index = parseInt(value, 10);
  return Number.isNaN(index) ? null : index;
}