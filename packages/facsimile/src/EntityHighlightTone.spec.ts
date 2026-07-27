import { describe, expect, it } from 'vitest';
import { getEntityHighlightColors } from './EntityHighlightTone';

describe('getEntityHighlightColors', () => {
  it('derives facsimile colors from the shared entity tokens', () => {
    expect(getEntityHighlightColors('cidoc-physical-thing')).toEqual({
      fill: 'color-mix(in srgb, var(--color-entity-physical-thing) 38%, transparent)',
      hoverFill:
        'color-mix(in srgb, var(--color-entity-physical-thing) 30%, transparent)',
      stroke:
        'color-mix(in srgb, var(--color-entity-physical-thing-strong) 95%, transparent)',
    });
  });

  it('uses the cross-view selection tokens without an entity category', () => {
    expect(getEntityHighlightColors()).toEqual({
      fill: 'var(--color-selection-fill, rgb(41 191 204 / 0.22))',
      hoverFill:
        'var(--color-selection-fill-hover, rgb(41 191 204 / 0.14))',
      stroke: 'var(--color-selection-stroke, #125e64)',
    });
  });
});
