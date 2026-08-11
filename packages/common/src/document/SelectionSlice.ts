import { useDocumentStore } from './DocumentStore';
import { Id } from '../annotation';

export type SelectionSlice = {
  hoveredId: Id | null;
  clickedId: Id | null;
};

export function setHovered(id: Id | null) {
  useDocumentStore.setState({ hoveredId: id });
}

export function toggleClicked(id: Id) {
  const { clickedId } = useDocumentStore.getState();
  useDocumentStore.setState({
    clickedId: id === clickedId ? null : id,
  });
}

export function clearSelection() {
  useDocumentStore.setState({ hoveredId: null, clickedId: null });
}
