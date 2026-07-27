import React, { useRef, useState } from 'react';
import { FloatingToolbar } from '@globalise/design';
import { Viewer } from '@knaw-huc/osd-iiif-viewer';
import { FacsimileControls } from './FacsimileControls.tsx';
import { CanvasControls } from './CanvasControls.tsx';
import { FacsimileOverlay } from './FacsimileOverlay.tsx';

import './FacsimileView.css';
import { CanvasId } from '@globalise/common/document';

export type FacsimileViewerProps = {
  style?: React.CSSProperties;
  showNavigation?: boolean;
  canvasId: CanvasId
};

export function FacsimileView(
  { canvasId, style, showNavigation = true }: FacsimileViewerProps,
) {
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [scanFilter, setScanFilter] = useState('');
  return (
    <div
      className="facsimile-view"
      ref={fullscreenRef}
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
    >
      <div
        className="scan"
        style={{ filter: scanFilter || undefined }}
      >
        <Viewer options={{
          showNavigationControl: false,
          gestureSettingsMouse: { clickToZoom: false },
        }}/>
      </div>
      <FacsimileOverlay canvasId={canvasId}/>
      <FloatingToolbar aria-label="Scan controls">
        <FacsimileControls
          fullscreenRef={fullscreenRef}
          onScanFilterChange={setScanFilter}
        />
      </FloatingToolbar>
      {showNavigation && <CanvasControls/>}
    </div>
  );
}
