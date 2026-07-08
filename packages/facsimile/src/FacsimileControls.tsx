import {
  DocumentDetailToolButton,
  IconReset,
  IconRotate,
  IconZoomIn,
  IconZoomOut,
} from '@globalise/design';
import { useViewer, useViewerControls } from '@knaw-huc/osd-iiif-viewer';
import { type RefObject, useState } from 'react';

type FacsimileControlBarProps = {
  fullscreenRef: RefObject<HTMLDivElement | null>;
};

export function FacsimileControls({ fullscreenRef }: FacsimileControlBarProps) {
  const viewer = useViewer();
  const { zoomIn, zoomOut, home, rotate, rotation } =
    useViewerControls(fullscreenRef);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomInput, setZoomInput] = useState('100');

  function applyZoomPercent(value: number) {
    const nextZoomPercent = Math.min(Math.max(value, 10), 400);
    if (viewer) {
      const { viewport } = viewer;
      viewport.zoomTo(
        viewport.getHomeZoom() * (nextZoomPercent / 100),
        undefined,
        true,
      );
      viewport.applyConstraints();
    }
    setZoomPercent(nextZoomPercent);
    setZoomInput(String(nextZoomPercent));
  }

  function commitZoomInput() {
    const parsed = Number.parseInt(zoomInput, 10);
    if (Number.isNaN(parsed)) {
      setZoomInput(String(zoomPercent));
      return;
    }
    applyZoomPercent(parsed);
  }

  function handleZoomIn() {
    if (!viewer) {
      zoomIn();
    }
    applyZoomPercent(zoomPercent + 10);
  }

  function handleZoomOut() {
    if (!viewer) {
      zoomOut();
    }
    applyZoomPercent(zoomPercent - 10);
  }

  function handleResetView() {
    if (viewer) {
      const { viewport } = viewer;
      const homeBounds = viewport.getHomeBounds();

      // Force-reset all mutable viewport state for lazy/virtualized manifests.
      if (viewport.getRotation() !== 0) {
        viewport.setRotation(0);
      }
      viewport.fitBounds(homeBounds, true);
      viewport.zoomTo(viewport.getHomeZoom(), undefined, true);
      viewport.panTo(homeBounds.getCenter(), true);
      viewport.applyConstraints();
    } else {
      home();
      if (rotation !== 0) {
        rotate(-rotation);
      }
    }
    setZoomPercent(100);
    setZoomInput('100');
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
            aria-label="Scan zoom percentage"
            className="gds-document-detail-scan-toolbar__zoom-input"
            inputMode="numeric"
            maxLength={3}
            value={zoomInput}
            onBlur={commitZoomInput}
            onChange={(event) => {
              setZoomInput(event.currentTarget.value.replace(/[^\d]/g, ''));
            }}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                commitZoomInput();
                event.currentTarget.blur();
              }
            }}
          />
          <span className="gds-document-detail-scan-toolbar__zoom-suffix">
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
