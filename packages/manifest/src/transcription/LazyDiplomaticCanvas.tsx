import { canvasName } from '@globalise/common/annotation';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  usePages,
  usePartOf,
  useEntityHighlightCategories,
  useSelectedCanvasIndex,
  useSelectedIdsForCanvas,
} from '@globalise/common/document';
import { DiplomaticView } from '@globalise/diplomatic';
import { memo, useEffect } from 'react';
import { canvasIndexAttribute } from './canvasIndexAttribute.ts';
import { PageLabel } from './PageLabel.tsx';
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
  showLayoutElements: boolean;
};

export const LazyDiplomaticCanvas = memo(function LazyCanvasTranscription({
  canvasId,
  canvasWidth,
  canvasHeight,
  annotationUrls,
  containerWidth,
  index,
  scaleFactor,
  isVisible,
  renderDistance,
  showLayoutElements,
}: Props) {
  const annotations = useAnnotations(canvasId);
  const highlightedEntityCategories = useEntityHighlightCategories();
  const partOf = usePartOf(canvasId);
  const selectedIds = useSelectedIdsForCanvas(canvasId);
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);
  const selectedIndex = useSelectedCanvasIndex();
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
        width,
        height,
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
          <PageLabel label={canvasLabel} />
          Error: {error}
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && hasNoAnnotations && (
        <TranscriptionPlaceholder>
          <PageLabel label={canvasLabel} />
          No transcription
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && isLoading && (
        <TranscriptionPlaceholder>
          <PageLabel label={canvasLabel} />
          Loading...
        </TranscriptionPlaceholder>
      )}
      {isVisible && isContentReady && partOf && hasRenderableSize && (
        <>
          <PageLabel label={canvasLabel} />
          <div style={{ height: '100%', width }}>
            <DiplomaticView
              id={canvasId}
              annotations={annotations}
              selected={selectedIds}
              page={partOf}
              fit="width"
              showBlocks={showLayoutElements}
              showScanMargin={true}
              highlightedEntityCategories={highlightedEntityCategories}
            />
          </div>
        </>
      )}
    </div>
  );
});
