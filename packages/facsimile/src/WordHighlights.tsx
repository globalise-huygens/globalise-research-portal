import { memo } from 'react';
import { FacsimileTooltipProps } from './FacsimileTooltip.tsx';
import { WordHighlightConfig } from './HighlightShape.ts';
import { WordHighlight } from './WordHighlight.tsx';

type WordHighlightsProps = {
  words: WordHighlightConfig[];
  setTooltip: (tooltip: FacsimileTooltipProps | null) => void;
};

export const WordHighlights = memo(function WordHighlights(
  { words, setTooltip }: WordHighlightsProps,
) {
  return (
    <g className="word-highlights">
      {words.map(({ id, path, text, entityClassificationId }) => (
        <WordHighlight
          key={id}
          id={id}
          points={path}
          text={text}
          entityClassificationId={entityClassificationId}
          setTooltip={setTooltip}
        />
      ))}
    </g>
  );
});
