import { CanvasId, useSelectedAnnotationsInFacsimile } from '@globalise/common/document';
import { type ClassifiedTone, type Id } from '@globalise/common/annotation';
import { WordHighlightConfig } from './HighlightConfig.ts';
import './WordHighlight.css';

type SelectedWordHighlightsProps = {
  canvasId: CanvasId;
  words: WordHighlightConfig[];
};

export function SelectedWordHighlights(
  { canvasId, words }: SelectedWordHighlightsProps,
) {
  const selected = useSelectedAnnotationsInFacsimile(canvasId);

  return words
    .filter((word) => selected.has(word.id))
    .flatMap(({ id, path, tones }) => getSelectedTones(tones, selected).map((tone) => (
      <polygon
        key={`${id}-${tone}`}
        className="selected-word-highlight"
        points={path}
        data-presentation-family={tone}
      />
    )));
}

function getSelectedTones(
  tones: Record<Id, ClassifiedTone | undefined>,
  selected: ReadonlySet<Id>,
): (ClassifiedTone | undefined)[] {
  const selectedTones = Object.entries(tones)
    .filter(([classifiedId]) => selected.has(classifiedId))
    .map(([, tone]) => tone);
  return selectedTones.length ? selectedTones : [undefined];
}
