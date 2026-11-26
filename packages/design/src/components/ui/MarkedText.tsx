import { segment, type TextPosition } from '@knaw-huc/text-annotation-segmenter';

export type MarkedTextProps = {
  text: string;
  ranges: TextPosition[];
};

export function MarkedText({ text, ranges }: MarkedTextProps) {
  const segments = segment(text, ranges, (range) => range);
  return segments.map((part) => part.annotations.length
    ? <mark key={part.index}>{part.value}</mark>
    : part.value,
  );
}
