import React, { useMemo } from 'react';
import { Annotation, findSourceLabel, Id } from '@globalise/common/annotation';
import { useIsSelectedInTranscription } from '@globalise/common/document';
import { SegmentedLine } from './SegmentedLine';
import { LineSegments, useLineSegments } from './useLineSegments';

import './LineByLineView.css';

export type LineByLineViewProps = {
  canvasId: string;
  annotations: Record<Id, Annotation>;
  showLayoutElements?: boolean;
};

export const LineByLineView = React.memo(function LineByLineView(
  { canvasId, annotations, showLayoutElements = true }: LineByLineViewProps,
) {
  const lineSegments = useLineSegments(canvasId, annotations);
  const { segmentsByLine, blockToLines, lineNumberById } = lineSegments;
  const blockEntries = useMemo(() => Object.entries(blockToLines), [blockToLines]);

  return (
    <div
      className="line-by-line-view"
      data-layout-elements-visible={showLayoutElements ? 'true' : 'false'}
    >
      <div className="text">
        {blockEntries.map(([blockId, lineIds]) => (
          <BlockGroup
            key={blockId}
            canvasId={canvasId}
            annotation={annotations[blockId]}
            blockId={blockId}
            lineIds={lineIds}
            segmentsByLine={segmentsByLine}
            lineNumberById={lineNumberById}
            showLayoutElements={showLayoutElements}
          />
        ))}
      </div>
    </div>
  );
});

type BlockGroupProps = {
  canvasId: string;
  annotation?: Annotation;
  blockId: Id;
  lineIds: Id[];
  segmentsByLine: LineSegments['segmentsByLine'];
  lineNumberById: Record<Id, number>;
  showLayoutElements: boolean;
};

function BlockGroup(
  {
    canvasId,
    annotation,
    blockId,
    lineIds,
    segmentsByLine,
    lineNumberById,
    showLayoutElements,
  }: BlockGroupProps,
) {
  const isSelected = useIsSelectedInTranscription(canvasId, blockId);
  const renderedLineIds = lineIds.filter((id) => segmentsByLine[id]);

  if (!renderedLineIds.length) {
    return null;
  }

  const layoutLabel = annotation
    ? findSourceLabel(annotation)
    : 'Layout element';
  return (
    <div
      className={`block-group ${isSelected ? 'selected' : ''}`}
    >
      {showLayoutElements && (
        <span className="layout-element-label" aria-hidden="true">
          {layoutLabel}
        </span>
      )}
      {renderedLineIds.map((lineId) => {
        const segments = segmentsByLine[lineId];
        return (
          <SegmentedLine
            key={lineId}
            canvasId={canvasId}
            lineId={lineId}
            lineNumber={lineNumberById[lineId]}
            blockId={blockId}
            segments={segments}
          />
        );
      })}
    </div>
  );
}
