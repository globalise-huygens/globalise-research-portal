import { useDocumentStore } from './DocumentStore';
import { Id } from '../annotation';

export type SelectionSlice = {
  hoveredId: Id | null;
  hoveredAt: HoverAnchor | null;
  clickedId: Id | null;
};

export type HoverAnchor = {
  element?: Element;
  openImmediately?: boolean;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function createHoverAnchor(
  element: Element,
  openImmediately = false,
): HoverAnchor {
  const { left, top, right, bottom } = element.getBoundingClientRect();
  return { element, openImmediately, left, top, right, bottom };
}

export function setHovered(
  id: Id | null,
  anchor?: HoverAnchor,
) {
  const current = useDocumentStore.getState();
  if (current.hoveredId === id) {
    if (!anchor || !current.hoveredAt) {
      return;
    }
  }
  useDocumentStore.setState({
    hoveredId: id,
    hoveredAt: id && anchor ? anchor : null,
  });
}

export function toggleClicked(id: Id) {
  const { clickedId } = useDocumentStore.getState();
  useDocumentStore.setState({
    clickedId: id === clickedId ? null : id,
  });
}

export function clearSelection() {
  useDocumentStore.setState({ hoveredId: null, hoveredAt: null, clickedId: null });
}
