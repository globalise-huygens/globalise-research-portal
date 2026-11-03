import escapeRegExp from 'lodash/escapeRegExp';
import { truncate } from '@globalise/common';

const snippetLead = 40;
const snippetLength = 160;

export function splitByTerms(text: string, terms: string[]): string[] {
  return terms.length
    ? text.split(createTermPattern(terms))
    : [text];
}

export function createSnippet(text: string, terms: string[]): string {
  const match = terms.length
    ? text.search(createTermPattern(terms))
    : -1;
  if (match < 0) {
    return '';
  }
  const start = Math.max(0, match - snippetLead);
  return truncate(text, start, start + snippetLength);
}

function createTermPattern(terms: string[]): RegExp {
  const alternatives = terms.map(escapeRegExp).join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}])(${alternatives})(?![\\p{L}\\p{N}])`, 'iu');
}
