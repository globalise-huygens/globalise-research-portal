import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Point } from 'openseadragon';
import { useViewer } from '@knaw-huc/osd-iiif-viewer';
import type { CanvasDocuments } from '@globalise/metadata';
import { DocumentDivider } from '../DocumentDivider.tsx';
import type { LazyTiledImage } from './LazyCollectionViewerModel.ts';

type Props = {
  canvases: LazyTiledImage[];
  canvasDocuments: Map<string, CanvasDocuments>;
};

/** Document headings use the pane width, independently of the scan image width. */
export function DocumentDividersOverlay({ canvases, canvasDocuments }: Props) {
  const viewer = useViewer();
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!viewer || !layerRef.current) {
      return;
    }
    const layer = layerRef.current;
    const elements = Array.from(layer.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );
    let rows: { element: HTMLElement; content: HTMLElement; y: number; gap: number; height: number }[] = [];
    const update = () => {
      for (const { element, content, y, gap, height } of rows) {
        const top = viewer.viewport.pixelFromPoint(new Point(0, y - gap), true).y;
        const bottom = viewer.viewport.pixelFromPoint(new Point(0, y), true).y;
        // Fit titles into the gap while keeping the outer rules at pane width.
        const scale = Math.min(1, Math.max(0, bottom - top) / Math.max(1, height));
        element.style.height = `${height * scale}px`;
        element.style.transform = `translateY(${(top + bottom - height * scale) / 2}px)`;
        content.style.width = scale > 0 ? `${100 / scale}%` : '100%';
        content.style.transform = `scale(${scale})`;
      }
    };
    const measure = () => {
      // Measure at the pane width before applying the zoom fit.
      for (const element of elements) {
        if (element.firstElementChild instanceof HTMLElement) {
          element.firstElementChild.style.width = '100%';
        }
      }
      rows = elements.flatMap((element) => {
        const content = element.firstElementChild;
        return content instanceof HTMLElement ? [{
          element,
          content,
          y: Number(element.dataset.y),
          gap: Number(element.dataset.gap),
          height: content.offsetHeight,
        }] : [];
      });
      update();
    };
    measure();
    viewer.addHandler('viewport-change', update);
    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    document.fonts.addEventListener('loadingdone', measure);
    return () => {
      viewer.removeHandler('viewport-change', update);
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', measure);
    };
  }, [viewer, canvases, canvasDocuments]);

  if (!viewer) {
    return null;
  }

  return createPortal(
    <div ref={layerRef} className="document-dividers-overlay">
      {canvases.filter((canvas) => canvas.documentGap > 0).map((canvas) => (
        <div className="document-divider-position" key={canvas.canvasId}
          data-y={canvas.y} data-gap={canvas.documentGap}>
          <DocumentDivider documents={canvasDocuments.get(canvas.canvasId)?.starting}/>
        </div>
      ))}
    </div>,
    viewer.container,
  );
}
