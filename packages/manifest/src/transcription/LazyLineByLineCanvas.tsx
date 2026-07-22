import { memo, useEffect } from 'react';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  usePages,
  useSelectedCanvas,
} from '@globalise/common/document';
import { canvasName } from '@globalise/common/annotation';
import { LineByLineView } from '@globalise/line-by-line';
import { PageLabel } from './PageLabel.tsx';
import './TranscriptionPage.css';

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

  const canvasLabel = canvasName(canvasId);
  const hasAnnotationPages = !!annotationUrls.length;
  const hasNoAnnotations = !hasAnnotationPages || (isCanvasReady && !hasAnnotations);
  const isLoading = !error && hasAnnotationPages && !isCanvasReady;
  const isContentReady = !error && isCanvasReady && hasAnnotations;

  return (
    <div
      className="transcription-page"
      data-view="line-by-line"
      aria-current={isCurrentCanvas ? 'page' : undefined}
      aria-label={`Transcription page ${canvasLabel}`}
      role="group"
    >
      <PageLabel label={canvasLabel} isCurrent={isCurrentCanvas} />
      {error && <Placeholder tone="error">Error: {error}</Placeholder>}
      {hasNoAnnotations && <Placeholder>No transcription</Placeholder>}
      {isLoading && <Placeholder>Loading...</Placeholder>}
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

function Placeholder(
  {
    tone = 'default',
    children,
  }: {
    tone?: 'default' | 'error';
    children: React.ReactNode;
  },
) {
  return (
    <div className="transcription-message" data-tone={tone}>
      {children}
    </div>
  );
}
