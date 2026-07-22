import type { HighlightStyle } from './HighlightStyle.tsx';

export function getBlockHighlightStyle(
  selected: boolean,
  hovered: boolean,
): HighlightStyle {
  const isActive = selected || hovered;

  return {
    fill: selected
      ? 'var(--color-layout-element-fill-strong, rgb(41 191 204 / 0.13))'
      : hovered
        ? 'var(--color-layout-element-fill, rgb(41 191 204 / 0.08))'
        : 'transparent',
    stroke: isActive
      ? 'var(--color-layout-element-stroke-strong, #125e64)'
      : 'var(--color-layout-element-stroke, rgb(18 94 100 / 0.38))',
    strokeWidth: isActive ? 2 : 1,
    haloStroke:
      'var(--color-layout-element-halo, rgb(255 255 255 / 0.78))',
    haloStrokeWidth: isActive ? 4 : 2.5,
    vectorEffect: 'non-scaling-stroke',
  };
}
