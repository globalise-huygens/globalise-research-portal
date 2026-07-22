import { describe, expect, it } from 'vitest';
import { getBlockHighlightStyle } from './BlockHighlightStyle';

describe('getBlockHighlightStyle', () => {
  it('uses a quiet turquoise outline at rest', () => {
    const style = getBlockHighlightStyle(false, false);

    expect(style.fill).toBe('transparent');
    expect(style.stroke).toBe(
      'var(--color-layout-element-stroke, rgb(18 94 100 / 0.38))',
    );
    expect(style.strokeWidth).toBe(1);
  });

  it('uses the light wash and strong edge on hover', () => {
    const style = getBlockHighlightStyle(false, true);

    expect(style.fill).toBe(
      'var(--color-layout-element-fill, rgb(41 191 204 / 0.08))',
    );
    expect(style.stroke).toBe(
      'var(--color-layout-element-stroke-strong, #125e64)',
    );
    expect(style.strokeWidth).toBe(2);
  });

  it('uses the stronger wash when selected', () => {
    const style = getBlockHighlightStyle(true, false);

    expect(style.fill).toBe(
      'var(--color-layout-element-fill-strong, rgb(41 191 204 / 0.13))',
    );
    expect(style.stroke).toBe(
      'var(--color-layout-element-stroke-strong, #125e64)',
    );
  });
});
