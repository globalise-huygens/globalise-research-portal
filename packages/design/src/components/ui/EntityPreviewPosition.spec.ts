import { describe, expect, it } from 'vitest';
import { placeEntityPreview, placeEntityPreviewBeside } from './EntityPreviewPosition';

describe('shared entity preview placement', () => {
  it('places the preview below its link when it fits', () => {
    expect(placeEntityPreview({ left: 100, right: 150, top: 100, bottom: 120 }, 260, 150, 800, 600))
      .toMatchObject({ left: 100, top: 128 });
  });
  it('moves above the link near the viewport bottom', () => {
    expect(placeEntityPreview({ left: 100, right: 150, top: 500, bottom: 520 }, 260, 150, 800, 600))
      .toMatchObject({ left: 100, top: 342 });
  });
  it('keeps a preview inside the viewport at its right edge', () => {
    expect(placeEntityPreview({ left: 790, right: 800, top: 100, bottom: 120 }, 260, 150, 800, 600))
      .toMatchObject({ left: 532, top: 128 });
  });
});

describe('linked preview placement', () => {
  it('opens beside its parent on the right', () => {
    expect(placeEntityPreviewBeside({ left: 100, right: 360, top: 100, bottom: 250 }, 260, 150, 1000, 600))
      .toMatchObject({ left: 368, top: 100 });
  });
  it('uses the left when the right does not fit', () => {
    expect(placeEntityPreviewBeside({ left: 600, right: 860, top: 100, bottom: 250 }, 260, 150, 1000, 600))
      .toMatchObject({ left: 332, top: 100 });
  });
  it('uses viewport-aware placement when neither side fits', () => {
    expect(placeEntityPreviewBeside({ left: 8, right: 268, top: 100, bottom: 250 }, 260, 150, 320, 600))
      .toMatchObject({ left: 8, top: 258 });
  });
});
