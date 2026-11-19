import { clamp } from '@globalise/common';
import type { CSSProperties } from 'react';

export function placePopoverCard(
  anchor: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>,
  cardWidth: number,
  cardHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): CSSProperties {
  const margin = 8;
  const gap = 8;
  const maximumLeft = Math.max(margin, viewportWidth - cardWidth - margin);
  const maximumTop = Math.max(margin, viewportHeight - cardHeight - margin);
  const belowTop = anchor.bottom + gap;
  const aboveTop = anchor.top - cardHeight - gap;
  const spaceBelow = viewportHeight - margin - belowTop;
  const spaceAbove = anchor.top - gap - margin;
  const fitsBelow = cardHeight <= spaceBelow;
  const fitsAbove = cardHeight <= spaceAbove;
  const hasMoreSpaceBelow = spaceBelow >= spaceAbove;
  let preferredTop = belowTop;

  if (!fitsBelow && (fitsAbove || !hasMoreSpaceBelow)) {
    preferredTop = aboveTop;
  }

  return {
    left: clamp(anchor.left, margin, maximumLeft),
    top: clamp(preferredTop, margin, maximumTop),
    visibility: 'visible',
  };
}

export function placePopoverCardBeside(
  parent: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
): CSSProperties {
  const margin = 8;
  const gap = 8;
  const rightSideLeft = parent.right + gap;
  const leftSideLeft = parent.left - gap - width;
  const fitsOnRight = rightSideLeft + width <= viewportWidth - margin;
  const fitsOnLeft = leftSideLeft >= margin;

  if (!fitsOnRight && !fitsOnLeft) {
    return placePopoverCard(parent, width, height, viewportWidth, viewportHeight);
  }

  const left = fitsOnRight ? rightSideLeft : leftSideLeft;
  const maximumTop = Math.max(margin, viewportHeight - height - margin);
  const top = clamp(parent.top, margin, maximumTop);

  return { left, top, visibility: 'visible' };
}
