import React from 'react';
import { noop } from '@globalise/common';
import { HighlightStyle } from './HighlightStyle.tsx';

type HighlightProps = {
  points: string;
  highlightStyle: HighlightStyle;
  ariaLabel?: string;
  onClick?: () => void;
  onFocusChange?: (focused: boolean) => void;
  onHover?: (hovering: boolean, event: React.MouseEvent) => void;
};

export function Highlight(
  {
    points,
    highlightStyle,
    ariaLabel,
    onClick,
    onFocusChange,
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
  const isFocusable = onClick !== undefined || onFocusChange !== undefined;

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
        aria-label={ariaLabel}
        points={points}
        fill={fill}
        stroke={stroke ?? 'none'}
        strokeWidth={strokeWidth ?? 0}
        vectorEffect={vectorEffect}
        style={{ pointerEvents: 'auto', cursor: cursor ?? 'default' }}
        role={onClick ? 'button' : isFocusable ? 'group' : undefined}
        tabIndex={isFocusable ? 0 : undefined}
        onBlur={() => { onFocusChange?.(false); }}
        onClick={() => { onClick?.(); }}
        onFocus={() => { onFocusChange?.(true); }}
        onKeyDown={(event) => {
          if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
          }
        }}
        onMouseEnter={(e) => { onHover(true, e); }}
        onMouseMove={(e) => { onHover(true, e); }}
        onMouseLeave={(e) => { onHover(false, e); }}
      />
    </>
  );
}
