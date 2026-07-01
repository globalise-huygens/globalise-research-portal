import { Point, Viewer as OsdViewer } from 'openseadragon';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  useManifest,
  useViewer,
  useViewerStore,
} from '@knaw-huc/osd-iiif-viewer';
import { useContainerSize } from './useContainerSize.tsx';
import { observeResize } from './util/observeResize.tsx';
import { useLazyCanvasLoader } from './useLazyCanvasLoader.tsx';
import { createLazyTiledImages } from './util/createLazyTiledImages.ts';
import {
  setLazyCanvases, setLoaded, setScrolling,
} from './LazyCollectionViewerStore.ts';
import {
  CanvasId,
  initCanvases,
  useSelectedCanvas,
} from '@globalise/common/document';
import { findCenterScan } from './findCenterScan.ts';
import { ControlBar, FacsimileControls } from '@globalise/facsimile';

type Props = PropsWithChildren<{
  gap?: number;
  scanHeight: number;
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
export function LazyCollectionViewer(
  {
    children,
    scanHeight,
    gap = 0.02,
    initialCanvasId,
    onCanvasChange,
  }: Props,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useViewerStore();
  const viewer = useViewer();
  const { vault, id: manifestId, isReady } = useManifest();
  const size = useContainerSize(containerRef);
  const isScrollReady = size.width && size.height;

  const lazyCanvases = useMemo(() => {
    if (!vault || !manifestId || !isReady) {
      return [];
    }
    return createLazyTiledImages(vault, manifestId, gap);
  }, [vault, manifestId, isReady, gap]);

  useEffect(syncLazyCanvases, [lazyCanvases]);

  function syncLazyCanvases() {
    setLazyCanvases(lazyCanvases);
  }

  const initialIndex = initialCanvasId
    ? lazyCanvases.findIndex((c) => c.canvasId === initialCanvasId)
    : 0;

  useLazyCanvasLoader({
    viewer,
    lazyCanvases,
    initialCanvas: initialIndex >= 0 ? initialIndex : 0,
    canvasHeight: scanHeight,
    onLoadedChange: setLoaded,
  });

  useEffect(initCanvasesLazily, [lazyCanvases, initialCanvasId]);

  function initCanvasesLazily() {
    if (!lazyCanvases.length) {
      return;
    }
    initCanvases(lazyCanvases.map((c) => c.canvasId), initialCanvasId);
  }

  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();

  useEffect(
    subscribeToExternalCanvasChange,
    [viewer, lazyCanvases, selectedCanvasId, selectedCanvasSource],
  );

  function subscribeToExternalCanvasChange() {
    if (!viewer || !lazyCanvases.length) {
      return;
    }
    if (selectedCanvasSource === 'facsimile') {
      return;
    }
    const canvas = lazyCanvases.find((c) => c.canvasId === selectedCanvasId);
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
        const panDistance = viewer.viewport
          .deltaPointsFromPixels(new Point(0, scrollDistance));
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
      const centerId = findCenterScan(viewer, lazyCanvases);
      if (centerId) {
        onCanvasChange(centerId);
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
      <ControlBar>
        <FacsimileControls fullscreenRef={containerRef}/>
      </ControlBar>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
      {children}
    </>
  );
}