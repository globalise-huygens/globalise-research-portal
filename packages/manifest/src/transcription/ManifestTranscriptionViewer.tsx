import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import {
  useSettings,
} from '@globalise/document';
import { LazyCanvasTranscription } from './LazyCanvasTranscription';
import {
  initCanvases,
  setSelectedCanvas,
  useDocumentStore,
} from '@globalise/common/document';
import { getAnnotationPageUrls } from '../getAnnotationPageUrls.ts';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';

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

  const lastScrolledCanvas = useRef<number | null>(initialCanvas);

  const selectedCanvas = useDocumentStore((s) => s.selectedCanvas);

  useEffect(scrollToSelectedCanvas, [selectedCanvas, containerWidth, canvasInfos.length]);
  function scrollToSelectedCanvas() {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;
    if (!scrollContainer || !canvasList || !containerWidth) {
      return;
    }
    const child = canvasList.children[selectedCanvas];
    if (!(child instanceof HTMLElement)) {
      return;
    }
    if (isCentered(scrollContainer, child)) {
      return;
    }
    child.scrollIntoView({ block: 'center', behavior: 'auto' });
  }

  useEffect(updateCanvasOnScaleOrScroll, [onCanvasChange, canvasInfos.length, containerWidth]);
  function updateCanvasOnScaleOrScroll() {
    console.log('updateCanvasOnScaleOrScroll');
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;
    if (!scrollContainer || !canvasList) {
      return;
    }

    const resizeObserver = new ResizeObserver(([canvasEvent]) => {
      setContainerWidth(canvasEvent.contentRect.width);
    });
    resizeObserver.observe(canvasList);

    const intersectionObserver = new IntersectionObserver((canvasEvents) => {
      for (const event of canvasEvents) {
        if (!event.isIntersecting) {
          continue;
        }
        const index = Array.from(canvasList.children).indexOf(event.target);
        if (index === -1 || index === lastScrolledCanvas.current) {
          continue;
        }
        console.log('new selected canvas:', index);
        lastScrolledCanvas.current = index;
        setSelectedCanvas(index);
        onCanvasChange(index);
      }
    }, {
      root: scrollContainer,
      // Only switch to a new canvas when that canvas enters screen center:
      rootMargin: '-49% 0px -49% 0px',
      threshold: 0,
    });

    Array.from(canvasList.children).forEach((child) => {
      intersectionObserver.observe(child);
    });

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }

  useEffect(initCanvasScroll, [canvasInfos.length, initialCanvas, containerWidth]);
  function initCanvasScroll() {
    if (!initialCanvas
      || !scrollRef.current
      || !containerWidth
    ) {
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

  const containerStyle: CSSProperties = {
    maxWidth: 800,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  useEffect(initCanvasesOnInfosLoaded, [canvasInfos]);
  function initCanvasesOnInfosLoaded() {
    if (canvasInfos.length) {
      initCanvases(canvasInfos.map((c) => c.canvasId));
    }
  }

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
          />
        ))}
      </div>
    </div>
  );
}

function isCentered(container: HTMLElement, element: HTMLElement): boolean {
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;
  const scrollCenter = scrollTop + clientHeight / 2;

  const elementTop = element.offsetTop;
  const elementBottom = element.offsetTop + element.offsetHeight;

  return elementTop < scrollCenter && elementBottom > scrollCenter;
}