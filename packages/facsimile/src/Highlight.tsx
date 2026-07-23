import React from 'react';
import { noop } from '@globalise/common';
import { HighlightStyle } from './HighlightStyle.tsx';

type HighlightProps = {
  points: string;
  highlightStyle: HighlightStyle;
  onClick?: () => void;
  onHover?: (hovering: boolean, event: React.MouseEvent) => void;
};

export function Highlight(
  {
    points,
    highlightStyle,
    onClick,
    onHover = noop,
  }: HighlightProps) {
  const {
    fill,
    stroke,
    strokeWidth,
    haloStroke,
    haloStrokeWidth,
    cursor,
    vectorEffect,
  } = highlightStyle;
  return (
    <>
      {haloStroke && (
        <polygon
          points={points}
          fill="none"
          stroke={haloStroke}
          strokeWidth={haloStrokeWidth ?? (strokeWidth ?? 0) + 2}
          vectorEffect={vectorEffect}
          style={{ pointerEvents: 'none' }}
        />
      )}
      <polygon
        points={points}
        fill={fill}
        stroke={stroke ?? 'none'}
        strokeWidth={strokeWidth ?? 0}
        vectorEffect={vectorEffect}
        style={{ pointerEvents: 'auto', cursor: cursor ?? 'default' }}
        onClick={() => { onClick?.(); }}
        onMouseEnter={(e) => { onHover(true, e); }}
        onMouseMove={(e) => { onHover(true, e); }}
        onMouseLeave={(e) => { onHover(false, e); }}
      />
    </>
  );
}
