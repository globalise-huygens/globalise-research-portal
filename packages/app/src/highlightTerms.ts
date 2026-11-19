import minBy from 'lodash/minBy';
import { truncate } from '@globalise/common';
import type { TextPosition } from '@globalise/design';

const snippetLead = 40;
const snippetLength = 160;

export function findTerms(text: string, terms: string[]): TextPosition[] {
  const ranges: TextPosition[] = [];
  let offset = 0;
  let match = findFirstTerm(text, terms, offset);
  while (match) {
    ranges.push(match);
    offset = match.end;
    match = findFirstTerm(text, terms, offset);
  }
  return ranges;
}

export function createSnippet(text: string, terms: string[]): string {
  const match = findFirstTerm(text, terms);
  if (!match) {
    return '';
  }
  const start = Math.max(0, match.start - snippetLead);
  return truncate(text, start, start + snippetLength);
}

function findFirstTerm(text: string, terms: string[], offset = 0): TextPosition | undefined {
  const lowerText = text.toLowerCase();
  const matches = terms.map((term) => {
    const start = lowerText.indexOf(term, offset);
    return { start, end: start + term.length };
  });
  const found = matches.filter((match) => match.start >= 0);
  return minBy(found, 'start');
}
