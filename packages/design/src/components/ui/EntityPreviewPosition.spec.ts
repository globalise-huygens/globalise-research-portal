import { describe, expect, it } from 'vitest';
import { placeEntityPreview } from './EntityPreviewPosition';

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
