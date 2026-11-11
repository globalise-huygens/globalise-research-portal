import { ClassifiedTone } from '@globalise/common/annotation';

export type EntityHighlightTone = ClassifiedTone;

export type EntityHighlightColors = {
  fill: string;
};

export function getEntityHighlightColors(
  tone?: EntityHighlightTone,
): EntityHighlightColors {
  if (!tone) {
    return {
      fill: 'color-mix(in srgb, var(--color-brand-turquoise, #29bfcc) 45%, transparent)',
    };
  }

  const tokenName = tone.replace('cidoc-', '');
  const mainColor = `var(--color-entity-${tokenName})`;
  const color = tone === 'cidoc-conceptual-object'
    ? `color-mix(in srgb, ${mainColor} 65%, var(--color-entity-conceptual-object-light, #f4e3bd))`
    : mainColor;

  return {
    fill: `color-mix(in srgb, ${color} 45%, transparent)`,
  };
}
