import type { CSSProperties } from 'react';

export function placeEntityPreview(
  anchor: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>,
  cardWidth: number,
  cardHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): CSSProperties {
  const margin = 8;
  const gap = 8;
  const clamp = (value: number, maximum: number) => Math.min(Math.max(value, margin), Math.max(margin, maximum));
  const belowTop = anchor.bottom + gap;
  const aboveTop = anchor.top - cardHeight - gap;
  const spaceBelow = viewportHeight - margin - belowTop;
  const spaceAbove = anchor.top - gap - margin;
  const preferredTop = cardHeight <= spaceBelow ? belowTop
    : cardHeight <= spaceAbove ? aboveTop
      : spaceBelow >= spaceAbove ? belowTop : aboveTop;
  return {
    left: clamp(anchor.left, viewportWidth - cardWidth - margin),
    top: clamp(preferredTop, viewportHeight - cardHeight - margin),
    visibility: 'visible',
  };
}

// Follow the manifest stack: right if it fits, otherwise left, then below.
export function placeEntityPreviewBeside(
  parent: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
): CSSProperties {
  const margin = 8;
  const gap = 8;
  const left = parent.right + gap + width <= viewportWidth - margin
    ? parent.right + gap
    : parent.left - gap - width >= margin ? parent.left - gap - width : undefined;
  return left === undefined
    ? placeEntityPreview(parent, width, height, viewportWidth, viewportHeight)
    : { left, top: Math.max(margin, Math.min(parent.top, viewportHeight - height - margin)), visibility: 'visible' };
}
