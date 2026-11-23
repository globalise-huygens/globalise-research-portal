import { MarkedText } from '@globalise/design';
import { findTerms } from './highlightTerms.ts';

type HighlightProps = {
  text?: string;
  terms: string[];
};

export function Highlight({ text = '', terms }: HighlightProps) {
  return <MarkedText text={text} ranges={findTerms(text, terms)}/>;
}
