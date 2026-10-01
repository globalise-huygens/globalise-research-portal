import { CanvasId, useSelectedAnnotationsInFacsimile } from '@globalise/common/document';
import { getCidocClassNameByClassificationId } from '@globalise/common/annotation';
import { getEntityHighlightColors } from './EntityHighlightTone.ts';
import { WordHighlightConfig } from './HighlightShape.ts';
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
        fill={getEntityHighlightColors(entityClassificationId
          ? getCidocClassNameByClassificationId(entityClassificationId)
          : undefined).fill}
      />
    ));
}
