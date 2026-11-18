import { parseAnnotatedText } from './parseAnnotatedText';
import { POST_TAG, PRE_TAG } from './highlightTags';

const hitAnnotation = '_hit_term=';

/**
 * Converts the output of the annotated-text highlighter into plain text with hits between PRE_TAG and POST_TAG.
 * The annotated highlighter ignores pre_tags and post_tags, and marks hits as `[value](_hit_term=value)` instead.
 */
export function tagAnnotatedHits(annotatedText: string): string {
  const { plainText, segments } = parseAnnotatedText(annotatedText);
  const parts: string[] = [];
  let offset = 0;

  for (const { start, end, annotations } of segments) {
    if (annotations.some((annotation) => annotation.startsWith(hitAnnotation))) {
      parts.push(plainText.slice(offset, start), PRE_TAG, plainText.slice(start, end), POST_TAG);
      offset = end;
    }
  }
  parts.push(plainText.slice(offset));

  return parts.join('');
}
