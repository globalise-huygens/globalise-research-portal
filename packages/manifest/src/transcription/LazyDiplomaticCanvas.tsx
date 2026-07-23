import { scanNumber } from '@globalise/common/annotation';
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
import { ScanLabel } from './ScanLabel.tsx';
import { TranscriptionPlaceholder } from './TranscriptionPlaceholder.tsx';
import './TranscriptionScan.css';

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
  const number = scanNumber(canvasId);
  const hasAnnotationPages = !!annotationUrls.length;
  const hasNoAnnotations = !hasAnnotationPages || (isCanvasReady && !hasAnnotations);
  const isLoading = !error && hasAnnotationPages && !isCanvasReady;
  const isContentReady = !error && isCanvasReady && hasAnnotations;

  return (
    <div
      {...{ [canvasIndexAttribute]: index }}
      className="transcription-scan"
      data-view="diplomatic"
      aria-current={isCurrentCanvas ? 'true' : undefined}
      aria-label={`Transcription scan ${number}`}
      role="group"
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
          tone="error"
        >
          <ScanLabel number={number} isCurrent={isCurrentCanvas} />
          Error: {error}
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && hasNoAnnotations && (
        <TranscriptionPlaceholder>
          <ScanLabel number={number} isCurrent={isCurrentCanvas} />
          No transcription
        </TranscriptionPlaceholder>
      )}
      {isInRenderRange && isLoading && (
        <TranscriptionPlaceholder>
          <ScanLabel number={number} isCurrent={isCurrentCanvas} />
          Loading...
        </TranscriptionPlaceholder>
      )}
      {isVisible && isContentReady && partOf && hasRenderableSize && (
        <>
          <ScanLabel number={number} isCurrent={isCurrentCanvas} />
          <div style={{ height: '100%', width }}>
            <DiplomaticView
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
