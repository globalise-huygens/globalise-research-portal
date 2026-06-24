import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { useSettings } from '@globalise/document';
import { LazyCanvasTranscription } from './LazyCanvasTranscription';
import { initCanvases } from '@globalise/common/document';
import { getAnnotationPageUrls } from '../getAnnotationPageUrls.ts';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { useScrollToSelectedCanvas } from './useScrollToSelectedCanvas.tsx';

type CanvasInfo = {
  canvasId: string;
  width: number;
  height: number;
  annotationUrls: string[];
};

type Props = {
  initialCanvas?: number;
  onCanvasChange: (index: number) => void;
};

const MIN_RENDER_DISTANCE = 4;
const RENDER_VIEWPORTS = 2;

export function ManifestTranscriptionViewer(
  { initialCanvas = 0, onCanvasChange }: Props,
) {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();
  const { diplomaticViewScale } = useSettings();
  const scale = diplomaticViewScale;

  const canvasInfos: CanvasInfo[] = useMemo(() => {
    if (!manifestId || !isManifestReady) {
      return [];
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.items.map((item: { id: string; type: string }) => {
      const canvas: CanvasNormalized = vault.get(item);
      return {
        canvasId: canvas.id,
        width: canvas.width,
        height: canvas.height,
        annotationUrls: getAnnotationPageUrls(canvas),
      };
    });
  }, [vault, manifestId, isManifestReady]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasListRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [visibleCanvases, setVisibleCanvases] = useState<Set<number>>(new Set());
  const lastScrolledCanvas = useRef<number | null>(initialCanvas);

  useScrollToSelectedCanvas(scrollRef, canvasListRef, containerWidth);

  useEffect(observeCanvases, [onCanvasChange, canvasInfos.length, containerWidth]);
  function observeCanvases() {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;
    if (!scrollContainer || !canvasList) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvasList) {
          setContainerWidth(entry.contentRect.width);
        } else if (entry.target === scrollContainer) {
          setViewportHeight(entry.contentRect.height);
        }
      }
    });
    resizeObserver.observe(canvasList);
    resizeObserver.observe(scrollContainer);

    const selectedCanvasObserver = new IntersectionObserver((canvasEvents) => {
      for (const event of canvasEvents) {
        if (!event.isIntersecting) {
          continue;
        }
        const target = event.target as HTMLElement;
        const index = Number(target.dataset.canvasIndex);
        if (Number.isNaN(index) || index === lastScrolledCanvas.current) {
          continue;
        }
        lastScrolledCanvas.current = index;
        onCanvasChange(index);
      }
    }, {
      root: scrollContainer,
      // Only switch to a new canvas when that canvas enters screen center:
      rootMargin: '-49% 0px -49% 0px',
      threshold: 0,
    });

    const visibleCanvasesObserver = new IntersectionObserver((canvasEvents) => {
      setVisibleCanvases((prev) => {
        const next = new Set(prev);
        let changed = false;
        for (const event of canvasEvents) {
          const target = event.target as HTMLElement;
          const index = Number(target.dataset.canvasIndex);
          if (Number.isNaN(index)) {
            continue;
          }
          if (event.isIntersecting) {
            if (!next.has(index)) {
              next.add(index);
              changed = true;
            }
          } else if (next.has(index)) {
            next.delete(index);
            changed = true;
          }
        }
        console.log('setVisibleCanvases', { prev:[...prev.values()].join(','), next:[...prev.keys()].join(',') });
        return changed ? next : prev;
      });
    }, {
      root: scrollContainer,
      threshold: 0,
    });

    Array.from(canvasList.children).forEach((child) => {
      selectedCanvasObserver.observe(child);
      visibleCanvasesObserver.observe(child);
    });

    return () => {
      resizeObserver.disconnect();
      selectedCanvasObserver.disconnect();
      visibleCanvasesObserver.disconnect();
    };
  }

  useEffect(initCanvasScroll, [canvasInfos.length, initialCanvas, containerWidth]);
  function initCanvasScroll() {
    if (!initialCanvas || !scrollRef.current || !containerWidth) {
      return;
    }
    const child = scrollRef.current.children[0]?.children[initialCanvas];
    if (!(child instanceof HTMLElement)) {
      return;
    }
    const viewportHeight = scrollRef.current.clientHeight;
    const block = child.offsetHeight > viewportHeight ? 'start' : 'center';
    child.scrollIntoView({ block });
    lastScrolledCanvas.current = initialCanvas;
  }

  useEffect(initCanvasesOnInfosLoaded, [canvasInfos]);
  function initCanvasesOnInfosLoaded() {
    if (canvasInfos.length) {
      initCanvases(canvasInfos.map((c) => c.canvasId), initialCanvas);
    }
  }

  const renderDistance = useMemo(() => {
    if (!viewportHeight || !canvasInfos.length || !containerWidth) {
      return MIN_RENDER_DISTANCE;
    }
    const sample = canvasInfos[0];
    const displayedHeight = (sample.height / sample.width) * containerWidth * (scale / 100);
    if (!displayedHeight) {
      return MIN_RENDER_DISTANCE;
    }
    const canvasesPerViewport = viewportHeight / displayedHeight;
    return Math.max(
      MIN_RENDER_DISTANCE,
      Math.ceil(RENDER_VIEWPORTS * canvasesPerViewport),
    );
  }, [viewportHeight, canvasInfos, containerWidth, scale]);

  const containerStyle: CSSProperties = {
    maxWidth: 800,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  return (
    <div ref={scrollRef} style={{ overflow: 'auto', height: '100%' }}>
      <div ref={canvasListRef} style={{ ...containerStyle }}>
        {containerWidth && canvasInfos.map((info, i) => (
          <LazyCanvasTranscription
            scaleFactor={scale / 100}
            key={info.canvasId}
            canvasId={info.canvasId}
            canvasWidth={info.width}
            canvasHeight={info.height}
            containerWidth={containerWidth}
            annotationUrls={info.annotationUrls}
            index={i}
            isVisible={visibleCanvases.has(i)}
            renderDistance={renderDistance}
          />
        ))}
      </div>
    </div>
  );
}