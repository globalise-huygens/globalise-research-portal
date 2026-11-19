import './FacsimileTooltip.css';
export type FacsimileTooltipProps = { text: string; x: number; y: number };

export function FacsimileTooltip({ x, y, text }: FacsimileTooltipProps) {
  return (
    <div className="facsimile-tooltip" style={{ left: x + 10, top: y - 30 }}>
      {text}
    </div>
  );
}
