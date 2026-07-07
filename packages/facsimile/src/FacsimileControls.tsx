import { useViewerControls } from '@knaw-huc/osd-iiif-viewer';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { type RefObject, useState } from 'react';

type FacsimileControlBarProps = {
  fullscreenRef: RefObject<HTMLDivElement | null>;
};

export function FacsimileControls({ fullscreenRef }: FacsimileControlBarProps) {
  const { zoomIn, zoomOut, rotate, toggleFullPage, isFullPage } =
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

  return (
    <>
      <button
        type="button"
        className="control-bar__button"
        aria-label="Zoom out"
        onClick={handleZoomOut}
      >
        <ZoomOutIcon />
      </button>
      <span className="control-bar__zoom">{zoomPercent}%</span>
      <button
        type="button"
        className="control-bar__button"
        aria-label="Zoom in"
        onClick={handleZoomIn}
      >
        <ZoomInIcon />
      </button>
      <span className="control-bar__divider" aria-hidden="true" />
      <button
        type="button"
        className="control-bar__button"
        aria-label="Rotate scan"
        onClick={() => {
          rotate(90);
        }}
      >
        <RotateRightIcon />
      </button>
      <button
        type="button"
        className="control-bar__button"
        aria-label={isFullPage ? 'Exit fullscreen' : 'Enter fullscreen'}
        onClick={toggleFullPage}
      >
        {isFullPage ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </button>
    </>
  );
}
