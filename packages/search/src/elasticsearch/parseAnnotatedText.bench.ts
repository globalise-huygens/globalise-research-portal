import { bench, describe } from 'vitest';
import { parseAnnotatedText } from './parseAnnotatedText';
import highlightedDocument from './parseAnnotatedText.bench.txt?raw';

const largestDocument = highlightedDocument.repeat(40);

describe(parseAnnotatedText.name, () => {

  bench('parsing a document with "wannij" hits (~37k chars)', () => {
    parseAnnotatedText(highlightedDocument);
  });

  bench('parsing same document repeated to largest document size (~1.5M chars)', () => {
    parseAnnotatedText(largestDocument);
  });
});
