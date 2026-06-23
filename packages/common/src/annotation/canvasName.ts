import { CanvasId } from '../document';

export const canvasName = (id?: CanvasId) => id?.split('/').pop() ?? 'unknown-canvas';
