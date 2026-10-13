import { placeEntityPreview } from '@globalise/design';
import type { CSSProperties } from 'react';

// Follow the manifest stack: right if it fits, otherwise left, then below.
export function placeResourcePreviewBeside(
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
