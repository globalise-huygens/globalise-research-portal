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
    onClick = noop,
    onHover = noop,
  }: HighlightProps) {
  const {
    fill,
    stroke,
    strokeWidth,
    cursor,
    vectorEffect,
    omitLeftStroke,
    omitRightStroke,
  } = highlightStyle;
  const partialStroke = stroke && (omitLeftStroke || omitRightStroke)
    ? getPartialStrokePath(points, omitLeftStroke, omitRightStroke)
    : null;

  return (
    <>
      <polygon
        points={points}
        fill={fill}
        stroke={partialStroke ? 'none' : (stroke ?? 'none')}
        strokeWidth={strokeWidth ?? 0}
        vectorEffect={vectorEffect}
        style={{ pointerEvents: 'auto', cursor: cursor ?? 'default' }}
        onClick={() => { onClick(); }}
        onMouseEnter={(e) => { onHover(true, e); }}
        onMouseMove={(e) => { onHover(true, e); }}
        onMouseLeave={(e) => { onHover(false, e); }}
      />
      {partialStroke && (
        <path
          d={partialStroke}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth ?? 0}
          vectorEffect={vectorEffect}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </>
  );
}

function getPartialStrokePath(
  points: string,
  omitLeft?: boolean,
  omitRight?: boolean,
): string | null {
  const values = points.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)?.map(Number);
  if (!values || values.length < 6 || values.length % 2 !== 0) {
    return null;
  }

  const vertices: [number, number][] = [];
  for (let index = 0; index < values.length; index += 2) {
    vertices.push([values[index], values[index + 1]]);
  }
  const edges = vertices.map((start, index) => ({
    start,
    end: vertices[(index + 1) % vertices.length],
    midpointX: (start[0] + vertices[(index + 1) % vertices.length][0]) / 2,
  }));
  const leftEdge = edges.reduce((left, edge) =>
    edge.midpointX < left.midpointX ? edge : left);
  const rightEdge = edges.reduce((right, edge) =>
    edge.midpointX > right.midpointX ? edge : right);

  return edges
    .filter((edge) => !(omitLeft && edge === leftEdge))
    .filter((edge) => !(omitRight && edge === rightEdge))
    .map(({ start, end }) => `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`)
    .join(' ');
}
