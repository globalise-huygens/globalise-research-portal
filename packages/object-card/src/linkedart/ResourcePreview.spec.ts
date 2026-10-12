import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { getResourcePreview } from './ResourcePreviewModel.ts';
import { resolveRelationResource, resolveRelationValue } from './RelationValueResolver.ts';

vi.mock('../../../common/src/util/getSVGElement.ts', () => ({ getSVGElement: vi.fn() }));

const base = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';
afterEach(() => vi.unstubAllGlobals());

describe('resolved resource previews', () => {
  it('previews label-only concepts and hides technical person identifiers', () => {
    expect(getResourcePreview({ type: 'Concept', prefLabel: 'Seaman' }, `${base}thesaurus:label-only`)).toMatchObject({ type: 'concept', title: 'Seaman', properties: [], openFullCardHref: expect.stringContaining('/object-card?') });
    expect(getResourcePreview({ type: 'Person', _label: 'Person Identified by Person_1',
      identified_by: [{ type: 'Identifier', content: 'Person_1' }],
    }, `${base}person:Person_1`)).toMatchObject({ title: 'Name not recorded', properties: [] });
  });

  it('uses resolved preferred labels and definitions with distinct alternative names', () => {
    const concept: LinkedArtNode = { type: 'Concept',
      prefLabel: [{ '@language': 'nl', '@value': 'jong bootsgezel' }, { '@language': 'en', '@value': 'junior seaman' }],
      _label: 'An embedded label',
      definition: [{ '@language': 'nl', '@value': 'Dutch definition' }, { '@language': 'en', '@value': 'English definition' }],
      altLabel: ['junior ordinary seaman', ' junior ordinary seaman ', 'junior seaman'],
    };
    expect(getResourcePreview(concept, `${base}thesaurus:seaman`)).toMatchObject({
      type: 'concept', title: 'junior seaman', properties: [
        { label: 'Definition', value: 'English definition' },
        { label: 'Alt label', value: 'junior ordinary seaman' },
      ],
    });
  });

  it('retains person name variants and uncertain event dates without exposing status labels', () => {
    const person: LinkedArtNode = { type: 'Person', is_appellative_subject_of: [
      { type: 'AppellativeStatus', ascribes_appellation: [{ type: 'Name', content: 'Recorded name' }] },
      { type: 'AppellativeStatus', ascribes_appellation: [{ type: 'Name', content: 'Other name' }] },
    ], born: { type: 'Birth', timespan: { type: 'TimeSpan',
      begin_of_the_begin: '1700-04-01T00:00:00', end_of_the_end: '1700-09-30T23:59:59',
      _label: 'Generated event description',
    } } };
    expect(getResourcePreview(person, `${base}person:preview-person`)).toMatchObject({
      type: 'person', title: 'Recorded name', properties: [
        { label: 'Also called', value: 'Other name' },
        { label: 'Born', value: 'between 1700-04-01 and 1700-09-30' },
      ],
    });
  });

  it('does not turn conflicting event dates into a paired interval', () => {
    expect(getResourcePreview({ type: 'Person', content: 'Recorded name',
      born: { type: 'Birth', 'crm:P4_has_time-span': ['1700-01-01', '1705-01-01'] },
    }, `${base}person:conflicting-preview`)).toMatchObject({ properties: [] });
  });

  it('shares the existing label request with the preview resource', async () => {
    const resource = { type: 'Concept', prefLabel: 'Seaman', definition: 'A maritime occupation.' };
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(resource)));
    vi.stubGlobal('fetch', fetch);
    const uri = `${base}thesaurus:shared-preview-request`;
    const [label, resolved] = await Promise.all([resolveRelationValue(uri), resolveRelationResource(uri)]);
    expect(label).toBe('Seaman');
    expect(resolved).toEqual(resource);
    expect(await resolveRelationResource(uri)).toEqual(resource);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
