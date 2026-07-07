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

  function handleZoomIn() {
    zoomIn();
    setZoomPercent((value) => Math.min(value + 10, 400));
  }

  function handleZoomOut() {
    zoomOut();
    setZoomPercent((value) => Math.max(value - 10, 10));
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
      viewport.zoomTo(viewport.getHomeZoom(), null, true);
      viewport.panTo(homeBounds.getCenter(), true);
      viewport.applyConstraints();
    } else {
      home();
      if (rotation !== 0) {
        rotate(-rotation);
      }
    }
    setZoomPercent(100);
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
        <span className="gds-document-detail-scan-toolbar__zoom-label">
          {zoomPercent}%
        </span>
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
