import {
  DocumentDetailToolButton,
  IconReset,
  IconRotate,
  IconZoomIn,
  IconZoomOut,
} from '@globalise/design';
import { useViewer, useViewerControls } from '@knaw-huc/osd-iiif-viewer';
import { type Point, type Rect } from 'openseadragon';
import { type RefObject, useEffect, useRef, useState } from 'react';

type FacsimileControlBarProps = {
  fullscreenRef: RefObject<HTMLDivElement | null>;
};

const MIN_ZOOM_PERCENT = 10;
const MAX_ZOOM_PERCENT = 400;

export function FacsimileControls({ fullscreenRef }: FacsimileControlBarProps) {
  const viewer = useViewer();
  const { home, rotate, rotation } = useViewerControls(fullscreenRef);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomInput, setZoomInput] = useState<string | null>(null);
  const initialViewRef = useRef<{ zoom: number; center: Point } | null>(null);

  const zoomInputValue = zoomInput ?? String(zoomPercent);

  useEffect(() => {
    if (!viewer) {
      initialViewRef.current = null;
      return;
    }
    let nextFrameId: number | null = null;
    const frameId = requestAnimationFrame(() => {
      nextFrameId = requestAnimationFrame(() => {
        initialViewRef.current = {
          zoom: viewer.viewport.getZoom(),
          center: viewer.viewport.getCenter(),
        };
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      if (nextFrameId !== null) {
        cancelAnimationFrame(nextFrameId);
      }
    };
  }, [viewer]);

  function getInitialView() {
    if (!viewer) {
      return null;
    }
    initialViewRef.current ??= {
      zoom: viewer.viewport.getZoom(),
      center: viewer.viewport.getCenter(),
    };
    return initialViewRef.current;
  }

  function setViewerZoomPercent(value: number) {
    const requestedZoomPercent = Math.min(
      Math.max(value, MIN_ZOOM_PERCENT),
      MAX_ZOOM_PERCENT,
    );
    if (viewer) {
      const { viewport } = viewer;
      const initialView = getInitialView();
      const baseZoom = initialView?.zoom ?? viewport.getZoom();
      viewport.zoomTo(
        baseZoom * (requestedZoomPercent / 100),
        undefined,
        true,
      );
      viewport.applyConstraints(true);
      const actualZoomPercent = Math.round(
        (viewport.getZoom() / baseZoom) * 100,
      );
      setZoomPercent(actualZoomPercent);
      return actualZoomPercent;
    }
    setZoomPercent(requestedZoomPercent);
    return requestedZoomPercent;
  }

  function applyZoomPercent(value: number) {
    const nextZoomPercent = setViewerZoomPercent(value);
    setZoomInput(null);
    return nextZoomPercent;
  }

  function commitZoomInput() {
    const parsed = Number.parseInt(zoomInputValue, 10);
    if (Number.isNaN(parsed)) {
      setZoomInput(null);
      return;
    }
    applyZoomPercent(parsed);
  }

  function handleZoomInputChange(value: string) {
    const nextValue = value.replace(/[^\d]/g, '').slice(0, 3);
    setZoomInput(nextValue);
  }

  function handleZoomIn() {
    applyZoomPercent(zoomPercent + 10);
  }

  function handleZoomOut() {
    applyZoomPercent(zoomPercent - 10);
  }

  function handleResetView() {
    if (viewer) {
      const { viewport } = viewer;
      const initialView = getInitialView();

      // Force-reset all mutable viewport state for lazy/virtualized manifests.
      if (viewport.getRotation() !== 0) {
        viewport.setRotation(0);
      }
      if (initialView) {
        viewport.zoomTo(initialView.zoom, undefined, true);
        viewport.panTo(initialView.center, true);
      } else {
        const homeBounds: Rect = viewport.getHomeBounds();
        viewport.fitBounds(homeBounds, true);
        viewport.panTo(homeBounds.getCenter(), true);
      }
      viewport.applyConstraints(true);
      setZoomPercent(100);
    } else {
      home();
      if (rotation !== 0) {
        rotate(-rotation);
      }
      setZoomPercent(100);
    }
    setZoomInput(null);
  }

  return (
    <>
      <div className="gds-document-detail-scan-toolbar__zoom-segment">
        <DocumentDetailToolButton
          aria-label="Zoom out"
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconZoomOut className="gds-document-detail-scan-toolbar__icon" />
          }
          onPress={handleZoomOut}
          size="compact"
        />
        <label className="gds-document-detail-scan-toolbar__zoom-field">
          <input
            aria-label="Scan zoom percentage, 10 to 400"
            className="gds-document-detail-scan-toolbar__zoom-input"
            inputMode="numeric"
            maxLength={3}
            pattern="[0-9]*"
            type="text"
            value={zoomInputValue}
            onBlur={commitZoomInput}
            onChange={(event) => {
              handleZoomInputChange(event.currentTarget.value);
            }}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitZoomInput();
              }
            }}
          />
          <span
            aria-hidden="true"
            className="gds-document-detail-scan-toolbar__zoom-suffix"
          >
            %
          </span>
        </label>
        <DocumentDetailToolButton
          aria-label="Zoom in"
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconZoomIn className="gds-document-detail-scan-toolbar__icon" />
          }
          onPress={handleZoomIn}
          size="compact"
        />
      </div>
      <span
        className="gds-document-detail-scan-toolbar__divider"
        aria-hidden="true"
      />
      <DocumentDetailToolButton
        aria-label="Reset scan view"
        className="gds-document-detail-scan-toolbar__button"
        icon={<IconReset className="gds-document-detail-scan-toolbar__icon" />}
        onPress={handleResetView}
        size="compact"
      />
      <DocumentDetailToolButton
        aria-label="Rotate scan"
        className="gds-document-detail-scan-toolbar__button"
        icon={<IconRotate className="gds-document-detail-scan-toolbar__icon" />}
        onPress={() => {
          rotate(90);
        }}
        size="compact"
      />
    </>
  );
}
