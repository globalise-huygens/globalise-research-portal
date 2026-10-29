import { describe, expect, it } from 'vitest';
import getManifestSearchState from './getManifestSearchState';

describe(getManifestSearchState.name, () => {
  it('needs a document id and snippet', () => {
    const withoutSnippet = { manifest: 'm1', documentId: 'd1', q: 'Batavia' };
    expect(getManifestSearchState(withoutSnippet)).toBeUndefined();
  });

  it('keeps only search params as facets, not manifest params', () => {
    const urlParams = { manifest: 'm1', canvas: 'c1', documentId: 'd1', snippet: 's1', ead: ['1.04.02'] };
    const state = getManifestSearchState(urlParams);
    expect(state?.facets).toEqual({ ead: ['1.04.02'] });
    expect(state).toMatchObject({ documentId: 'd1', snippet: 's1' });
  });
});
