import './FacsimileTooltip.css';
export type FacsimileTooltipProps = { text: string; x: number; y: number };

export function FacsimileTooltip({ x, y, text }: FacsimileTooltipProps) {
  const viewportWidth = typeof window === 'undefined'
    ? x + 256
    : window.innerWidth;
  const left = Math.max(8, Math.min(x + 12, viewportWidth - 248));
  const placeBelowPointer = y < 64;

  return (
    <div
      className="facsimile-tooltip"
      role="tooltip"
      style={{
        left,
        top: placeBelowPointer ? y + 12 : y - 12,
        transform: placeBelowPointer ? undefined : 'translateY(-100%)',
      }}
    >
      {text}
    </div>
  );
}
