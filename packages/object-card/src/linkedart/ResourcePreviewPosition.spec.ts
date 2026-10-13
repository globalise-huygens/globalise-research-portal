import { describe, expect, it, vi } from 'vitest';
import { placeResourcePreviewBeside } from './ResourcePreviewPosition.ts';

vi.mock('../../../common/src/util/getSVGElement.ts', () => ({ getSVGElement: vi.fn() }));

describe('linked preview placement', () => {
  it('opens beside its parent on the right', () => {
    expect(placeResourcePreviewBeside({ left: 100, right: 360, top: 100, bottom: 250 }, 260, 150, 1000, 600))
      .toMatchObject({ left: 368, top: 100 });
  });
  it('uses the left when the right does not fit', () => {
    expect(placeResourcePreviewBeside({ left: 600, right: 860, top: 100, bottom: 250 }, 260, 150, 1000, 600))
      .toMatchObject({ left: 332, top: 100 });
  });
  it('uses viewport-aware placement when neither side fits', () => {
    expect(placeResourcePreviewBeside({ left: 8, right: 268, top: 100, bottom: 250 }, 260, 150, 320, 600))
      .toMatchObject({ left: 8, top: 258 });
  });
});
