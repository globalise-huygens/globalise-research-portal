import { Popover } from '@globalise/design';
import './FacsimileTooltip.css';

export type FacsimileTooltipProps = { text: string; x: number; y: number };

export function FacsimileTooltip({ x, y, text }: FacsimileTooltipProps) {
  return (
    <Popover
      size="compact"
      className="facsimile-tooltip preview-card-surface"
      role="tooltip"
      style={{ left: x + 10, top: y - 30 }}
    >
      <span className="preview-card-title">{text}</span>
    </Popover>
  );
}
