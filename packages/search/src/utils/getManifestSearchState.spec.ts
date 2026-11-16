import { describe, expect, it } from 'vitest';
import getManifestSearchState from './getManifestSearchState';

const document = { inventory: '1053', page: '0003', endPage: '0071' };
const searchHit = { document, docEsId: 'd1', snippet: 's1' };

describe(getManifestSearchState.name, () => {
  it('needs a search hit', () => {
    const searchContext = { query: 'Batavia', facets: {} };
    expect(getManifestSearchState(null, searchContext)).toBeUndefined();
  });

  it('highlights the search hit within its document', () => {
    const state = getManifestSearchState(searchHit, null);
    const docDbId = 'NL-HaNA_1.04.02_1053_0003-0071';
    expect(state).toMatchObject({ docDbId, docEsId: 'd1', snippet: 's1' });
  });

  it('keeps only known facets of the search context', () => {
    const facets = { ead: ['1.04.02'], foo: ['bar'] };
    const state = getManifestSearchState(searchHit, { facets });
    expect(state?.facets).toEqual({ ead: ['1.04.02'] });
  });
});
