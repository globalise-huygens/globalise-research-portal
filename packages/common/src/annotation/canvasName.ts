import { CanvasId } from '../document';

export const canvasName = (id?: CanvasId) => {
  if (!id) {
    return 'unknown-canvas';
  }
  return id
    ?.split('/')
    .pop()
    ?.split('_')
    .pop()
    ?? id;
};
