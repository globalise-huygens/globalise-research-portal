import { useDocumentStore } from './DocumentStore';
import { Id } from '../annotation';

export type SelectionSlice = {
  hoveredId: Id | null;
  clickedId: Id | null;
};

export type HoverAnchor = {
  element: Element;
  openImmediately?: boolean;
};

type HoverListener = (
  id: Id | null,
  anchor?: HoverAnchor,
) => void;

const hoverListeners = new Set<HoverListener>();

export function createHoverAnchor(
  element: Element,
  openImmediately = false,
): HoverAnchor {
  return { element, openImmediately };
}

export function subscribeHovered(listener: HoverListener) {
  hoverListeners.add(listener);
  return () => {
    hoverListeners.delete(listener);
  };
}

export function setHovered(
  id: Id | null,
  anchor?: HoverAnchor,
) {
  if (useDocumentStore.getState().hoveredId !== id) {
    useDocumentStore.setState({ hoveredId: id });
  }
  hoverListeners.forEach((listener) => listener(id, anchor));
}

export function toggleClicked(id: Id) {
  const { clickedId } = useDocumentStore.getState();
  useDocumentStore.setState({
    clickedId: id === clickedId ? null : id,
  });
}

export function clearSelection() {
  useDocumentStore.setState({ hoveredId: null, clickedId: null });
  hoverListeners.forEach((listener) => listener(null));
}
