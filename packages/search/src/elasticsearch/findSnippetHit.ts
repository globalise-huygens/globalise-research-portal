import { POST_TAG, PRE_TAG } from './highlightTags';

export type Hit = {
  start: number;
  end: number;
};

export function findSnippetHit(text: string, snippet: string): Hit | null {
  const snippetStart = text.indexOf(stripTags(snippet));
  const tagStart = snippet.indexOf(PRE_TAG);
  const tagEnd = snippet.indexOf(POST_TAG);
  if (snippetStart === -1 || tagStart === -1 || tagEnd === -1) {
    return null;
  }
  const start = snippetStart + tagStart;
  return { start, end: start + tagEnd - tagStart - PRE_TAG.length };
}

function stripTags(snippet: string): string {
  return snippet.replaceAll(PRE_TAG, '').replaceAll(POST_TAG, '');
}
