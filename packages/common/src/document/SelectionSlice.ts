import { Annotation, Id, isBlock, isClassified, isWord } from '../annotation';
import { DocumentState, setState } from './DocumentStore';
import { Selection } from './Selection';
import { CanvasState } from './ManifestViewerSlice';

export type SelectionSlice = {
  hovered: Selection | null;
  clicked: Selection | null;
};

export function setHovered(id: Id | null) {
  setState((s) => ({ hovered: createSelection(s, id) }));
}

export function toggleClicked(id: Id) {
  setState((s) => ({
    clicked: s.clicked?.id === id ? null : createSelection(s, id),
  }));
}

function createSelection(state: DocumentState, id: Id | null): Selection | null {
  if (!id) {
    return null;
  }
  for (const canvas of Object.values(state.canvases)) {
    const annotation = canvas.annotations?.[id];
    if(!annotation) {
      continue;
    }
    return createCanvasSelection(canvas, annotation);
  }
  return null;
}

export function createCanvasSelection(
  canvas: CanvasState,
  annotation: Annotation,
): Selection | null {
  const { indexes } = canvas;
  const { id } = annotation;

  if (isClassified(annotation)) {
    return {
      type: 'classified',
      id: annotation.id,
      words: indexes.classifiedToWords[id] ?? [],
      block: indexes.classifiedToBlock[id],
    };
  }
  if (isWord(annotation)) {
    return { type: 'word', id, block: indexes.wordToBlock[id] };
  }
  if (isBlock(annotation)) {
    return { type: 'block', id };
  }
  return null;
}

