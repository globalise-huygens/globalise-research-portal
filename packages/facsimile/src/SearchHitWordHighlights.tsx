import {
  type CanvasId,
  useActiveHitWordsInFacsimile,
  useSearchHitWordsInFacsimile,
} from '@globalise/common/document';
import { cn } from '@globalise/design';
import { WordHighlightConfig } from './HighlightConfig.ts';
import './WordHighlight.css';

type SearchHitWordHighlightsProps = {
  canvasId: CanvasId;
  words: WordHighlightConfig[];
};

export function SearchHitWordHighlights(
  { canvasId, words }: SearchHitWordHighlightsProps,
) {
  const hitWords = useSearchHitWordsInFacsimile(canvasId);
  const activeHitWords = useActiveHitWordsInFacsimile(canvasId);

  return words
    .filter((word) => hitWords.has(word.id))
    .map(({ id, path }) => (
      <polygon
        key={id}
        className={cn(['search-hit-word-highlight', activeHitWords.has(id) && 'active-hit'])}
        points={path}
      />
    ));
}
