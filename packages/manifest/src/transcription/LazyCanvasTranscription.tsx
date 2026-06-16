import {memo, useEffect} from 'react';
import {loadCanvasAnnotationPages, usePages} from '@globalise/common/document';
import {TranscriptionPlaceholder} from './TranscriptionPlaceholder.tsx';
import {PageLabel} from './PageLabel.tsx';
import {CanvasTranscription} from './CanvasTranscription.tsx';
import {useLazyCanvasLifecycle,} from './useLazyCanvasLifecycle.tsx';

type Props = {
  canvasId: string;
  canvasWidth: number;
  canvasHeight: number;
  containerWidth: number;
  annotationUrls: string[];
  index: number;
  scaleFactor: number;
};

export const LazyCanvasTranscription = memo(function LazyCanvasTranscription({
  canvasId,
  canvasWidth,
  canvasHeight,
  annotationUrls,
  containerWidth,
  index,
  scaleFactor,
}: Props,
) {
  const { canLoad, canRender, isRendered, isVisible } = useLazyCanvasLifecycle(index);
  
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);

  useEffect(() => {
    if (canLoad && annotationUrls.length) {
      void loadCanvasAnnotationPages(canvasId, annotationUrls);
    }
  }, [canLoad, canvasId, annotationUrls]);

  const width = containerWidth * scaleFactor;
  const height = (canvasHeight / canvasWidth) * width;
  const isDataReady = isCanvasReady && hasAnnotations && canRender;

  if (!isRendered) {
    return <TranscriptionPlaceholder width={width} height={height} />;
  }

  const canvasLabel = canvasId.split('/').pop() ?? index;

  if (error) {
    return (
      <TranscriptionPlaceholder
        width={width}
        height={height}
        color="indianred"
        background="rgb(248 243 243)"
      >
        <PageLabel label={canvasLabel}/>
        Error: {error}
      </TranscriptionPlaceholder>
    );
  }

  if (!annotationUrls.length) {
    return (
      <TranscriptionPlaceholder width={width} height={height}>
        <PageLabel label={canvasLabel}/>
        No transcription
      </TranscriptionPlaceholder>
    );
  }

  if (!isDataReady) {
    return (
      <TranscriptionPlaceholder width={width} height={height}>
        <PageLabel label={canvasLabel}/>
        Loading...
      </TranscriptionPlaceholder>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width,
        minHeight: height,
        // Prevent expensive rerenders by hiding rendered components NOT near the viewport:
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      <PageLabel label={canvasLabel}/>
      <CanvasTranscription canvasId={canvasId}/>
    </div>
  );
});

