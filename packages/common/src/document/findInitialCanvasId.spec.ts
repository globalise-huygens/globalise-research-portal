import { describe, expect, it } from 'vitest';
import { findInitialCanvasId } from './findInitialCanvasId';
import { createCanvasId } from '../uri';

const inventory = { inventory: '1053' };
const scan = { ...inventory, page: '0004' };
const document = { ...inventory, page: '0003', endPage: '0071' };

describe(findInitialCanvasId.name, () => {
  it('prefers the canvas of the scan path, even with an active hit', () => {
    expect(findInitialCanvasId(scan, 'hit')).toBe(createCanvasId(scan));
  });

  it('uses the canvas of the active hit within a document', () => {
    expect(findInitialCanvasId(document, 'hit')).toBe('hit');
  });

  it('uses the first page of the document without an active hit', () => {
    const firstScan = createCanvasId({ ...inventory, page: '0003' });
    expect(findInitialCanvasId(document, null)).toBe(firstScan);
  });

  it('uses the canvas of the active hit within an inventory', () => {
    expect(findInitialCanvasId(inventory, 'hit')).toBe('hit');
  });

  it('finds no canvas without scan path, active hit and document', () => {
    expect(findInitialCanvasId(inventory, null)).toBeNull();
  });
});
