import { memo, useEffect } from 'react';
import {
  loadCanvasAnnotationPages,
  usePages,
  useDocumentStore,
} from '@globalise/common/document';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';
import { PageLabel } from './PageLabel.tsx';
import { CanvasTranscription } from './CanvasTranscription.tsx';

type Props = {
  canvasId: string;
  canvasWidth: number;
  canvasHeight: number;
  containerWidth: number;
  annotationUrls: string[];
  index: number;
  scaleFactor: number;
  isVisible: boolean;
  renderDistance: number;
};

export const LazyCanvasTranscription = memo(function LazyCanvasTranscription(
  {
    canvasId,
    canvasWidth,
    canvasHeight,
    annotationUrls,
    containerWidth,
    index,
    scaleFactor,
    isVisible,
    renderDistance,
  }: Props,
) {
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);
  const isInRenderRangeByDistance = useDocumentStore(
    (s) => Math.abs(index - s.selectedCanvas) <= renderDistance,
  );
  const isInRenderRange = isVisible || isInRenderRangeByDistance;

  useEffect(
    () => {
      if (isVisible && annotationUrls.length) {
        void loadCanvasAnnotationPages(canvasId, annotationUrls);
      }
    },
    [isVisible, canvasId, annotationUrls],
  );

  const width = containerWidth * scaleFactor;
  const height = (canvasHeight / canvasWidth) * width;
  const canvasLabel = canvasId.split('/').pop() ?? index;
  const isDataReady = isCanvasReady && hasAnnotations;
  const hasNoAnnotations = !annotationUrls.length;
  const isLoading = !error && annotationUrls.length && !isDataReady;
  const isContentReady = !error && !hasNoAnnotations && isDataReady;

  return (
    <div
      data-canvas-index={index}
      style={{
        position: 'relative',
        width,
        height,

        /**
         * Prevent browser painting calculation outside of window:
         */
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {isInRenderRange && error && (
        <TranscriptionPlaceholder
          color='indianred'
          background='rgb(248 243 243)'
        >
          <PageLabel label={canvasLabel}/>
          Error: {error}
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && hasNoAnnotations && (
        <TranscriptionPlaceholder>
          <PageLabel label={canvasLabel}/>
          No transcription
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && isLoading && (
        <TranscriptionPlaceholder>
          <PageLabel label={canvasLabel}/>
          Loading...
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && isContentReady && (
        <>
          <PageLabel label={canvasLabel}/>
          <CanvasTranscription canvasId={canvasId}/>
        </>
      )}
    </div>
  );
});