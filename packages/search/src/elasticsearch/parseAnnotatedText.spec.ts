import { describe, expect, it } from 'vitest';
import { parseAnnotatedText } from './parseAnnotatedText';
import highlightedDocument from './parseAnnotatedText.bench.txt?raw';

/**
 * Not testing overlapping annotations as that cannot happen in 'annotated-text',
 * which will favor hits over annotations:
 * https://www.elastic.co/docs/reference/elasticsearch/plugins/mapper-annotated-text-highlighter
 */
describe(parseAnnotatedText.name, () => {
  it('parses a hit', () => {
    const result = parseAnnotatedText('a [b](_hit_term=b) c');
    expect(result).toEqual({
      plainText: 'a b c',
      segments: [{ start: 2, end: 3, value: 'b', annotations: ['_hit_term=b'] }],
    });
  });

  it('parses a hit containing an annotation', () => {
    const annotatedByEs = 'a [b](_hit_term=b&Place) c';
    const result = parseAnnotatedText(annotatedByEs);
    expect(result.segments).toEqual([
      { start: 2, end: 3, value: 'b', annotations: ['_hit_term=b', 'Place'] },
    ]);
  });

  it('parses a hit next to an annotation', () => {
    const result = parseAnnotatedText('a [b](_hit_term=b) [c](Person)');
    expect(result.segments).toEqual([
      { start: 2, end: 3, value: 'b', annotations: ['_hit_term=b'] },
      { start: 4, end: 5, value: 'c', annotations: ['Person'] },
    ]);
  });

  it('parses two hits', () => {
    const result = parseAnnotatedText('a [b](_hit_term=b) [c](_hit_term=c)');
    expect(result.segments).toEqual([
      { start: 2, end: 3, value: 'b', annotations: ['_hit_term=b'] },
      { start: 4, end: 5, value: 'c', annotations: ['_hit_term=c'] },
    ]);
  });

  it('benches with a document containing 10 hits (_hit_term=wannij) and 529 annotations', () => {
    const result = parseAnnotatedText(highlightedDocument);
    expect(result.segments.length).toBe(531);
    const searchHit = '_hit_term=wannij';
    const hits = result.segments.filter((s) => s.annotations.includes(searchHit));
    expect(hits.length).toBe(10);
    const annotations = result.segments.filter((s) => s.annotations.find((a) => a !== searchHit));
    expect(annotations.length).toBe(529);
  });
});
