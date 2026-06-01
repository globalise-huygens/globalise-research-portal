import {CSSProperties, useEffect, useMemo, useRef, useState} from 'react';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {HeaderRegion} from '@globalise/common/header';
import {
  useSettings,
  setTranscriptionMode,
  setDiplomaticViewScale,
} from '@globalise/document';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
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
  const {transcriptionMode, diplomaticViewScale} = useSettings();
  const showDiplomatic = transcriptionMode === 'diplomatic';
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

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;
    if (!scrollContainer || !canvasList || !onCanvasChange) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const clientHeight = scrollContainer.clientHeight;
      const scrollCenter = scrollTop + clientHeight / 2;
      const canvasElements = canvasList.children;
      for (let i = 0; i < canvasElements.length; i++) {
        const canvasElement = canvasElements[i] as HTMLElement;
        const canvasBottom = canvasElement.offsetTop + canvasElement.offsetHeight;
        if (canvasBottom > scrollCenter) {
          setSelectedCanvas(i);
          onCanvasChange(i);
          return;
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, {passive: true});
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [onCanvasChange, canvasInfos.length, containerWidth]);

  useEffect(() => {
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
  }, [canvasInfos.length, initialCanvas, containerWidth]);

  useEffect(() => {
    const container = canvasListRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(([containerEvent]) => {
      setContainerWidth(containerEvent.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const containerStyle: CSSProperties = {
    maxWidth: 800,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  useEffect(() => {
    if (canvasInfos.length) {
      initCanvases(canvasInfos.map(c => c.canvasId));
    }
  }, [canvasInfos]);

  return (
    <>
      <HeaderRegion region="right">
        {showDiplomatic && (
          <span className="zoom-slider">
          <ZoomOutIcon
            className="icon"
            fontSize="small"
            onClick={() => setDiplomaticViewScale(Math.max(30, scale - 10))}
          />
          <input
            type="range"
            min={30}
            max={200}
            value={scale}
            onChange={(e) => setDiplomaticViewScale(parseInt(e.target.value))}
          />
          <ZoomInIcon
            className="icon"
            fontSize="small"
            onClick={() => setDiplomaticViewScale(Math.min(200, scale + 10))}
          />
        </span>
        )}
        <button
          className={showDiplomatic ? 'active' : ''}
          onClick={() => setTranscriptionMode('diplomatic')}
        >
          Diplomatic
        </button>
        <button
          className={!showDiplomatic ? 'active' : ''}
          onClick={() => setTranscriptionMode('line-by-line')}
        >
          Line by line
        </button>
      </HeaderRegion>

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
    </>
  );
}