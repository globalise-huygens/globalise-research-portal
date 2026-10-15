import { useLayoutEffect, useMemo, useState } from 'react';
import { Point, type Viewer } from 'openseadragon';
import type { LazyTiledImage } from './LazyCollectionViewerModel.ts';

/** Keep document headings at their measured screen height as scans zoom. */
export function useCanvasLayout(viewer: Viewer | null, baseCanvases: LazyTiledImage[], initialCanvas = 0) {
  const [heights, setHeights] = useState<Map<string, number>>(() => new Map());
  const [pixelsPerUnit, setPixelsPerUnit] = useState(0);
  const hasHeadings = heights.size > 0;

  useLayoutEffect(() => {
    if (!viewer || !hasHeadings) {
      return;
    }
    let frame: number | null = null;
    let previous = 0;
    const update = () => {
      const delta = viewer.viewport.deltaPixelsFromPoints(new Point(0, 1), true);
      const next = Math.hypot(delta.x, delta.y);
      if (next > 0 && next !== previous) {
        previous = next;
        setPixelsPerUnit(next);
      }
    };
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
  }, [viewer, hasHeadings]);

  const canvases = useMemo(() => {
    if (!heights.size || pixelsPerUnit <= 0) {
      return baseCanvases;
    }
    let offset = 0;
    const positioned: LazyTiledImage[] = [];
    for (const canvas of baseCanvases) {
      const height = heights.get(canvas.canvasId);
      const documentGap = height && pixelsPerUnit > 0 ? (height + 16) / pixelsPerUnit : 0;
      offset += documentGap;
      positioned.push({ ...canvas, y: canvas.y + offset, documentGap });
    }
    // The reset-view control stores this scan's original world coordinates.
    const anchor = positioned[initialCanvas];
    if (anchor) {
      const anchorOffset = anchor.y - baseCanvases[initialCanvas].y;
      for (const canvas of positioned) {
        canvas.y -= anchorOffset;
      }
    }
    return positioned;
  }, [baseCanvases, heights, pixelsPerUnit, initialCanvas]);

  return { canvases, onDividerHeightsChange: setHeights };
}
