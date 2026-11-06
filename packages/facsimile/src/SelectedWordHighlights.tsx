import { CanvasId, useSelectedAnnotationsInFacsimile } from '@globalise/common/document';
import { getEntityPresentationFamilyByClassificationId } from '@globalise/common/annotation';
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
    .map(({ id, path, entityClassificationId }) => (
      <polygon
        key={id}
        className="selected-word-highlight"
        points={path}
        data-presentation-family={entityClassificationId
          ? getEntityPresentationFamilyByClassificationId(entityClassificationId)
          : undefined}
      />
    ));
}
