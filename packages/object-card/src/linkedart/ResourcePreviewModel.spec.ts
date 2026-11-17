import { describe, expect, it } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { getResourcePreview } from './ResourcePreviewModel.ts';

const internalBase = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

describe('getResourcePreview', () => {
  it('previews a person with names and a birth date, linking to the object card', () => {
    const person = {
      type: 'Person',
      _label: 'Jan Jansz',
      identified_by: [
        { type: 'Name', content: 'Jan Jansz' },
        { type: 'Name', content: 'Johannes Janssen' },
      ],
      born: { type: 'Birth', timespan: { type: 'TimeSpan', begin_of_the_begin: '1650-03-01', end_of_the_end: '1650-03-01' } },
    } as unknown as LinkedArtNode;

    const preview = getResourcePreview(person, `${internalBase}/person:Person_1`);

    expect(preview.type).toBe('person');
    expect(preview.openFullCardHref).toContain('/object-card');
    expect(preview.properties).toEqual([
      { label: 'Also called', value: 'Johannes Janssen' },
      { label: 'Born', value: '1650-03-01' },
    ]);
  });

  it('previews a concept with relations, linking to the external URI', () => {
    const concept = {
      type: 'Concept',
      altLabel: ['Peper'],
      definition: 'A spice.',
      broader: [{ type: 'Concept', id: 'spice' }],
    } as unknown as LinkedArtNode;
    const uri = 'https://example.org/concept/pepper';

    const preview = getResourcePreview(concept, uri, (nodes) => `${nodes.length} relation(s)`);

    expect(preview.openFullCardHref).toBe(uri);
    expect(preview.properties).toEqual([
      { label: 'Definition', value: 'A spice.' },
      { label: 'Alt label', value: 'Peper' },
      { label: 'Broader', value: '1 relation(s)' },
    ]);
  });
});
