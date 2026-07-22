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
          canvasId={canvasId}
          blockId={blockId}
          lineNumber={lineNumber}
          segments={segments}
        />
      </span>
    </span>
  );
});
