import { describe, expect, it } from 'vitest';
import { findCanvasAtCharOffset } from './findCanvasAtCharOffset.ts';

const canvases = [
  { canvasId: 'first', length: 10 },
  { canvasId: 'empty', length: 0 },
  { canvasId: 'last', length: 5 },
];

describe(findCanvasAtCharOffset.name, () => {
  it('finds canvas at offset', () => {
    expect(findCanvasAtCharOffset(canvases, 3)).toBe('first');
  });

  it('skips empty canvases at a canvas boundary', () => {
    expect(findCanvasAtCharOffset(canvases, 10)).toBe('last');
  });

  it('returns undefined when the offset is beyond all canvases', () => {
    expect(findCanvasAtCharOffset(canvases, 15)).toBeUndefined();
  });
});
