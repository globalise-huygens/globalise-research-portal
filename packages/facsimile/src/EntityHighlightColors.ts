import type { AnnotationPresentationFamily } from '@globalise/common/annotation';

export type EntityHighlightColors = {
  fill: string;
  hoverFill: string;
};

export function getEntityHighlightColors(
  family?: AnnotationPresentationFamily,
): EntityHighlightColors {
  if (!family) {
    return {
      fill: 'color-mix(in srgb, var(--interaction-teal) 45%, transparent)',
      hoverFill: 'color-mix(in srgb, var(--interaction-teal) 35%, transparent)',
    };
  }

  return {
    fill: `color-mix(in srgb, var(--annotation-${family}-selected) 45%, transparent)`,
    hoverFill: `color-mix(in srgb, var(--annotation-${family}-hover) 35%, transparent)`,
  };
}
