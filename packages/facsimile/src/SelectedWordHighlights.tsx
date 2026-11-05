import {
  CanvasId,
  useClickedAnnotationsInFacsimile,
  useSelectedAnnotationsInFacsimile,
} from '@globalise/common/document';
import { getEntityPresentationFamilyByClassificationId } from '@globalise/common/annotation';
import { cn } from '@globalise/design';
import { getEntityHighlightColors } from './EntityHighlightColors.ts';
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
  const clicked = useClickedAnnotationsInFacsimile(canvasId);

  return words
    .filter((word) => selected.has(word.id))
    .map(({ id, path, entityClassificationId, hasEvent, hasHiddenEvent }) => (
      <polygon
        key={id}
        className={cn([
          'selected-word-highlight',
          hasEvent && 'event',
          hasHiddenEvent && !hasEvent && 'event-hidden',
        ])}
        points={path}
        data-clicked={clicked.has(id)}
        fill={getEntityHighlightColors(entityClassificationId
          ? getEntityPresentationFamilyByClassificationId(entityClassificationId)
          : undefined)[clicked.has(id) ? 'fill' : 'hoverFill']}
      />
    ));
}
