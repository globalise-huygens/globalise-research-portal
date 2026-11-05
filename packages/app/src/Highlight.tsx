import { splitByTerms } from './highlightTerms.ts';

type HighlightProps = {
  text?: string;
  terms: string[];
};

export function Highlight({ text = '', terms }: HighlightProps) {
  return splitByTerms(text, terms).map((part, index) => part.isMatch
    ? <mark key={index}>{part.text}</mark>
    : part.text,
  );
}
