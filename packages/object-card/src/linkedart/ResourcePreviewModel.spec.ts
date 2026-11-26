import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { handle, idBase } from '@globalise/common/uri';
import type { LinkedArtNode } from '@globalise/common';
import { getResourcePreview } from './ResourcePreviewModel.ts';
import {
  getOccurrenceTitle,
  OccurrenceCardBody,
  OccurrenceOverview,
} from './occurrence/OccurrenceCardBody.tsx';

vi.mock('./place/PlaceRecord.tsx', () => ({
  PlaceRecord: ({ title }: { title: string }) =>
    createElement('div', null, `${title} record`),
}));
vi.mock('./place/PlaceValues.tsx', () => ({
  PlaceValues: () => createElement('span', null, 'linked value'),
}));

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

    const preview = getResourcePreview(person, `${idBase}/person:Person_1`);

    expect(preview.type).toBe('person');
    expect(preview.openFullCardHref).toBe(`/${handle}/person:Person_1`);
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

describe('occurrence card', () => {
  it('groups records and sources without an identifier or references panel', () => {
    const entity: LinkedArtNode = {
      type: 'Event',
      involved: [{ type: 'HumanMadeObject', id: 'https://example.org/object' }],
      identified_by: [{ type: 'Identifier', content: 'CO_0001' }],
      is_appellative_subject_of: [{ type: 'AppellativeStatus' }],
      referred_to_by: [{ type: 'LinguisticObject', content: 'A source' }],
    };

    const html = renderToStaticMarkup(
      createElement(OccurrenceCardBody, { entity }),
    );

    expect(html).toContain('Occurrence details');
    expect(html).toContain('Involved');
    expect(html).toContain('Name record');
    expect(html).toContain('Further information');
    expect(html).toContain('Sources');
    expect(html).toContain('A source');
    expect(html).not.toContain('CO_0001');
    expect(html).not.toContain('Identifier');
    expect(html).not.toContain('data-side="right"');
  });

  it('does not show an empty details section for an identifier alone', () => {
    const entity: LinkedArtNode = {
      type: 'Event',
      identified_by: [{ type: 'Identifier', content: 'CO_0001' }],
    };

    const html = renderToStaticMarkup(
      createElement(OccurrenceCardBody, { entity }),
    );
    expect(html).not.toContain('Occurrence details');
  });

  it('shows distinct alternative names in the overview', () => {
    const name = {
      type: 'AppellativeStatus',
      ascribes_appellation: [{ type: 'Name', content: 'Other name' }],
    };
    const entity: LinkedArtNode = {
      type: 'Event',
      identified_by: [{ type: 'Name', content: 'Event title' }],
      is_appellative_subject_of: [name, name],
    };

    const html = renderToStaticMarkup(
      createElement(OccurrenceOverview, { entity }),
    );
    expect(html).toContain('also: Other name');
  });

  it('does not use an embedded label as a title', () => {
    const entity: LinkedArtNode = {
      type: 'Event',
      _label: 'Unresolved label',
    };
    expect(getOccurrenceTitle(entity)).toBe('Name not recorded');
  });

  it('keeps additional recorded dates alongside a nested timespan', () => {
    const entity: LinkedArtNode = {
      type: 'Event',
      timespan: {
        type: 'TimeSpan',
        begin_of_the_begin: '1764-10-20',
        end_of_the_end: '1764-10-20',
      },
      'crm:P4_has_time-span': ['1765-01-01', '1766-01-01'],
    };

    const html = renderToStaticMarkup(
      createElement(OccurrenceCardBody, { entity }),
    );
    expect(html).toContain('1764-10-20');
    expect(html).toContain('1765-01-01');
    expect(html).toContain('1766-01-01');
  });

  it('keeps ambiguous nested dates when a direct date supplies a timespan', () => {
    const entity: LinkedArtNode = {
      type: 'Event',
      timespan: {
        type: 'TimeSpan',
        begin_of_the_begin: ['1764-01-01', '1765-01-01'],
      },
      'crm:P4_has_time-span': ['1766-01-01'],
    };

    const html = renderToStaticMarkup(
      createElement(OccurrenceCardBody, { entity }),
    );
    expect(html).toContain('1764-01-01');
    expect(html).toContain('1765-01-01');
    expect(html).toContain('1766-01-01');
  });
});
