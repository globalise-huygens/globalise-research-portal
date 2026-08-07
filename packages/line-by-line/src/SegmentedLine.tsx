import { memo } from 'react';
import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import { Annotation, Id } from '@globalise/common/annotation';
import { setHovered } from '@globalise/common/document';
import { SegmentedText } from './SegmentedText';

type LineProps = {
  canvasId: string;
  lineId: Id;
  lineNumber: number;
  blockId: Id | null;
  segments: TextSegment<Annotation>[];
};

export const SegmentedLine = memo(function SegmentedLine(
  { canvasId, lineId, lineNumber, blockId, segments }: LineProps,
) {
  return (
    <span
      className="line"
      data-line-id={lineId}
      onMouseEnter={(event) => {
        if (blockId) {
          const rect = event.currentTarget.getBoundingClientRect();
          setHovered(blockId, {
            element: event.currentTarget,
            x: event.clientX, y: event.clientY,
            left: rect.left, top: rect.top, right: rect.right,
            bottom: rect.bottom, width: rect.width, height: rect.height,
          });
        }
      }}
      onMouseLeave={() => { setHovered(null); }}
    >
      <span className="line-number">
        {`${lineNumber}`.padStart(2, ' ')}
      </span>
      <span className="line-content">
        <SegmentedText
          canvasId={canvasId}
          blockId={blockId}
          segments={segments}
        />
      </span>
    </span>
  );
});
