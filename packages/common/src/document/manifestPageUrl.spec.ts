import { describe, expect, it } from 'vitest';
import { toManifestHref } from './manifestPageUrl';

describe(toManifestHref.name, () => {
  it('links to manifest with document and snippet, keeping the search params', () => {
    const href = toManifestHref({
      inventoryNumber: '1053',
      document: 'NL-HaNA_1.04.02_1053_0013-0019',
      documentId: 'doc-1',
      snippet: 'schip van Batavia',
      search: '?q=Batavia',
    });
    const params = new URLSearchParams(href.split('?')[1]);
    expect(Object.fromEntries(params)).toEqual({
      q: 'Batavia',
      manifest: 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/inventory:1053.manifest',
      document: 'NL-HaNA_1.04.02_1053_0013-0019',
      documentId: 'doc-1',
      snippet: 'schip van Batavia',
    });
  });
});
