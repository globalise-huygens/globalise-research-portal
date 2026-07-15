import { useSelectedCanvas } from '@globalise/common/document';
import { useDiplomaticViewScale } from '@globalise/common/document';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getAnnotationPageUrls } from '../getAnnotationPageUrls.ts';
import { getCanvasIndex } from './canvasIndexAttribute.ts';
import { LazyDiplomaticCanvas } from './LazyDiplomaticCanvas.tsx';
import { useScrollToSelectedCanvas } from './useScrollToSelectedCanvas.tsx';

type CanvasInfo = {
  canvasId: string;
  width: number;
  height: number;
  annotationUrls: string[];
};

type Props = {
  initialCanvasId?: string;
  showLayoutElements: boolean;
  onCanvasChange: (canvasId: string) => void;
};

const MIN_CANVASES_TO_RENDER = 4;
const MAX_VIEWPORTS_TO_RENDER = 2;

export function ManifestDiplomaticViewer({
  initialCanvasId,
  showLayoutElements,
  onCanvasChange,
}: Props) {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();
  const diplomaticViewScale = useDiplomaticViewScale();
  const scaleFactor = diplomaticViewScale / 100;
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasListRef = useRef<HTMLDivElement>(null);
  const suppressCanvasChangeRef = useRef(false);
  const previousScaleRef = useRef(scaleFactor);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [visibleCanvases, setVisibleCanvases] = useState<Set<number>>(
    new Set(),
  );

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

  const initialCanvas = useMemo(
    () =>
      initialCanvasId
        ? Math.max(
          0,
          canvasInfos.findIndex((c) => c.canvasId === initialCanvasId),
        )
        : 0,
    [initialCanvasId, canvasInfos],
  );
  const lastScrolledCanvas = useRef<number | null>(initialCanvas);
  const { id: selectedCanvasId } = useSelectedCanvas();

  useScrollToSelectedCanvas(scrollRef, canvasListRef, containerWidth);

  useEffect(observeCanvases, [onCanvasChange, canvasInfos, containerWidth]);
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

    const selectedCanvasObserver = new IntersectionObserver(
      (canvasEvents) => {
        if (suppressCanvasChangeRef.current) {
          return;
        }
        for (const event of canvasEvents) {
          if (!event.isIntersecting) {
            continue;
          }
          const index = getCanvasIndex(event.target as HTMLElement);
          if (index === null || index === lastScrolledCanvas.current) {
            continue;
          }
          const info = canvasInfos[index];
          if (!info) {
            continue;
          }
          lastScrolledCanvas.current = index;
          onCanvasChange(info.canvasId);
        }
      },
      {
        root: scrollContainer,
        // Only switch to a new canvas when that canvas enters screen center:
        rootMargin: '-49% 0px -49% 0px',
        threshold: 0,
      },
    );

    const visibleCanvasesObserver = new IntersectionObserver(
      (canvasEvents) => {
        setVisibleCanvases((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const event of canvasEvents) {
            const index = getCanvasIndex(event.target as HTMLElement);
            if (index === null) {
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
          return changed ? next : prev;
        });
      },
      {
        root: scrollContainer,
        threshold: 0,
      },
    );

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

  useEffect(initCanvasScroll, [
    canvasInfos.length,
    initialCanvas,
    containerWidth,
  ]);
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

  useLayoutEffect(preserveSelectedCanvasAfterScaleChange, [
    canvasInfos,
    containerWidth,
    scaleFactor,
    selectedCanvasId,
  ]);
  function preserveSelectedCanvasAfterScaleChange() {
    if (previousScaleRef.current === scaleFactor) {
      return;
    }
    previousScaleRef.current = scaleFactor;

    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;
    if (!scrollContainer || !canvasList || !selectedCanvasId || !containerWidth) {
      return;
    }

    const index = canvasInfos.findIndex((c) => c.canvasId === selectedCanvasId);
    if (index === -1) {
      return;
    }
    const child = canvasList.children[index];
    if (!(child instanceof HTMLElement)) {
      return;
    }

    suppressCanvasChangeRef.current = true;
    const viewportHeight = scrollContainer.clientHeight;
    const block = child.offsetHeight > viewportHeight ? 'start' : 'center';
    child.scrollIntoView({ block, inline: 'nearest' });
    lastScrolledCanvas.current = index;

    const timeoutId = window.setTimeout(() => {
      suppressCanvasChangeRef.current = false;
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
      suppressCanvasChangeRef.current = false;
    };
  }

  const renderDistance = useMemo(() => {
    if (!viewportHeight || !canvasInfos.length || !containerWidth) {
      return MIN_CANVASES_TO_RENDER;
    }
    const sample = canvasInfos[0];
    const aspectRatio = sample.height / sample.width;
    const displayedHeight = aspectRatio * containerWidth * scaleFactor;
    if (!displayedHeight) {
      return MIN_CANVASES_TO_RENDER;
    }
    const canvasesPerViewport = viewportHeight / displayedHeight;
    return Math.max(
      MIN_CANVASES_TO_RENDER,
      Math.ceil(MAX_VIEWPORTS_TO_RENDER * canvasesPerViewport),
    );
  }, [viewportHeight, canvasInfos, containerWidth, scaleFactor]);

  return (
    <div ref={scrollRef} className="manifest-transcription-scroll">
      <div
        ref={canvasListRef}
        className="manifest-transcription-page-list manifest-transcription-page-list--diplomatic"
      >
        {containerWidth &&
          canvasInfos.map((info, i) => (
            <LazyDiplomaticCanvas
              scaleFactor={scaleFactor}
              key={info.canvasId}
              canvasId={info.canvasId}
              canvasWidth={info.width}
              canvasHeight={info.height}
              containerWidth={containerWidth}
              annotationUrls={info.annotationUrls}
              index={i}
              isVisible={visibleCanvases.has(i)}
              renderDistance={renderDistance}
              showLayoutElements={showLayoutElements}
            />
          ))}
      </div>
    </div>
  );
}
