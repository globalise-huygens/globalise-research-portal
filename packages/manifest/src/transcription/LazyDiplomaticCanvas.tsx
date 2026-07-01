import { memo, useEffect } from 'react';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  usePages,
  usePartOf, useSelectedCanvasIndex,
  useSelectedIdsForCanvas,
} from '@globalise/common/document';
import { canvasName } from '@globalise/common/annotation';
import { DiplomaticView } from '@globalise/diplomatic';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';
import { PageLabel } from './PageLabel.tsx';
import { canvasIndexAttribute } from './canvasIndexAttribute.ts';

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

export const LazyDiplomaticCanvas = memo(function LazyCanvasTranscription(
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

  const annotations = useAnnotations(canvasId);
  const partOf = usePartOf(canvasId);
  const selectedIds = useSelectedIdsForCanvas(canvasId);
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);
  const selectedIndex = useSelectedCanvasIndex();
  const isInRenderRangeByDistance =
    selectedIndex !== -1 && Math.abs(index - selectedIndex) <= renderDistance;

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
  const canvasLabel = canvasName(canvasId);
  const isDataReady = isCanvasReady && hasAnnotations;
  const hasNoAnnotations = !annotationUrls.length;
  const isLoading = !error && !!annotationUrls.length && !isDataReady;
  const isContentReady = !error && !hasNoAnnotations && isDataReady;

  return (
    <div
      {...{ [canvasIndexAttribute]: index }}
      style={{
        position: 'relative',
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
      {isInRenderRange && isContentReady && partOf && (
        <>
          <PageLabel label={canvasLabel}/>
          <div style={{ height: '100%', width }}>
            <DiplomaticView
              id={canvasId}
              annotations={annotations}
              selected={selectedIds}
              page={partOf}
              fit="width"
              showBlocks={true}
              showScanMargin={true}
            />
          </div>
        </>
      )}
    </div>
  );
});