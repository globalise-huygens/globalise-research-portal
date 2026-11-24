import type { Offsets } from '@knaw-huc/faceted-search-react';

export function getSnippetOffsets(text: string, snippet: string): Offsets | null {
  const start = text.indexOf(snippet);
  if (start === -1) {
    return null;
  }
  return { start, end: start + snippet.length };
}
