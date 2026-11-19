import { getHighlight, type Offsets } from '@knaw-huc/faceted-search-react';
import { POST_TAG, PRE_TAG } from './highlightTags';

export function getSnippetOffsets(text: string, snippet: string): Offsets | null {
  const { text: untaggedSnippet, spans: [firstHit] } = getHighlight(snippet, PRE_TAG, POST_TAG);
  const snippetStart = text.indexOf(untaggedSnippet);
  if (snippetStart === -1 || !firstHit) {
    return null;
  }
  return { start: snippetStart + firstHit.start, end: snippetStart + firstHit.end };
}
