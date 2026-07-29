import { CanvasId } from '../document';

export const canvasName = (id?: CanvasId) => {
  if (!id) {
    return 'unknown-canvas';
  }
  const name = id
    ?.split('/')
    .pop()
    ?.split('_')
    .pop()
    ?? id;

  return name.replace(/^p?0*(?=\d+$)/u, '');
};
