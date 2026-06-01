import {Point, Viewer as OsdViewer} from 'openseadragon';
import {PropsWithChildren, useEffect, useMemo, useRef} from "react";
import {
  useManifest,
  useViewer,
  useViewerStore
} from "@knaw-huc/osd-iiif-viewer";
import {useContainerSize} from "./useContainerSize.tsx";
import {observeResize} from "./util/observeResize.tsx";
import {useLazyCanvasLoader} from "./useLazyCanvasLoader.tsx";
import {createLazyTiledImages} from "./util/createLazyTiledImages.ts";
import {LazyCollectionViewerContext} from './LazyCollectionViewerContext.tsx';
import {initCanvases} from "@globalise/common/document";

type Props = PropsWithChildren<{
  gap?: number;
  scanHeight: number;
  initialCanvas?: number;
  onCanvasChange?: (index: number) => void;
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
    initialCanvas = 0,
    onCanvasChange
  }: Props
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useViewerStore();
  const viewer = useViewer();
  const {vault, id: manifestId, isReady} = useManifest();
  const size = useContainerSize(containerRef);
  const isContainerReady = size.width && size.height;

  const lazyCanvases = useMemo(() => {
    if (!vault || !manifestId || !isReady) {
      return [];
    }
    return createLazyTiledImages(vault, manifestId, gap);
  }, [vault, manifestId, isReady, gap]);

  useLazyCanvasLoader({
    viewer,
    lazyCanvases,
    initialCanvas,
    onCanvasChange,
    canvasHeight: scanHeight,
  });

  useEffect(initCanvasesLazily, [lazyCanvases, initialCanvas]);
  function initCanvasesLazily() {
    if (!lazyCanvases.length) {
      return;
    }
    initCanvases(lazyCanvases.map(c => c.canvasId), initialCanvas);
  }

  useEffect(createViewer, [isContainerReady, store]);
  function createViewer() {
    if (!containerRef.current || !isContainerReady) {
      return;
    }
    const viewer = new OsdViewer({
      element: containerRef.current,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      crossOriginPolicy: 'Anonymous',
      showNavigationControl: true,
      constrainDuringPan: false,
      visibilityRatio: 0,
      minZoomLevel: 0.001,
      preserveViewport: true,
      gestureSettingsMouse: {
        scrollToZoom: false,
      },
      tileRetryMax: 3,
      tileRetryDelay: 3000,
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
    container.addEventListener('wheel', handleWheel, {passive: false});

    store.getState().setViewer(viewer);
    store.getState().setViewerReady(true);

    return () => {
      container.removeEventListener('wheel', handleWheel);
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
      const {viewer, viewerReady} = store.getState();
      if (viewer && viewerReady) {
        viewer.forceResize();
      }
    });
  }

  return (
    <LazyCollectionViewerContext.Provider value={{
      lazyCanvases: {current: lazyCanvases},
    }}>
      <div
        ref={containerRef}
        style={{width: '100%', height: '100%'}}
      />
      {children}
    </LazyCollectionViewerContext.Provider>
  );
}
