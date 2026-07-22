export type HighlightStyle = {
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  haloStroke?: string;
  haloStrokeWidth?: number;
  cursor?: string;
  vectorEffect?: 'none' | 'non-scaling-stroke';
  omitLeftStroke?: boolean;
  omitRightStroke?: boolean;
};
