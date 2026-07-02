import { cn } from '@/lib/utils';
import * as React from 'react';

export type DocumentDetailCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailCanvas({
  className,
  ...props
}: DocumentDetailCanvasProps) {
  return (
    <div className={cn('gds-document-detail-canvas', className)} {...props} />
  );
}

export type DocumentDetailTranscriptCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailTranscriptCanvas({
  className,
  ...props
}: DocumentDetailTranscriptCanvasProps) {
  return (
    <div
      className={cn('gds-document-detail-transcript-canvas', className)}
      {...props}
    />
  );
}

export type DocumentDetailTranscriptLineProps = {
  index: number;
  width?: React.CSSProperties['width'];
} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailTranscriptLine({
  className,
  index,
  width = '70%',
  ...props
}: DocumentDetailTranscriptLineProps) {
  return (
    <div
      className={cn('gds-document-detail-transcript-line', className)}
      {...props}
    >
      <span className="gds-document-detail-transcript-line__index">
        {index}
      </span>
      <span
        className="gds-document-detail-transcript-line__mark"
        style={{ width }}
      />
    </div>
  );
}

export {
  DocumentDetailCanvas,
  DocumentDetailTranscriptCanvas,
  DocumentDetailTranscriptLine,
};
