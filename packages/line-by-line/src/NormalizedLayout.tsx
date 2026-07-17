import React, { useMemo } from 'react';
import { Annotation, findSourceLabel, Id } from '@globalise/common/annotation';
import {
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
  const { segmentsByLine, blockToLines } = lineSegments;

  const blockEntries = useMemo(() => Object.entries(blockToLines), [blockToLines]);

  const blockLineNumberStarts = useMemo(() => {
    const starts: number[] = [];
    let count = 0;
    for (const [, lineIds] of blockEntries) {
      starts.push(count);
      count += lineIds.filter((id) => segmentsByLine[id]).length;
    }
    return starts;
  }, [blockEntries, segmentsByLine]);

  return (
    <div
      className="normalized-view"
      data-layout-elements-visible={showLayoutElements ? 'true' : 'false'}
    >
      <div className="text">
        {blockEntries.map(([blockId, lineIds], i) => (
          <BlockGroup
            key={blockId}
            canvasId={canvasId}
            annotation={annotations[blockId]}
            blockId={blockId}
            lineIds={lineIds}
            segmentsByLine={segmentsByLine}
            lineNumberStart={blockLineNumberStarts[i] + 1}
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
  lineNumberStart: number;
  showLayoutElements: boolean;
};

function BlockGroup(
  {
    canvasId,
    annotation,
    blockId,
    lineIds,
    segmentsByLine,
    lineNumberStart,
    showLayoutElements,
  }: BlockGroupProps,
) {
  const isSelected = useIsSelectedInTranscription(canvasId, blockId);
  const renderedLineCount = lineIds.filter((id) => segmentsByLine[id]).length;
  const lineNumberEnd = lineNumberStart + renderedLineCount - 1;
  const layoutLabel = annotation
    ? findSourceLabel(annotation)
    : 'Layout element';
  const lineRange = lineNumberStart === lineNumberEnd
    ? `line ${lineNumberStart}`
    : `lines ${lineNumberStart} to ${lineNumberEnd}`;

  let count = 0;

  return (
    <div
      aria-label={`${layoutLabel}, ${lineRange}`}
      className={`block-group ${isSelected ? 'selected' : ''}`}
      onBlur={() => setHovered(null)}
      onFocus={() => setHovered(blockId)}
      role="group"
      tabIndex={showLayoutElements ? 0 : undefined}
    >
      {lineIds.map((lineId) => {
        const segments = segmentsByLine[lineId];
        if (!segments) {
          return null;
        }
        count++;
        return (
          <SegmentedLine
            key={lineId}
            canvasId={canvasId}
            lineId={lineId}
            lineNumber={lineNumberStart + count - 1}
            blockId={blockId}
            segments={segments}
          />
        );
      })}
    </div>
  );
}
