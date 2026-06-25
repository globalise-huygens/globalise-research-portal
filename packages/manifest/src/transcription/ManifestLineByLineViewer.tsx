import { useEffect, useMemo, useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';
import {
  loadCanvasAnnotationPages,
  useSelectedCanvas,
} from '@globalise/common/document';
import { getAnnotationPageUrls } from '../getAnnotationPageUrls.ts';
import { LazyLineByLineCanvas } from './LazyLineByLineCanvas.tsx';
import {
  canvasIndexAttribute,
  canvasIndexSelector,
  getCanvasIndex,
} from './canvasIndexAttribute.ts';

type CanvasInfo = {
  canvasId: string;
  annotationUrls: string[];
};

type Props = {
  initialCanvas?: number;
  onCanvasChange: (index: number) => void;
};

const CANVAS_BUFFER_RANGE = 7;
const DEFAULT_ITEM_HEIGHT = 600;
const INCREASE_VIEWPORT_BY = 0;

export function ManifestLineByLineViewer(
  { initialCanvas = 0, onCanvasChange }: Props,
) {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();

  const canvasInfos: CanvasInfo[] = useMemo(() => {
    if (!manifestId || !isManifestReady) {
      return [];
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.items.map((item: { id: string; type: string }) => {
      const canvas: CanvasNormalized = vault.get(item);
      return {
        canvasId: canvas.id,
        annotationUrls: getAnnotationPageUrls(canvas),
      };
    });
  }, [vault, manifestId, isManifestReady]);

  const { index: selectedCanvas, selectedCanvasSource } = useSelectedCanvas();

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);

  const lastSelectedCanvas = useRef(selectedCanvas);

  useEffect(scrollToSelectedCanvas, [selectedCanvas, selectedCanvasSource]);

  function scrollToSelectedCanvas() {
    if (selectedCanvas === lastSelectedCanvas.current) {
      return;
    }
    lastSelectedCanvas.current = selectedCanvas;
    if (selectedCanvasSource === 'transcription') {
      return;
    }
    virtuosoRef.current?.scrollToIndex({
      index: selectedCanvas,
      align: 'start',
      behavior: 'auto',
    });
  }

  function handleRangeChanged(
    { startIndex, endIndex }: { startIndex: number; endIndex: number },
  ) {
    const from = Math.max(0, startIndex - CANVAS_BUFFER_RANGE);
    const to = Math.min(canvasInfos.length - 1, endIndex + CANVAS_BUFFER_RANGE);
    for (let i = from; i <= to; i++) {
      const info = canvasInfos[i];
      if (info?.annotationUrls.length) {
        void loadCanvasAnnotationPages(info.canvasId, info.annotationUrls);
      }
    }
  }

  useEffect(observeScroll, [onCanvasChange]);
  function observeScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    let prevCanvasIndex = -1;
    const onScroll = () => {
      const scrollerRect = scroller.getBoundingClientRect();
      const topQuarter = scrollerRect.top + scrollerRect.height * 0.25;
      const elements = scroller.querySelectorAll<HTMLElement>(canvasIndexSelector);
      for (const element of elements) {
        const elementBottom = element.getBoundingClientRect().bottom;
        if (elementBottom <= topQuarter) {
          continue;
        }
        const index = getCanvasIndex(element);
        if (index !== null && index !== prevCanvasIndex) {
          prevCanvasIndex = index;
          onCanvasChange(index);
        }
        return;
      }
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }

  function handleScrollerRef(ref: HTMLElement | Window | null) {
    scrollerRef.current = ref instanceof HTMLElement ? ref : null;
  }

  if (!canvasInfos.length) {
    return null;
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      style={{ height: '100%' }}
      totalCount={canvasInfos.length}
      defaultItemHeight={DEFAULT_ITEM_HEIGHT}
      initialTopMostItemIndex={initialCanvas}
      // Scroll smoother by start loading and rendering outside of viewport:
      increaseViewportBy={INCREASE_VIEWPORT_BY}
      skipAnimationFrameInResizeObserver
      scrollerRef={handleScrollerRef}
      rangeChanged={handleRangeChanged}
      itemContent={(index) => (
        <div {...{ [canvasIndexAttribute]: index }}>
          <LazyLineByLineCanvas
            canvasId={canvasInfos[index].canvasId}
            annotationUrls={canvasInfos[index].annotationUrls}
          />
        </div>
      )}
    />
  );
}