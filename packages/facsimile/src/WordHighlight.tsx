import { memo, type MouseEvent } from 'react';
import { usePointerDown } from '@knaw-huc/osd-iiif-viewer';
import {
  removeHoverAttribute,
  setHoverAttribute,
  setHovered,
  toggleClicked,
} from '@globalise/common/document';
import { cn } from '@globalise/design';
import { FacsimileTooltipProps } from './FacsimileTooltip.tsx';
import { type Id } from '@globalise/common/annotation';
import './WordHighlight.css';

type WordHighlightProps = {
  wordId: Id;
  points: string;
  text: string;
  hasEvent?: boolean;
  targetId?: Id;
  setTooltip: (tooltip: FacsimileTooltipProps | null) => void;
};

export const WordHighlight = memo(function WordHighlight(
  {
    wordId, points, text, hasEvent, targetId, setTooltip,
  }: WordHighlightProps,
) {
  const id = targetId ?? wordId;
  const isClassifiedTrigger = targetId !== undefined;
  const handlePointerDown = usePointerDown({
    onClick: () => toggleClicked(id),
  });

  function handleHover(hovering: boolean, event: MouseEvent) {
    if (!hovering && document.activeElement === event.currentTarget) {
      return;
    }
    if (hovering) {
      setHoverAttribute(event.currentTarget, 'delayed');
    } else {
      removeHoverAttribute(event.currentTarget);
    }
    setHovered(hovering ? id : null);
    if (hovering && !isClassifiedTrigger) {
      setTooltip({ text, x: event.clientX, y: event.clientY });
    } else {
      setTooltip(null);
    }
  }

  return (
    <polygon
      className={cn(['word-highlight', hasEvent && 'event'])}
      points={points}
      tabIndex={isClassifiedTrigger ? 0 : undefined}
      role={isClassifiedTrigger ? 'button' : undefined}
      aria-haspopup={isClassifiedTrigger ? 'dialog' : undefined}
      aria-label={isClassifiedTrigger ? `Select word: ${text}` : undefined}
      onPointerDown={handlePointerDown}
      onMouseEnter={(event) => handleHover(true, event)}
      onMouseMove={(event) => {
        if (!isClassifiedTrigger) {
          handleHover(true, event);
        }
      }}
      onMouseLeave={(event) => handleHover(false, event)}
      onFocus={(event) => {
        if (isClassifiedTrigger) {
          setHoverAttribute(event.currentTarget);
          setHovered(id);
        }
      }}
      onBlur={(event) => {
        removeHoverAttribute(event.currentTarget);
        setHovered(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleClicked(id);
        }
      }}
    />
  );
});
