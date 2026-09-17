import {
  Annotation,
  AnnotationIndexes,
  Id,
  isBlock,
  isEntity,
  isWord,
} from '../annotation';

export type Selection =
  | { type: 'word'; id: Id; block?: Id }
  | { type: 'entity'; id: Id; words: Id[]; block?: Id }
  | { type: 'block'; id: Id };

export type EntitySelection = 'entity' | 'words';

export function createSelection(
  annotation: Annotation,
  indexes: AnnotationIndexes,
): Selection | null {
  const { id } = annotation;

  if (isEntity(annotation)) {
    return {
      type: 'entity',
      id,
      words: indexes.entityToWords[id] ?? [],
      block: indexes.entityToBlock[id],
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

export function isInSelection(
  selection: Selection | null,
  id: Id,
  entitySelection: EntitySelection,
): boolean {
  if (!selection) {
    return false;
  }
  if (selection.id === id) {
    return true;
  }
  if (selection.type === 'block') {
    return false;
  }
  if (selection.block === id) {
    return true;
  }
  return selection.type === 'entity'
    && entitySelection === 'words'
    && selection.words.includes(id);
}

export function selectionIds(
  selection: Selection | null,
  entitySelection: EntitySelection,
): Id[] {
  if (!selection) {
    return [];
  }
  const ids = [selection.id];
  if (selection.type === 'block') {
    return ids;
  }
  if (selection.type === 'entity' && entitySelection === 'words') {
    ids.push(...selection.words);
  }
  if (selection.block) {
    ids.push(selection.block);
  }
  return ids;
}
