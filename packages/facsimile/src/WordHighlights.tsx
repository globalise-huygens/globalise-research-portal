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
      {words.map(({ id, path, text, hasEvent, targetId }) => (
        <WordHighlight
          key={id}
          wordId={id}
          points={path}
          text={text}
          hasEvent={hasEvent}
          targetId={targetId}
          setTooltip={setTooltip}
        />
      ))}
    </g>
  );
});
