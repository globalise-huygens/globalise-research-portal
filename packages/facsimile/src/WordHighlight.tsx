import { type MouseEvent, useState } from 'react';
import {
  CanvasId,
  removeHoverAttribute,
  setHoverAttribute,
  setHovered,
  toggleClicked,
  useIsSelectedInFacsimile,
} from '@globalise/common/document';
import { FacsimileTooltipProps } from './FacsimileTooltip.tsx';
import {
  type Id,
  type CidocEntityClassificationId,
  getCidocClassNameByClassificationId,
} from '@globalise/common/annotation';
import { getEntityHighlightColors } from './EntityHighlightTone.ts';

type WordHighlightProps = {
  canvasId: CanvasId;
  id: Id;
  points: string;
  text: string;
  entityClassificationId?: CidocEntityClassificationId;
  setTooltip: (tooltip: FacsimileTooltipProps | null) => void;
};

export function WordHighlight(
  {
    canvasId, id, points, text, entityClassificationId, setTooltip,
  }: WordHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);
  const isEntityTrigger = entityClassificationId !== undefined;
  const colors = getEntityHighlightColors(entityClassificationId
    ? getCidocClassNameByClassificationId(entityClassificationId)
    : undefined);

  const fill = selected ? colors.fill
    : hovered ? colors.hoverFill
      : 'transparent';

  function handleHover(hovering: boolean, event: MouseEvent) {
    setHoveredLocal(hovering);
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
      points={points}
      fill={fill}
      stroke="none"
      strokeWidth={0}
      style={{
        pointerEvents: 'auto',
        cursor: 'pointer',
        mixBlendMode: 'multiply',
      }}
      tabIndex={isEntityTrigger ? 0 : undefined}
      role={isEntityTrigger ? 'button' : undefined}
      aria-label={isEntityTrigger ? `Preview entity: ${text}` : undefined}
      onClick={() => toggleClicked(id)}
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
}
