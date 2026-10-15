import { useLayoutEffect, useState, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useViewer } from '@knaw-huc/osd-iiif-viewer';
import type { Rect } from 'openseadragon';

/** Move existing overlays when the layout changes, preserving their contents. */
export function CanvasOverlay({ location, children }: PropsWithChildren<{ location: Rect }>) {
  const viewer = useViewer();
  const [element] = useState(() => {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.pointerEvents = 'none';
    return element;
  });

  useLayoutEffect(() => {
    if (viewer?.getOverlayById(element)) {
      viewer.updateOverlay(element, location);
    } else {
      viewer?.addOverlay({ element, location });
    }
  }, [viewer, element, location]);

  useLayoutEffect(() => () => {
    if (viewer?.isOpen()) {
      viewer.removeOverlay(element);
    }
  }, [viewer, element]);

  return viewer ? createPortal(children, element) : null;
}
