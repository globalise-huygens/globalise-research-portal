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
  const isDataReady = isCanvasReady && hasAnnotations;
  const hasAnnotationPages = !!annotationUrls.length;
  const isLoading = !error && hasAnnotationPages && !isDataReady;
  const isContentReady = !error && hasAnnotationPages && isDataReady;

  return (
    <div
      className="manifest-transcription-page manifest-transcription-page--line-by-line"
      data-current={isCurrentCanvas ? 'true' : 'false'}
      aria-current={isCurrentCanvas ? 'page' : undefined}
      aria-label={`Transcription page ${canvasLabel}`}
      role="group"
    >
      <PageLabel label={canvasLabel} isCurrent={isCurrentCanvas} />
      {error && <Placeholder color="indianred">Error: {error}</Placeholder>}
      {!hasAnnotationPages && <Placeholder>No transcription</Placeholder>}
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
  { color, children }: { color?: string; children: React.ReactNode },
) {
  return (
    <div style={{
      padding: '1rem',
      color: color ?? 'grey',
      fontStyle: 'italic',
    }}>
      {children}
    </div>
  );
}
