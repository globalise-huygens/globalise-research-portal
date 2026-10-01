import { memo, type MouseEvent } from 'react';
import { usePointerDown } from '@knaw-huc/osd-iiif-viewer';
import {
  removeHoverAttribute,
  setHoverAttribute,
  setHovered,
  toggleClicked,
} from '@globalise/common/document';
import { FacsimileTooltipProps } from './FacsimileTooltip.tsx';
import {
  type Id,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import './WordHighlight.css';

type WordHighlightProps = {
  id: Id;
  points: string;
  text: string;
  entityClassificationId?: CidocEntityClassificationId;
  setTooltip: (tooltip: FacsimileTooltipProps | null) => void;
};

export const WordHighlight = memo(function WordHighlight(
  {
    id, points, text, entityClassificationId, setTooltip,
  }: WordHighlightProps,
) {
  const isEntityTrigger = entityClassificationId !== undefined;
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
    if (hovering && !isEntityTrigger) {
      setTooltip({ text, x: event.clientX, y: event.clientY });
    } else {
      setTooltip(null);
    }
  }

  return (
    <polygon
      className="word-highlight"
      points={points}
      tabIndex={isEntityTrigger ? 0 : undefined}
      role={isEntityTrigger ? 'button' : undefined}
      aria-haspopup={isEntityTrigger ? 'dialog' : undefined}
      aria-label={isEntityTrigger ? `Select word: ${text}` : undefined}
      onPointerDown={handlePointerDown}
      onMouseEnter={(event) => handleHover(true, event)}
      onMouseMove={(event) => {
        if (!isEntityTrigger) {
          handleHover(true, event);
        }
      }}
      onMouseLeave={(event) => handleHover(false, event)}
      onFocus={(event) => {
        if (isEntityTrigger) {
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
