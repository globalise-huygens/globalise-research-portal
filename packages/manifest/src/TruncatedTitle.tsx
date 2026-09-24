import type { CSSProperties } from 'react';
import './TruncatedTitle.css';

type Props = {
  text: string;
  tailLength?: number;
};

export function TruncatedTitle({ text, tailLength = 8 }: Props) {
  const [head, tail] = truncateWithTail(text, tailLength);
  const style = { '--tail-length': `${tailLength}ch` } as CSSProperties;
  return (
    <span className="truncated-title" title={text} style={style}>
      <span className="head">{head}</span>
      <span className="tail">{tail}</span>
    </span>
  );
}

function truncateWithTail(text: string, tailLength: number): [string, string] {
  if (text.length <= tailLength * 2) {
    return [text, ''];
  }
  return [text.slice(0, -tailLength), text.slice(-tailLength)];
}
