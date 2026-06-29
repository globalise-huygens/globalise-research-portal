import { memo, useEffect } from 'react';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  usePages,
} from '@globalise/common/document';
import { canvasName } from '@globalise/common/annotation';
import { LineByLineView } from '@globalise/line-by-line';
import { PageLabel } from './PageLabel.tsx';

type Props = {
  canvasId: string;
  annotationUrls: string[];
};

export const LazyLineByLineCanvas = memo(function LazyCanvasLineByLine(
  { canvasId, annotationUrls }: Props,
) {
  const annotations = useAnnotations(canvasId);
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);

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
    <div style={{
      position: 'relative',
      margin: '0 auto',
      maxWidth: '50rem',
      padding: '1rem',
      borderTop: '1px solid #eee',
    }}>
      <PageLabel label={canvasLabel}/>
      {error && <Placeholder color='indianred'>Error: {error}</Placeholder>}
      {!hasAnnotationPages && <Placeholder>No transcription</Placeholder>}
      {isLoading && <Placeholder>Loading...</Placeholder>}
      {isContentReady && (
        <LineByLineView canvasId={canvasId} annotations={annotations}/>
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