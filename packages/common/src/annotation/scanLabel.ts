import { CanvasId } from '../document';
import { canvasName } from './canvasName';

export function scanNumber(id?: CanvasId) {
  return canvasName(id).replace(/^0+(?=\d)/u, '');
}

export function scanLabel(id?: CanvasId) {
  return `Scan ${scanNumber(id)}`;
}
