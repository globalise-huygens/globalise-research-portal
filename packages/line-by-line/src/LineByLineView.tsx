import React from 'react';
import { Id, Annotation } from '@globalise/common/annotation';
import { NormalizedLayout } from './NormalizedLayout';
import { useLineSegments } from './useLineSegments';

export type LineByLineLayoutProps = {
  canvasId: string;
  annotations: Record<Id, Annotation>;
  style?: React.CSSProperties;
};

export const LineByLineView = React.memo(function LineByLineView(
  { canvasId, annotations }: LineByLineLayoutProps,
) {
  const lineSegments = useLineSegments(canvasId, annotations);

  return <NormalizedLayout canvasId={canvasId} lineSegments={lineSegments}/>;
});