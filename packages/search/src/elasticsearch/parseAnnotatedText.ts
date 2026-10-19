export type AnnotatedText = {
  plainText: string;
  segments: AnnotatedSegment[];
};

export type AnnotatedSegment = {
  start: number;
  end: number;
  value: string;
  annotations: string[];
};

const annotatedSegment = /\[([^\][]*)\]\(([^)(]*)\)/g;

/**
 * Finding annotations and their offsets in a text formatted by the annotated-text highlighter plugin:
 * https://www.elastic.co/docs/reference/elasticsearch/plugins/mapper-annotated-text-highlighter
 */
export function parseAnnotatedText(annotatedText: string): AnnotatedText {
  const plainParts: string[] = [];
  const segments: AnnotatedSegment[] = [];
  let annotatedOffset = 0;
  let plainOffset = 0;

  for (const match of annotatedText.matchAll(annotatedSegment)) {
    const [markup, value, annotations] = match;
    const textBefore = annotatedText.slice(annotatedOffset, match.index);
    const start = plainOffset + textBefore.length;
    const end = start + value.length;
    plainParts.push(textBefore, value);
    segments.push({ start, end, value, annotations: annotations.split('&').map(decodeAnnotation) });
    plainOffset = end;
    annotatedOffset = match.index + markup.length;
  }
  plainParts.push(annotatedText.slice(annotatedOffset));

  return { plainText: plainParts.join(''), segments };
}

function decodeAnnotation(annotation: string): string {
  return decodeURIComponent(annotation.replaceAll('+', ' '));
}
