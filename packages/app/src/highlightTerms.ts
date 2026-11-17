import minBy from 'lodash/minBy';
import { truncate } from '@globalise/common';

const snippetLead = 40;
const snippetLength = 160;

export type TextPart = {
  text: string;
  isMatch: boolean;
};

type TermMatch = {
  start: number;
  end: number;
};

export function splitByTerms(text: string, terms: string[]): TextPart[] {
  const parts: TextPart[] = [];
  let rest = text;
  let match = findFirstTerm(rest, terms);
  while (match) {
    parts.push({ text: rest.slice(0, match.start), isMatch: false });
    parts.push({ text: rest.slice(match.start, match.end), isMatch: true });
    rest = rest.slice(match.end);
    match = findFirstTerm(rest, terms);
  }
  parts.push({ text: rest, isMatch: false });
  return parts.filter((part) => part.text);
}

export function createSnippet(text: string, terms: string[]): string {
  const match = findFirstTerm(text, terms);
  if (!match) {
    return '';
  }
  const start = Math.max(0, match.start - snippetLead);
  return truncate(text, start, start + snippetLength);
}

function findFirstTerm(text: string, terms: string[]): TermMatch | undefined {
  const lowerText = text.toLowerCase();
  const matches = terms.map((term) => {
    const start = lowerText.indexOf(term);
    return { start, end: start + term.length };
  });
  const found = matches.filter((match) => match.start >= 0);
  return minBy(found, 'start');
}
