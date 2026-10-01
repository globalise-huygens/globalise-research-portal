import {
  loadCanvasAnnotationPages,
  useHighlightedAnnotations,
  usePages,
  usePartOf,
  useSelectedAnnotationsInDiplomatic,
} from '@globalise/common/document';
import { useDebugRerenders } from '@globalise/common/debug';
import { DiplomaticView } from '@globalise/diplomatic';
import { memo, useEffect, useMemo } from 'react';
import { canvasIndexAttribute } from './canvasIndexAttribute.ts';
import type { CanvasDocuments } from '@globalise/metadata';
import { CanvasHeaderLabel } from '../CanvasHeaderLabel.tsx';
import { CanvasFooterLabel } from '../CanvasFooterLabel.tsx';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';
import { CanvasAnnotationPage } from '@globalise/common/annotation';

type Props = {
  canvasId: string;
  canvasWidth: number;
  canvasHeight: number;
  containerWidth: number;
  annotationPages: CanvasAnnotationPage[];
  canvasDocuments?: CanvasDocuments;
  index: number;
  scaleFactor: number;
  isVisible: boolean;
  isCurrent: boolean;
  isInRenderRange: boolean;
  showBlocks: boolean;
};

export const LazyDiplomaticCanvas = memo(function LazyDiplomaticCanvas({
  canvasId,
  canvasWidth,
  canvasHeight,
  annotationPages, 
  canvasDocuments,
  containerWidth,
  index,
  scaleFactor,
  isVisible,
  isCurrent,
  isInRenderRange,
  showBlocks,
}: Props) {
  const annotations = useHighlightedAnnotations(canvasId);
  const partOf = usePartOf(canvasId);
  const selectedIds = useSelectedAnnotationsInDiplomatic(canvasId);
  const selected = useMemo(
    () => selectedIds.filter((id) => annotations[id]),
    [selectedIds, annotations],
  );
  const { isReady: isCanvasReady, error, hasAnnotations } = usePages(canvasId);
  useDebugRerenders(LazyDiplomaticCanvas.name, {
    canvasId, canvasWidth, canvasHeight, annotationPages, canvasDocuments, containerWidth,
    index, scaleFactor, isVisible, isCurrent, isInRenderRange, showBlocks,
    annotations, partOf, selected, isCanvasReady, error, hasAnnotations,
  }, 50);
  useEffect(() => {
    if (isVisible && annotationPages.length) {
      void loadCanvasAnnotationPages(canvasId, annotationPages);
    }
  }, [isVisible, canvasId, annotationPages]);

  const width = containerWidth * scaleFactor;
  const height = (canvasHeight / canvasWidth) * width;
  const hasRenderableSize =
    Number.isFinite(width) &&
    width > 0 &&
    Number.isFinite(height) &&
    height > 0;
  const isDataReady = isCanvasReady && hasAnnotations;
  const hasNoAnnotations = !annotationPages.length;
  const isLoading = !error && !!annotationPages.length && !isDataReady;
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
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          /**
           * Prevent browser painting all the words when a page is not in view,
           * but do show the page to prevent background flickering.
           */
          visibility: isVisible ? 'visible' : 'hidden',
        }}
      >
        {isInRenderRange && error && (
          <TranscriptionPlaceholder
            color="indianred"
            background="rgb(248 243 243)"
          >
            Error: {error}
          </TranscriptionPlaceholder>
        )}
        {isInRenderRange && hasNoAnnotations && (
          <TranscriptionPlaceholder>
            No transcription
          </TranscriptionPlaceholder>
        )}
        {isInRenderRange && isLoading && (
          <TranscriptionPlaceholder>
            Loading...
          </TranscriptionPlaceholder>
        )}
        {isVisible && isContentReady && partOf && hasRenderableSize && (
          <div style={{ height: '100%', width }}>
            <DiplomaticView
              id={canvasId}
              annotations={annotations}
              selected={selected}
              page={partOf}
              fit="width"
              showBlocks={showBlocks}
              showScanMargin={true}
            />
          </div>
        )}
        {isInRenderRange && (
          <>
            <CanvasHeaderLabel
              canvasId={canvasId}
              canvasDocuments={canvasDocuments}
              isCurrent={isCurrent}
            />
            <CanvasFooterLabel
              canvasDocuments={canvasDocuments}
              isCurrent={isCurrent}
            />
          </>
        )}
      </div>
    </div>
  );
});
