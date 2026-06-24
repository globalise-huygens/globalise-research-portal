import React from 'react';
import {Id, Annotation, canvasName} from '@globalise/common/annotation';
import { NormalizedLayout } from './NormalizedLayout';
import { useLineSegments } from './useLineSegments';
import { CanvasId } from '@globalise/common/document';

export type LineByLineLayoutProps = {
  canvasId: CanvasId;
  annotations: Record<Id, Annotation>;
};

export const LineByLineView = React.memo(function LineByLineView(
  { annotations, canvasId }: LineByLineLayoutProps,
) {
  console.log(new Date().toISOString(), 'render', LineByLineView.name, canvasName(canvasId));
  const lineSegments = useLineSegments(annotations);

  return <NormalizedLayout lineSegments={lineSegments}/>;
});