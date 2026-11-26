import { describe, expect, it } from 'vitest';
import { idBase } from './uriPatterns.ts';
import {
  createDocumentId,
  createDocumentName,
  parseDocumentId,
  parseDocumentName,
} from './documentId';

const documentName = 'NL-HaNA_1.04.02_1053_0003-0067';
const document = `${idBase}/document:${documentName}`;
const manifest = `${idBase}/inventory:1053.manifest`;
const manifestRange = `${manifest}/range/${documentName}`;

describe(parseDocumentId.name, () => {
  it('reads the inventory and page range of a document', () => {
    const range = { inventory: '1053', page: '0003', endPage: '0067' };
    expect(parseDocumentId(document)).toEqual(range);
  });

  it('ignores the manifest range of a document', () => {
    expect(parseDocumentId(manifestRange)).toBeUndefined();
  });
});

describe(parseDocumentName.name, () => {
  it('reads the inventory and page range of a document name', () => {
    const range = { inventory: '1053', page: '0003', endPage: '0067' };
    expect(parseDocumentName(documentName)).toEqual(range);
  });
});

describe(createDocumentId.name, () => {
  it('builds the document id of a page range', () => {
    const range = { inventory: '1053', page: '0003', endPage: '0067' };
    expect(createDocumentId(range)).toBe(document);
  });
});

describe(createDocumentName.name, () => {
  it('builds the document name of a page range', () => {
    const range = { inventory: '1053', page: '0003', endPage: '0067' };
    expect(createDocumentName(range)).toBe(documentName);
  });
});
