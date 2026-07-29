import { memo, useEffect } from 'react';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  usePages,
} from '@globalise/common/document';
import { LineByLineView } from '@globalise/line-by-line';
import { ScanLabel } from '../ScanLabel.tsx';

type Props = {
  canvasId: string;
  annotationUrls: string[];
  scale: number;
  showLayoutElements: boolean;
  isCurrentCanvas: boolean;
};

export const LazyLineByLineCanvas = memo(function LazyLineByLineCanvas(
  { canvasId, annotationUrls, scale, showLayoutElements, isCurrentCanvas }: Props,
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

  const isDataReady = isCanvasReady && hasAnnotations;
  const hasAnnotationPages = !!annotationUrls.length;
  const isLoading = !error && hasAnnotationPages && !isDataReady;
  const isContentReady = !error && hasAnnotationPages && isDataReady;

  return (
    <div style={{
      position: 'relative',
      margin: '0.5rem auto',
      maxWidth: '50rem',
      padding: '1rem',
      borderTop: '1px solid #eee',
      background: 'var(--color-parchment-50)',
      boxShadow: 'inset 0 0 0 1px var(--color-brand-white)',
    }}>
      <ScanLabel canvasId={canvasId} isCurrent={isCurrentCanvas} />
      {error && <Placeholder color='indianred'>Error: {error}</Placeholder>}
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
