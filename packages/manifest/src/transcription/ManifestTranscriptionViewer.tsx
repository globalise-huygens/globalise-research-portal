import {CSSProperties, useEffect, useMemo, useRef, useState} from 'react';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {
  useSettings,
} from '@globalise/document';
import {LazyCanvasTranscription} from './LazyCanvasTranscription';
import {initCanvases, setSelectedCanvas} from "@globalise/common/document";
import {getAnnotationPageUrls} from "../getAnnotationPageUrls.ts";

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
  {initialCanvas = 0, onCanvasChange}: Props
) {
  const {vault, id: manifestId, isReady: isManifestReady} = useManifest();
  const {diplomaticViewScale} = useSettings();
  const scale = diplomaticViewScale;

  const canvasInfos: CanvasInfo[] = useMemo(() => {
    if (!vault || !manifestId || !isManifestReady) {
      return [];
    }
    const manifest = vault.get({id: manifestId, type: 'Manifest'});
    return manifest.items.map((item: { id: string; type: string }) => {
      const canvas = vault.get(item);
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

  useEffect(updateCanvasOnScaleOrScroll, [onCanvasChange, canvasInfos.length]);
  function updateCanvasOnScaleOrScroll() {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;
    if (!scrollContainer || !canvasList || !onCanvasChange) {
      return;
    }

    const setSelectedCanvasToCenterElement = () => {
      const scrollTop = scrollContainer.scrollTop;
      const clientHeight = scrollContainer.clientHeight;
      const scrollCenter = scrollTop + clientHeight / 2;
      const canvasElements = canvasList.children;
      for (let i = 0; i < canvasElements.length; i++) {
        const element = canvasElements[i] as HTMLElement;
        const canvasBottom = element.offsetTop + element.offsetHeight;
        if (canvasBottom > scrollCenter) {
          setSelectedCanvas(i);
          onCanvasChange(i);
          return;
        }
      }
    };

    let hasScrolled = false;
    const onScroll = () => {
      hasScrolled = true;
      setSelectedCanvasToCenterElement();
    };
    scrollContainer.addEventListener('scroll', onScroll);

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
      /**
       * Wait for {@link initCanvasScroll} to prevent canvas=0 flicker:
       */
      if (!hasScrolled) {
        return;
      }
      setSelectedCanvasToCenterElement();
    });

    resizeObserver.observe(canvasList);

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
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
    child.scrollIntoView({block});
  }

  const containerStyle: CSSProperties = {
    maxWidth: 800,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  useEffect(initCanvasesOnInfosLoaded, [canvasInfos]);
  function initCanvasesOnInfosLoaded() {
    if (canvasInfos.length) {
      initCanvases(canvasInfos.map(c => c.canvasId));
    }
  }

  return (
    <div ref={scrollRef} style={{overflow: 'auto', height: '100%'}}>
      <div ref={canvasListRef} style={{...containerStyle}}>
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