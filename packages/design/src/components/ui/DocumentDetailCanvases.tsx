import { cn } from '../../lib';
import * as React from 'react';

export type DocumentDetailCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailCanvas({
  className,
  ...props
}: DocumentDetailCanvasProps) {
  return (
    <div className={cn('document-canvas', className)} {...props} />
  );
}

export type DocumentDetailTranscriptCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailTranscriptCanvas({
  className,
  ...props
}: DocumentDetailTranscriptCanvasProps) {
  return (
    <div
      className={cn('transcription-canvas', className)}
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
      className={cn('transcription-line', className)}
      {...props}
    >
      <span data-slot="index">
        {index}
      </span>
      <span
        data-slot="mark"
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
