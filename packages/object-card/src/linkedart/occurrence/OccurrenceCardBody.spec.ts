import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { OccurrenceCardBody, OccurrenceOverview } from './OccurrenceCardBody.tsx';

vi.mock('../EntityReferencePanel.tsx', () => ({
  EntityReferencePanel: () => createElement('div', { 'data-side': 'right' }, 'References'),
}));
vi.mock('../place/PlaceRecord.tsx', () => ({
  PlaceRecord: ({ title }: { title: string }) => createElement('div', null, `${title} record`),
}));
vi.mock('../place/PlaceValues.tsx', () => ({
  PlaceValues: () => createElement('span', null, 'linked value'),
}));

describe('occurrence card', () => {
  it('keeps the references panel and groups records and sources like the other cards', () => {
    const entity: LinkedArtNode = {
      type: 'Activity',
      involved: [{ type: 'HumanMadeObject', id: 'https://example.org/object' }],
      identified_by: [{ type: 'Identifier', content: 'CO_0001' }],
      is_appellative_subject_of: [{ type: 'AppellativeStatus' }],
      referred_to_by: [{ type: 'LinguisticObject', content: 'A source' }],
    };

    const html = renderToStaticMarkup(createElement(OccurrenceCardBody, { entity }));

    expect(html).toContain('Occurrence details');
    expect(html).toContain('Involved');
    expect(html).toContain('Name record');
    expect(html).toContain('Further information');
    expect(html).toContain('Sources');
    expect(html).toContain('A source');
    expect(html).toContain('data-side="right"');
    expect(html).not.toContain('Recorded information');
    expect(html).not.toContain('CO_0001');
    expect(html).not.toContain('Identifier');
  });

  it('does not show an empty details section for an identifier alone', () => {
    const entity: LinkedArtNode = {
      type: 'Activity',
      identified_by: [{ type: 'Identifier', content: 'CO_0001' }],
    };

    expect(renderToStaticMarkup(createElement(OccurrenceCardBody, { entity })))
      .not.toContain('Occurrence details');
  });

  it('shows distinct alternative names in the overview', () => {
    const entity: LinkedArtNode = {
      type: 'Activity',
      identified_by: [{ type: 'Name', content: 'Event title' }],
      is_appellative_subject_of: [
        { type: 'AppellativeStatus', ascribes_appellation: [{ type: 'Name', content: 'Other name' }] },
        { type: 'AppellativeStatus', ascribes_appellation: [{ type: 'Name', content: 'Other name' }] },
      ],
    };

    expect(renderToStaticMarkup(createElement(OccurrenceOverview, { entity })))
      .toContain('also: Other name');
  });
});
