import { splitByTerms } from './highlightTerms.ts';

type HighlightProps = {
  text?: string;
  terms: string[];
};

export function Highlight({ text = '', terms }: HighlightProps) {
  return splitByTerms(text, terms).map((part, i) => i % 2
    ? <mark key={i}>{part}</mark>
    : part);
}
