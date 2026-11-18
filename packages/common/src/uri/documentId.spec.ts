import { describe, expect, it } from 'vitest';
import {
  createDocumentId,
  parseDocumentId,
  parseDocumentName,
} from './documentId';

// future: https://id.globalise.nl/hdl:20.500.14722
const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

const documentName = 'NL-HaNA_1.04.02_1053_0003-0067';
const document = `${handle}/document:${documentName}`;
const manifest = `${handle}/inventory:1053.manifest`;
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
