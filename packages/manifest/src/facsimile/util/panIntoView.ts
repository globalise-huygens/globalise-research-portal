import { Point, type Viewer } from 'openseadragon';

export function panIntoView(viewer: Viewer, element: Element) {
  const view = viewer.element.getBoundingClientRect();
  const target = element.getBoundingClientRect();
  const center = new Point(
    target.x + target.width / 2 - view.x,
    target.y + target.height / 2 - view.y,
  );
  viewer.viewport.panTo(viewer.viewport.viewerElementToViewportCoordinates(center));
}
