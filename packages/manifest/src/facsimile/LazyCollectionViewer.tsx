import {
  CanvasId,
  initCanvases,
  useSelectedCanvas,
} from '@globalise/common/document';
import type { CanvasDocuments } from '@globalise/metadata';
import { useCanvasLayout } from './useCanvasLayout.ts';
import { DocumentDividersOverlay } from './DocumentDividersOverlay.tsx';
import { FloatingToolbar } from '@globalise/design';
import { FacsimileControls } from '@globalise/facsimile';
import {
  useManifest,
  useViewer,
  useViewerStore,
} from '@knaw-huc/osd-iiif-viewer';
import { Point, Viewer as OsdViewer } from 'openseadragon';
import { PropsWithChildren, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { findCenterScan } from './findCenterScan.ts';
import {
  setLazyCanvases,
  setLoaded,
  setScrolling,
} from './LazyCollectionViewerStore.ts';
import { useContainerSize } from './useContainerSize.tsx';
import { useLazyCanvasLoader } from './useLazyCanvasLoader.tsx';
import { createLazyTiledImages } from './util/createLazyTiledImages.ts';
import { observeResize } from './util/observeResize.tsx';
import { useIsViewerScrolling } from './useIsViewerScrolling.tsx';
import './LazyCollectionViewer.css';

type Props = PropsWithChildren<{
  gap?: number;
  scanHeight: number;
  canvasDocuments: Map<string, CanvasDocuments>;
  initialCanvasId?: CanvasId;
  onCanvasChange: (canvasId: CanvasId) => void;
  preloadScreens?: number;
}>;

/**
 * Virtualize rendering of manifest with inventory of scans:
 * - calculate virtual canvas position and height from manifest casnvases
 * - map out all canvas positions sequentially down the vertical axis.
 * - watch open-seadragon viewport bounds as the user scrolls.
 * - lazy-load tile sources before they enter the screen.
 * - unload tiles that scroll out of view.
 */
export function LazyCollectionViewer({
  children,
  scanHeight,
  canvasDocuments,
  gap = 0.02,
  initialCanvasId,
  onCanvasChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useViewerStore();
  const viewer = useViewer();
  const [scanFilter, setScanFilter] = useState('');
  const { vault, id: manifestId, isReady } = useManifest();
  const size = useContainerSize(containerRef);
  const isScrollReady = size.width && size.height;
  const isScrolling = useIsViewerScrolling();

  const baseCanvases = useMemo(() => {
    if (!vault || !manifestId || !isReady) {
      return [];
    }
    return createLazyTiledImages(vault, manifestId, gap);
  }, [vault, manifestId, isReady, gap]);

  const initialIndex = initialCanvasId
    ? Math.max(0, baseCanvases.findIndex((c) => c.canvasId === initialCanvasId))
    : 0;
  const { canvases: lazyCanvases, onDividerHeightsChange } = useCanvasLayout(viewer, baseCanvases, initialIndex);
  const lazyCanvasesRef = useRef(lazyCanvases);
  const previousBase = useRef<typeof baseCanvases | null>(null);
  const onCanvasChangeRef = useRef(onCanvasChange);

  useLayoutEffect(() => {
    lazyCanvasesRef.current = lazyCanvases;
    setLazyCanvases(lazyCanvases, previousBase.current !== baseCanvases);
    previousBase.current = baseCanvases;
  }, [lazyCanvases, baseCanvases]);

  useEffect(() => {
    onCanvasChangeRef.current = onCanvasChange;
  }, [onCanvasChange]);

  useLazyCanvasLoader({
    viewer,
    lazyCanvases,
    baseCanvases,
    initialCanvas: initialIndex,
    canvasHeight: scanHeight,
    onLoadedChange: setLoaded,
  });

  useEffect(initCanvasesLazily, [baseCanvases, initialCanvasId]);

  function initCanvasesLazily() {
    if (!baseCanvases.length) {
      return;
    }
    initCanvases(
      baseCanvases.map((c) => c.canvasId),
      initialCanvasId,
    );
  }

  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();

  useEffect(subscribeToExternalCanvasChange, [
    viewer,
    baseCanvases,
    selectedCanvasId,
    selectedCanvasSource,
  ]);

  function subscribeToExternalCanvasChange() {
    if (!viewer || !lazyCanvasesRef.current.length) {
      return;
    }
    if (selectedCanvasSource === 'facsimile') {
      return;
    }
    const canvas = lazyCanvasesRef.current.find((c) => c.canvasId === selectedCanvasId);
    if (!canvas) {
      return;
    }
    const verticalCenter = canvas.y + canvas.height / 2;
    viewer.viewport.panTo(new Point(0.5, verticalCenter), true);
  }

  useEffect(createViewer, [isScrollReady, store]);

  function createViewer() {
    if (!containerRef.current || !isScrollReady) {
      return;
    }
    const viewer = new OsdViewer({
      element: containerRef.current,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      crossOriginPolicy: 'Anonymous',
      showNavigationControl: false,
      constrainDuringPan: false,
      visibilityRatio: 0,
      minZoomLevel: 0.001,
      preserveViewport: true,
      gestureSettingsMouse: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: true,
      },
      tileRetryMax: 3,
      tileRetryDelay: 3000,
      // springStiffness: 25,
      animationTime: 0.4,
    });

    const container = containerRef.current;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scrollDistance = event.deltaY;
      if (event.ctrlKey) {
        const zoomFactor = scrollDistance < 0 ? 1.1 : 0.9;
        viewer.viewport.zoomBy(zoomFactor);
      } else {
        const panDistance = viewer.viewport.deltaPointsFromPixels(
          new Point(0, scrollDistance),
        );
        viewer.viewport.panBy(panDistance);
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    store.getState().setViewer(viewer);
    store.getState().setViewerReady(true);

    const onAnimationStart = () => {
      setScrolling(true);
    };

    const onAnimationFinish = () => {
      setScrolling(false);
    };

    const onViewportChange = () => {
      const centerId = findCenterScan(viewer, lazyCanvasesRef.current);
      if (centerId) {
        onCanvasChangeRef.current(centerId);
      }
    };

    viewer.addHandler('animation-start', onAnimationStart);
    viewer.addHandler('animation-finish', onAnimationFinish);
    viewer.addHandler('viewport-change', onViewportChange);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      viewer.removeHandler('animation-start', onAnimationStart);
      viewer.removeHandler('animation-finish', onAnimationFinish);
      viewer.removeHandler('viewport-change', onViewportChange);
      setScrolling(false);
      viewer.destroy();
      store.getState().resetViewer();
    };
  }

  useEffect(handleResize, [store]);

  function handleResize() {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    return observeResize(container, () => {
      const { viewer, viewerReady } = store.getState();
      if (viewer && viewerReady) {
        viewer.forceResize();
      }
    });
  }

  return (
    <>
      <FloatingToolbar>
        <FacsimileControls
          fullscreenRef={containerRef}
          onScanFilterChange={setScanFilter}
        />
      </FloatingToolbar>
      <div
        ref={containerRef}
        className="lazy-collection-viewer"
        data-scrolling={isScrolling || undefined}
        style={{
          width: '100%',
          height: '100%',
          filter: scanFilter || undefined,
        }}
      />
      <DocumentDividersOverlay
        canvases={lazyCanvases}
        canvasDocuments={canvasDocuments}
        onHeightsChange={onDividerHeightsChange}
      />
      {children}
    </>
  );
}
