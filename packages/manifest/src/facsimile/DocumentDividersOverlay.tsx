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
  onHeightsChange: (heights: Map<string, number>) => void;
};

/** Document headings use the pane width and retain their normal text size. */
export function DocumentDividersOverlay({ canvases, canvasDocuments, onHeightsChange }: Props) {
  const viewer = useViewer();
  const layerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<{ element: HTMLElement; index: number; height: number }[]>([]);

  useLayoutEffect(() => {
    if (!viewer || !layerRef.current) {
      return;
    }
    const layer = layerRef.current;
    const measure = () => {
      const rows = Array.from(layer.children).flatMap((element) => (
        element instanceof HTMLElement ? [{
          element,
          index: Number(element.dataset.index),
          height: element.offsetHeight,
        }] : []
      ));
      rowsRef.current = rows;
      onHeightsChange(new Map(rows.map(({ element, height }) => [element.dataset.canvasId!, height])));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    document.fonts.addEventListener('loadingdone', measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', measure);
    };
  }, [viewer, canvasDocuments, onHeightsChange]);

  useLayoutEffect(() => {
    if (!viewer) {
      return;
    }
    const update = () => {
      const bounds = viewer.viewport.getBounds(true);
      const buffer = bounds.height / 2;
      const pixelsPerUnit = viewer.viewport.deltaPixelsFromPoints(new Point(0, 1), true).y;
      for (const { element, index, height } of rowsRef.current) {
        const canvas = canvases[index];
        if (!canvas) {
          element.style.visibility = 'hidden';
          continue;
        }
        const visible = canvas.documentGap > 0 && canvas.y >= bounds.y - buffer
          && canvas.y - canvas.documentGap <= bounds.y + bounds.height + buffer;
        const visibility = visible ? 'visible' : 'hidden';
        if (element.style.visibility !== visibility) {
          element.style.visibility = visibility;
        }
        if (visible) {
          const bottom = viewer.viewport.pixelFromPoint(new Point(0, canvas.y), true).y;
          const gapHeight = canvas.documentGap * pixelsPerUnit;
          element.style.transform = `translateY(${bottom - (gapHeight + height) / 2}px)`;
        }
      }
    };
    let frame: number | null = null;
    const scheduleUpdate = () => {
      frame ??= requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };
    update();
    viewer.addHandler('viewport-change', scheduleUpdate);
    viewer.addHandler('resize', scheduleUpdate);
    return () => {
      viewer.removeHandler('viewport-change', scheduleUpdate);
      viewer.removeHandler('resize', scheduleUpdate);
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, [viewer, canvases]);

  if (!viewer) {
    return null;
  }

  return createPortal(
    <div ref={layerRef} className="document-dividers-overlay">
      {canvases.map((canvas, index) => canvasDocuments.get(canvas.canvasId)?.starting.length ? (
        <div className="document-divider-position" key={canvas.canvasId}
          data-index={index} data-canvas-id={canvas.canvasId}>
          <DocumentDivider documents={canvasDocuments.get(canvas.canvasId)?.starting}/>
        </div>
      ) : null)}
    </div>,
    viewer.container,
  );
}
