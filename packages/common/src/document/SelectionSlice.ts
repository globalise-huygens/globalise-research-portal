import { Id } from '../annotation';
import { DocumentState, setState } from './DocumentStore';
import { createSelection, Selection } from './Selection';

export type SelectionSlice = {
  hovered: Selection | null;
  clicked: Selection | null;
};

export function setHovered(id: Id | null) {
  setState((s) => ({ hovered: resolveSelection(s, id) }));
}

export function toggleClicked(id: Id) {
  setState((s) => ({
    clicked: s.clicked?.id === id ? null : resolveSelection(s, id),
  }));
}

export function clearSelection() {
  setState({ hovered: null, clicked: null });
}

function resolveSelection(state: DocumentState, id: Id | null): Selection | null {
  if (!id) {
    return null;
  }
  for (const canvas of Object.values(state.canvases)) {
    const annotation = canvas.annotations?.[id];
    if (annotation) {
      return createSelection(annotation, canvas.indexes);
    }
  }
  return null;
}
