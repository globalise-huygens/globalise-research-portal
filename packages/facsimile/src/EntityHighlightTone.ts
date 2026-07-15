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
  switch (tone) {
    case 'cidoc-actor':
      return {
        fill: 'rgba(255, 189, 202, 0.38)',
        hoverFill: 'rgba(255, 189, 202, 0.3)',
        stroke: 'rgba(154, 79, 96, 0.95)',
      };
    case 'cidoc-appellation':
      return {
        fill: 'rgba(254, 243, 186, 0.42)',
        hoverFill: 'rgba(254, 243, 186, 0.34)',
        stroke: 'rgba(138, 111, 0, 0.95)',
      };
    case 'cidoc-conceptual-object':
      return {
        fill: 'rgba(253, 220, 52, 0.36)',
        hoverFill: 'rgba(253, 220, 52, 0.28)',
        stroke: 'rgba(133, 111, 0, 0.95)',
      };
    case 'cidoc-dimension':
      return {
        fill: 'rgba(230, 228, 236, 0.42)',
        hoverFill: 'rgba(230, 228, 236, 0.34)',
        stroke: 'rgba(109, 95, 120, 0.95)',
      };
    case 'cidoc-physical-thing':
      return {
        fill: 'rgba(225, 186, 156, 0.38)',
        hoverFill: 'rgba(225, 186, 156, 0.3)',
        stroke: 'rgba(122, 86, 61, 0.95)',
      };
    case 'cidoc-place':
      return {
        fill: 'rgba(148, 204, 125, 0.36)',
        hoverFill: 'rgba(148, 204, 125, 0.28)',
        stroke: 'rgba(63, 111, 49, 0.95)',
      };
    case 'cidoc-time-span':
      return {
        fill: 'rgba(134, 188, 200, 0.38)',
        hoverFill: 'rgba(134, 188, 200, 0.3)',
        stroke: 'rgba(53, 106, 117, 0.95)',
      };
    case 'cidoc-type':
      return {
        fill: 'rgba(250, 181, 101, 0.34)',
        hoverFill: 'rgba(250, 181, 101, 0.26)',
        stroke: 'rgba(143, 82, 0, 0.95)',
      };
    default:
      return {
        fill: 'var(--color-selection-fill, rgb(41 191 204 / 0.22))',
        hoverFill: 'var(--color-selection-fill-hover, rgb(41 191 204 / 0.14))',
        stroke: 'var(--color-selection-stroke, #125e64)',
      };
  }
}
