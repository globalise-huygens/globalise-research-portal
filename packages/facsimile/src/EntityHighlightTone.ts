import type { EntityVisualCategoryClassName } from '@globalise/common/annotation';

export type EntityHighlightTone =
  EntityVisualCategoryClassName;

export type EntityHighlightColors = {
  fill: string;
  hoverFill: string;
  stroke: string;
};

export function getEntityHighlightColors(
  tone?: EntityHighlightTone,
): EntityHighlightColors {
  if (!tone) {
    return {
      fill: 'var(--color-selection-fill, rgb(41 191 204 / 0.22))',
      hoverFill: 'var(--color-selection-fill-hover, rgb(41 191 204 / 0.14))',
      stroke: 'var(--color-selection-stroke, #125e64)',
    };
  }

  const tokenName = tone.replace('cidoc-', '');
  const color = `var(--color-entity-${tokenName})`;
  const strongColor = `var(--color-entity-${tokenName}-strong)`;

  return {
    fill: `color-mix(in srgb, ${color} 38%, transparent)`,
    hoverFill: `color-mix(in srgb, ${color} 30%, transparent)`,
    stroke: `color-mix(in srgb, ${strongColor} 95%, transparent)`,
  };
}
