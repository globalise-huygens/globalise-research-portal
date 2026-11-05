import { memo } from 'react';
import { FacsimileTooltipProps } from './FacsimileTooltip.tsx';
import { WordHighlightConfig } from './HighlightConfig.ts';
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
      {words.map((word) => (
        <WordHighlight
          key={word.id}
          id={word.id}
          points={word.path}
          text={word.text}
          entityClassificationId={word.entityClassificationId}
          entityIsHighlighted={word.entityIsHighlighted}
          hasEvent={word.hasEvent}
          hasHiddenEvent={word.hasHiddenEvent}
          setTooltip={setTooltip}
        />
      ))}
    </g>
  );
});
