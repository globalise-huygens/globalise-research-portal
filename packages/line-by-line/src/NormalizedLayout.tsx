import React, { useMemo } from 'react';
import { ClassifiedCategory, Id } from '@globalise/common/annotation';
import {
  useCanvasIndexes,
  useHighlightCategories,
  useIsSelectedInLineByLine,
} from '@globalise/common/document';
import { cn } from '@globalise/design';
import { SegmentedLine } from './SegmentedLine';
import { LineSegments } from './useLineSegments';

import './NormalizedLayout.css';

type Props = {
  canvasId: string;
  lineSegments: LineSegments;
  showLayoutElements: boolean;
};

export const NormalizedLayout = React.memo(function NormalizedLayout(
  { canvasId, lineSegments, showLayoutElements }: Props,
) {
  const { segmentsByLine, blockToLines } = lineSegments;
  const highlightCategories = useHighlightCategories();
  const { classifiedToWords } = useCanvasIndexes(canvasId);

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
      className="normalized-view highlight-layers"
      data-layout-elements-visible={showLayoutElements ? 'true' : 'false'}
    >
      <div className="text">
        {blockEntries.map(([blockId, lineIds], i) => (
          <BlockGroup
            key={blockId}
            canvasId={canvasId}
            blockId={blockId}
            lineIds={lineIds}
            segmentsByLine={segmentsByLine}
            lineNumberStart={blockLineNumberStarts[i] + 1}
            highlightCategories={highlightCategories}
            classifiedToWords={classifiedToWords}
          />
        ))}
      </div>
    </div>
  );
});

type BlockGroupProps = {
  canvasId: string;
  blockId: Id;
  lineIds: Id[];
  segmentsByLine: LineSegments['segmentsByLine'];
  lineNumberStart: number;
  highlightCategories: Set<ClassifiedCategory>;
  classifiedToWords: Record<Id, Id[]>;
};

function BlockGroup(
  {
    canvasId, blockId, lineIds, segmentsByLine, lineNumberStart, highlightCategories, classifiedToWords,
  }: BlockGroupProps,
) {
  const isSelected = useIsSelectedInLineByLine(canvasId, blockId);

  let count = 0;

  return (
    <div className={cn(['block-group', isSelected && 'selected'])}>
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
            highlightCategories={highlightCategories}
            classifiedToWords={classifiedToWords}
          />
        );
      })}
    </div>
  );
}
