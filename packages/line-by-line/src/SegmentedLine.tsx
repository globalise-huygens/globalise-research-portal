import { memo, useEffect, useMemo, useRef } from 'react';
import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import { Annotation, ClassifiedCategory, Id } from '@globalise/common/annotation';
import {
  setHovered,
  useActiveHitAnnotationsInLineByLine,
  useIsClickedInLineByLine,
  useSelectedAnnotationsInLineByLine,
} from '@globalise/common/document';
import { SegmentedText } from './SegmentedText';

type LineProps = {
  canvasId: string;
  lineId: Id;
  lineNumber: number;
  blockId: Id | null;
  segments: TextSegment<Annotation>[];
  highlightCategories: Set<ClassifiedCategory>;
  classifiedToWords: Record<Id, Id[]>;
};

export const SegmentedLine = memo(function SegmentedLine(
  {
    canvasId, lineId, lineNumber, blockId, segments, highlightCategories, classifiedToWords,
  }: LineProps,
) {
  const annotationIds = useMemo(
    () => new Set(segments.flatMap((segment) => segment.annotations.map((annotation) => annotation.id))),
    [segments],
  );
  const selectedIds = useSelectedAnnotationsInLineByLine(canvasId, annotationIds);
  const activeHitIds = useActiveHitAnnotationsInLineByLine(canvasId, annotationIds);
  const isClicked = useIsClickedInLineByLine(canvasId, annotationIds);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isClicked && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isClicked]);

  return (
    <span
      ref={ref}
      className="line"
      data-line-id={lineId}
      onMouseEnter={() => {
        if (blockId) {
          setHovered(blockId);
        }
      }}
      onMouseLeave={() => { setHovered(null); }}
    >
      <span className="line-number">
        {`${lineNumber}`.padStart(2, ' ')}
      </span>
      <span className="line-content">
        <SegmentedText
          blockId={blockId}
          segments={segments}
          highlightCategories={highlightCategories}
          classifiedToWords={classifiedToWords}
          selectedIds={selectedIds}
          activeHitIds={activeHitIds}
        />
      </span>
    </span>
  );
});
