import React, { useMemo } from 'react';
import { Annotation, findSourceLabel, Id } from '@globalise/common/annotation';
import {
  copySelectedTranscriptionLines,
  setHovered,
  useIsSelectedInTranscription,
} from '@globalise/common/document';
import { SegmentedLine } from './SegmentedLine';
import { LineSegments } from './useLineSegments';

import './NormalizedLayout.css';

type Props = {
  canvasId: string;
  annotations: Record<Id, Annotation>;
  lineSegments: LineSegments;
  showLayoutElements: boolean;
};

export const NormalizedLayout = React.memo(function NormalizedLayout(
  { canvasId, annotations, lineSegments, showLayoutElements }: Props,
) {
  const { segmentsByLine, blockToLines, lineNumberById } = lineSegments;

  const blockEntries = useMemo(() => Object.entries(blockToLines), [blockToLines]);

  return (
    <div
      className="normalized-view"
      data-layout-elements-visible={showLayoutElements ? 'true' : 'false'}
      onCopy={(event) => {
        if (showLayoutElements) {
          copySelectedTranscriptionLines(
            event,
            event.currentTarget,
            lineSegments.pageText,
          );
        }
      }}
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

  const lineNumberStart = lineNumberById[renderedLineIds[0]];
  const lineNumberEnd = lineNumberById[
    renderedLineIds[renderedLineIds.length - 1]
  ];
  const layoutLabel = annotation
    ? findSourceLabel(annotation)
    : 'Layout element';
  const lineRange = lineNumberStart === lineNumberEnd
    ? `line ${lineNumberStart}`
    : `lines ${lineNumberStart} to ${lineNumberEnd}`;

  return (
    <div
      aria-label={`${layoutLabel}, ${lineRange}`}
      className={`block-group ${isSelected ? 'selected' : ''}`}
      onBlur={() => setHovered(null)}
      onFocus={() => setHovered(blockId)}
      role="group"
      tabIndex={showLayoutElements ? 0 : undefined}
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
