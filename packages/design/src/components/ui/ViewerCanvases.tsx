import { cn } from '../../lib';
import * as React from 'react';

export type ViewerCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerCanvas({
  className,
  ...props
}: ViewerCanvasProps) {
  return (
    <div className={cn('viewer-canvas', className)} {...props} />
  );
}

export type TranscriptionCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function TranscriptionCanvas({
  className,
  ...props
}: TranscriptionCanvasProps) {
  return (
    <div
      className={cn('transcription-canvas', className)}
      {...props}
    />
  );
}

export type TranscriptionLineProps = {
  index: number;
  width?: React.CSSProperties['width'];
} & React.HTMLAttributes<HTMLDivElement>;

function TranscriptionLine({
  className,
  index,
  width = '70%',
  ...props
}: TranscriptionLineProps) {
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
  ViewerCanvas,
  TranscriptionCanvas,
  TranscriptionLine,
};
