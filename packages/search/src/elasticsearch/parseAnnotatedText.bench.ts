import { describe, test } from 'vitest';
import { parseAnnotatedText } from './parseAnnotatedText';
import highlightedDocument from './parseAnnotatedText.bench.txt?raw';

const largestDocument = highlightedDocument.repeat(40);

describe(parseAnnotatedText.name, () => {

  test('parsing a document with "wannij" hits (~37k chars)', async ({ bench }) => {
    await bench('parse', () => {
      parseAnnotatedText(highlightedDocument);
    }).run();
  });

  test('parsing same document repeated to largest document size (~1.5M chars)', async ({ bench }) => {
    await bench('parse', () => {
      parseAnnotatedText(largestDocument);
    }).run();
  });
});
