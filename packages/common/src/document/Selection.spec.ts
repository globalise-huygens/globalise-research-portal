import { describe, expect, it } from 'vitest';
import { createSelection, isInSelection, selectionIds } from './Selection.ts';
import {
  Annotation,
  AnnotationIndexes,
  Body,
  CidocEntityClassificationId,
  Id,
} from '../annotation';

describe(createSelection.name, () => {
  it('links a word to its block', () => {
    expect(createSelection(annotations.word1, indexes))
      .toEqual({ type: 'word', id: 'word1', block: 'block' });
  });

  it('links an entity to its words and block', () => {
    expect(createSelection(annotations.person, indexes)).toEqual({
      type: 'entity',
      id: 'person',
      words: ['word1'],
      block: 'block',
    });
  });

  it('links a block only to itself', () => {
    expect(createSelection(annotations.block, indexes))
      .toEqual({ type: 'block', id: 'block' });
  });
});

describe(isInSelection.name, () => {
  const word1Selection = createSelection(annotations.word1, indexes);
  const personSelection = createSelection(annotations.person, indexes);
  const blockSelection = createSelection(annotations.block, indexes);

  it('contains the selected annotation and its block', () => {
    expect(isInSelection(word1Selection, 'word1', 'words')).toBe(true);
    expect(isInSelection(word1Selection, 'block', 'words')).toBe(true);
    expect(isInSelection(word1Selection, 'word2', 'words')).toBe(false);
  });

  it('contains the words of an entity only where entities expand to words', () => {
    expect(isInSelection(personSelection, 'word1', 'words')).toBe(true);
    expect(isInSelection(personSelection, 'word1', 'entity')).toBe(false);
  });

  it('contains nothing beyond a selected block', () => {
    expect(isInSelection(blockSelection, 'block', 'words')).toBe(true);
    expect(isInSelection(blockSelection, 'word1', 'words')).toBe(false);
  });

  it('contains nothing without a selection', () => {
    expect(isInSelection(null, 'word1', 'words')).toBe(false);
  });
});

describe(selectionIds.name, () => {
  it('lists an entity as itself, its words and its block', () => {
    expect(selectionIds(createSelection(annotations.person, indexes), 'words'))
      .toEqual(['person', 'word1', 'block']);
  });

  it('leaves out the words where entities do not expand to words', () => {
    expect(selectionIds(createSelection(annotations.person, indexes), 'entity'))
      .toEqual(['person', 'block']);
  });
});

const personCategory: CidocEntityClassificationId = 'gan:PER_NAME';

const annotations = {
  word1: annotation('word1', 'word'),
  word2: annotation('word2', 'word'),
  block: annotation('block', 'block'),
  person: annotation('person', 'word', entityBody(personCategory)),
};

const indexes: AnnotationIndexes = {
  wordToLine: {},
  lineToBlock: {},
  blockToLines: { block: ['word1', 'word2'] },
  wordToBlock: { word1: 'block', word2: 'block' },
  entityToWords: { person: ['word1'] },
  entityToBlock: { person: 'block' },
};

function annotation(
  id: Id,
  textGranularity: 'word' | 'block',
  body?: Body,
): Annotation {
  return {
    id,
    type: 'Annotation',
    textGranularity,
    body: body ? [body] : [],
    target: [],
  };
}

function entityBody(classificationId: string): Body {
  return {
    type: 'AppellativeStatus',
    classified_as: { id: classificationId, type: 'Type', _label: 'label' },
    ascribes_classification: { id: '', type: '', _label: '' },
  };
}
