import { memo, useEffect } from 'react';
import { loadCanvas, usePages } from '@globalise/common/document';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';
import { PageLabel } from './PageLabel.tsx';
import { CanvasTranscription } from './CanvasTranscription.tsx';
import {
  useIsLoadableWithDistanceDelay,
} from './useIsLoadableWithDistanceDelay.tsx';

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
  console.log('LazyCanvasTranscription render', index);

  const { isLoadable, isNearViewport } = useIsLoadableWithDistanceDelay(index);

  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);

  useEffect(() => {
    if (isLoadable && annotationUrls.length) {
      void loadCanvas(canvasId, annotationUrls);
    }
  }, [isLoadable, canvasId, annotationUrls]);

  const width = containerWidth * scaleFactor;
  const height = (canvasHeight / canvasWidth) * width;

  const isReady = isCanvasReady && hasAnnotations;

  if (!isNearViewport) {
    return <TranscriptionPlaceholder
      width={width}
      height={height}
    />;
  }

  if (!annotationUrls.length) {
    return (
      <TranscriptionPlaceholder width={width} height={height}>
        <PageLabel label={index}/>
        No transcription
      </TranscriptionPlaceholder>
    );
  }

  if (error) {
    return (
      <TranscriptionPlaceholder
        width={width}
        height={height}
        color="indianred"
        background="rgb(248 243 243)"
      >
        <PageLabel label={index}/>
        Error: {error}
      </TranscriptionPlaceholder>
    );
  }

  if (!isReady) {
    return (
      <TranscriptionPlaceholder width={width} height={height}>
        Loading...
      </TranscriptionPlaceholder>
    );
  }

  return (
    <div style={{ position: 'relative', width, minHeight: height }}>
      <PageLabel label={index}/>
      <CanvasTranscription canvasId={canvasId}/>
    </div>
  );
});

