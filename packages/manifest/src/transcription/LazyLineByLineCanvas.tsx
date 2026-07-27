import { memo, useEffect } from 'react';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  usePages,
  useSelectedCanvas,
} from '@globalise/common/document';
import { scanNumber } from '@globalise/common/annotation';
import { LineByLineView } from '@globalise/line-by-line';
import { ScanLabel } from './ScanLabel.tsx';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';
import './TranscriptionScan.css';

type Props = {
  canvasId: string;
  annotationUrls: string[];
  scale: number;
  showLayoutElements: boolean;
};

export const LazyLineByLineCanvas = memo(function LazyCanvasLineByLine(
  { canvasId, annotationUrls, scale, showLayoutElements }: Props,
) {
  const annotations = useAnnotations(canvasId);
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);
  const { id: selectedCanvasId } = useSelectedCanvas();
  const isCurrentCanvas = selectedCanvasId === canvasId;

  useEffect(
    () => {
      if (annotationUrls.length) {
        void loadCanvasAnnotationPages(canvasId, annotationUrls);
      }
    },
    [canvasId, annotationUrls],
  );

  const number = scanNumber(canvasId);
  const hasAnnotationPages = !!annotationUrls.length;
  const isDataReady = isCanvasReady && hasAnnotations;
  const hasNoAnnotations = !hasAnnotationPages;
  const isLoading = !error && hasAnnotationPages && !isDataReady;
  const isContentReady = !error && hasAnnotationPages && isDataReady;

  return (
    <div
      className="transcription-scan"
      data-view="line-by-line"
      aria-current={isCurrentCanvas ? 'true' : undefined}
      aria-label={`Transcription scan ${number}`}
      role="group"
    >
      <ScanLabel number={number} isCurrent={isCurrentCanvas} />
      {error && (
        <TranscriptionPlaceholder tone="error">
          Error: {error}
        </TranscriptionPlaceholder>
      )}
      {hasNoAnnotations && (
        <TranscriptionPlaceholder>No transcription</TranscriptionPlaceholder>
      )}
      {isLoading && (
        <TranscriptionPlaceholder>Loading...</TranscriptionPlaceholder>
      )}
      {isContentReady && (
        <div style={{ fontSize: `${scale}%` }}>
          <LineByLineView
            canvasId={canvasId}
            annotations={annotations}
            showLayoutElements={showLayoutElements}
          />
        </div>
      )}
    </div>
  );
});
