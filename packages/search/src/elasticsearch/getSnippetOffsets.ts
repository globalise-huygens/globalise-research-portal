import type { Offsets } from '@knaw-huc/faceted-search-react';
import { isHit, parseAnnotatedText } from './parseAnnotatedText';

export function getSnippetOffsets(text: string, annotatedSnippet: string): Offsets | null {
  const { plainText: snippet, segments } = parseAnnotatedText(annotatedSnippet);
  const firstHit = segments.find(isHit);
  const snippetStart = text.indexOf(snippet);
  if (snippetStart === -1 || !firstHit) {
    return null;
  }
  return { start: snippetStart + firstHit.start, end: snippetStart + firstHit.end };
}
