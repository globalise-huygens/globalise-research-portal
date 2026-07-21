import { cn } from '../../../lib';
import * as React from 'react';

export type FacsimileCanvasProps = {} & React.HTMLAttributes<HTMLDivElement>;

function FacsimileCanvas({
  className,
  ...props
}: FacsimileCanvasProps) {
  return (
    <div className={cn('facsimile-canvas', className)} {...props} />
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
      <span className="index">
        {index}
      </span>
      <span
        className="mark"
        style={{ width }}
      />
    </div>
  );
}

export {
  FacsimileCanvas,
  TranscriptionCanvas,
  TranscriptionLine,
};

/** @deprecated Use `FacsimileCanvasProps`. */
export type ViewerCanvasProps = FacsimileCanvasProps;
/** @deprecated Use `FacsimileCanvas`. */
export { FacsimileCanvas as ViewerCanvas };
