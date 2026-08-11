import {
  loadCanvasAnnotationPages,
  useHighlightedAnnotations,
  usePages,
  usePartOf,
  useSelectedCanvasIndex,
  useSelectedAnnotationsInDiplomatic,
} from '@globalise/common/document';
import { DiplomaticView } from '@globalise/diplomatic';
import { memo, useEffect } from 'react';
import { canvasIndexAttribute } from './canvasIndexAttribute.ts';
import { CanvasLabel } from '../CanvasLabel.tsx';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';

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
  showBlocks: boolean;
};

export const LazyDiplomaticCanvas = memo(function LazyDiplomaticCanvas({
  canvasId,
  canvasWidth,
  canvasHeight,
  annotationUrls,
  containerWidth,
  index,
  scaleFactor,
  isVisible,
  renderDistance,
  showBlocks,
}: Props) {
  const annotations = useHighlightedAnnotations(canvasId);
  const partOf = usePartOf(canvasId);
  const selected = useSelectedAnnotationsInDiplomatic(canvasId);
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);
  const selectedIndex = useSelectedCanvasIndex();
  const isCurrentCanvas = selectedIndex === index;
  const isInRenderRangeByDistance =
    selectedIndex !== -1 && Math.abs(index - selectedIndex) <= renderDistance;

  const isInRenderRange = isVisible || isInRenderRangeByDistance;

  useEffect(() => {
    if (isVisible && annotationUrls.length) {
      void loadCanvasAnnotationPages(canvasId, annotationUrls);
    }
  }, [isVisible, canvasId, annotationUrls]);

  const width = containerWidth * scaleFactor;
  const height = (canvasHeight / canvasWidth) * width;
  const hasRenderableSize =
    Number.isFinite(width) &&
    width > 0 &&
    Number.isFinite(height) &&
    height > 0;
  const isDataReady = isCanvasReady && hasAnnotations;
  const hasNoAnnotations = !annotationUrls.length;
  const isLoading = !error && !!annotationUrls.length && !isDataReady;
  const isContentReady = !error && !hasNoAnnotations && isDataReady;

  return (
    <div
      {...{ [canvasIndexAttribute]: index }}
      style={{
        position: 'relative',
        width,
        height,
        background: 'var(--color-parchment-50)',
        boxShadow: 'inset 0 0 0 1px var(--color-brand-white)',
        contentVisibility: 'auto',
        containIntrinsicSize: `${Math.max(Math.ceil(height), 1)}px`,

        /**
         * Prevent browser painting calculation outside of window:
         */
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {isInRenderRange && error && (
        <TranscriptionPlaceholder
          color="indianred"
          background="rgb(248 243 243)"
        >
          <CanvasLabel canvasId={canvasId} isCurrent={isCurrentCanvas} />
          Error: {error}
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && hasNoAnnotations && (
        <TranscriptionPlaceholder>
          <CanvasLabel canvasId={canvasId} isCurrent={isCurrentCanvas} />
          No transcription
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && isLoading && (
        <TranscriptionPlaceholder>
          <CanvasLabel canvasId={canvasId} isCurrent={isCurrentCanvas} />
          Loading...
        </TranscriptionPlaceholder>
      )}
      {isVisible && isContentReady && partOf && hasRenderableSize && (
        <>
          <CanvasLabel canvasId={canvasId} isCurrent={isCurrentCanvas} />
          <div style={{ height: '100%', width }}>
            <DiplomaticView
              id={canvasId}
              annotations={annotations}
              selected={selected.all}
              page={partOf}
              fit="width"
              showBlocks={showBlocks}
              showScanMargin={true}
            />
          </div>
        </>
      )}
    </div>
  );
});
