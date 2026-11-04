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
  const preferredTop = cardHeight <= spaceBelow ? belowTop
    : cardHeight <= spaceAbove ? aboveTop
      : spaceBelow >= spaceAbove ? belowTop : aboveTop;
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
  const left = parent.right + gap + width <= viewportWidth - margin
    ? parent.right + gap
    : parent.left - gap - width >= margin ? parent.left - gap - width : undefined;
  return left === undefined
    ? placePopoverCard(parent, width, height, viewportWidth, viewportHeight)
    : { left, top: clamp(parent.top, margin, Math.max(margin, viewportHeight - height - margin)), visibility: 'visible' };
}
