import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { PersonCardBody, PersonOverview, getPersonTitle } from './PersonCardBody.tsx';
import {
  getPersonTimespan,
  getRecordedDates,
  getStatusValues,
  groupPersonClaims,
} from './PersonClaimModel.ts';
import { getRelationValue } from './RelationValueModel.ts';
import { resolveRelationValue } from './RelationValueResolver.ts';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { formatDateRange, formatTimespan, formatTimespanBoundaries } from './TimespanFormat.ts';
import { SourceList } from './SourceList.tsx';

// The shared barrel initializes a browser-only SVG parser; these tests render HTML.
vi.mock('../../../common/src/util/getSVGElement.ts', () => ({ getSVGElement: vi.fn() }));

const base = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';
const occupation = { id: `${base}thesaurus:gunner`, type: 'Type', prefLabel: 'ship gunner', _label: 'ship gunner' };

function claim(date: string, source: string): LinkedArtNode {
  return {
    type: 'SocialStatus',
    ascribes_social_status: [occupation],
    timespan: {
      type: 'TimeSpan',
      begin_of_the_begin: `${date}T00:00:00`,
      end_of_the_begin: `${date}T23:59:59`,
    },
    referred_to_by: [{ type: 'LinguisticObject', content: source }],
  };
}

describe('person claim evidence', () => {
  it('does not show an empty Personal details section for a person with only occupation data', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', born: [{ type: 'Birth' }], died: [{ type: 'Death' }],
        is_social_status_subject_of: [claim('1737-01-01', 'Source')],
      },
    }));
    expect(body).toContain('Occupations and statuses');
    expect(body).not.toContain('Personal details');
  });

  it('retains detached relationship evidence even when it is not a FamilyStatus claim', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_familial_subject_of: [{
        type: 'LinguisticObject', content: 'Detached relationship evidence',
      }] },
    }));
    expect(body).toContain('Relationships');
    expect(body).toContain('Detached relationship evidence');
    expect(body).not.toContain('Family relationships');
  });
  it('does not derive an origin heading from an embedded label while the linked connection is unresolved', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_residence_subject_of: [{ type: 'ResidentialStatus',
        ascribes_residence_relation: [{ type: 'Type', id: `${base}thesaurus:unresolved-origin`, _label: 'place_of_origin' }],
        ascribes_residence_place: [{ type: 'Place', _label: 'Stockholm' }],
      }] },
    }));
    expect(body).not.toContain('Origin:');
    expect(body).not.toContain('place_of_origin');
    expect(body).toContain('Connection:');
    expect(body).toContain('Stockholm');
  });

  it('uses real destinations for related entities so native link operations remain available', () => {
    const uri = `${base}person:Person_10051`;
    const body = renderToStaticMarkup(createElement(RelationLink, {
      node: { type: 'Person', id: uri, prefLabel: 'Elizabeth Helena Forster' },
    }));
    expect(body).toContain('<a ');
    expect(body).toContain(`href="/object-card?${new URLSearchParams({ uri })}"`);
    expect(body).toContain('Elizabeth Helena Forster');
  });
  it('does not infer occupations from record labels or merge records with missing occupations', () => {
    const dated = (name: string) => ({ type: 'SocialStatus',
      _label: `Social Status ${name} of Person identified by Person_1`,
      ascribes_social_status: [], timespan: { type: 'TimeSpan', begin_of_the_begin: '1722-01-01T00:00:00' },
    });
    const records = [dated('Directeur'), dated('Gouverneur'), {
      type: 'SocialStatus', ascribes_social_status: [{ type: 'Type', prefLabel: 'director' }],
    }];
    expect(groupPersonClaims(records)).toHaveLength(3);
    const html = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_social_status_subject_of: records },
    }));
    expect(html).not.toContain('Directeur');
    expect(html).not.toContain('Gouverneur');
    expect(html.match(/Occupation or status not recorded/g)).toHaveLength(2);
    expect(html.match(/Earliest start: 1722-01-01/g)).toHaveLength(2);
    expect(html).toContain('director');
    expect(html.match(/Occupations and statuses/g)).toHaveLength(1);
  });

  it('keeps citations from a source-only residence record without displaying an empty Places entry', () => {
    const source = { type: 'LinguisticObject', content: 'Residence source citation' };
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', referred_to_by: [source], is_residence_subject_of: [{
        type: 'ResidentialStatus', ascribes_residence_place: [], ascribes_residence_relation: [],
        referred_to_by: [source],
      }] },
    }));
    expect(body).not.toContain('>Places<');
    expect(body.match(/Residence source citation/g)).toHaveLength(1);
    expect(body).toContain('>Sources<');
  });

  it('keeps an origin connection visible even if its place is missing', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_residence_subject_of: [{
        type: 'ResidentialStatus', ascribes_residence_place: [],
        ascribes_residence_relation: [{ type: 'Type', _label: 'place_of_origin' }],
      }] },
    }));
    expect(body).toContain('Connection:');
    expect(body).toContain('place_of_origin');
    expect(body.match(/>Places</g)).toHaveLength(1);
  });
  it('uses a readable title when the person only has an internal identifier', () => {
    const entity: LinkedArtNode = {
      type: 'Person', id: `${base}person:Person_2500`,
      _label: 'Person Identified by Person_2500',
      identified_by: [{ type: 'Identifier', content: 'Person_2500' }],
    };
    expect(getPersonTitle(entity)).toBe('Name not recorded');
    expect(getRelationValue(entity)).toBe('Person');
    expect(getPersonTitle({ ...entity, identified_by: [{ type: 'Name', content: 'Recorded name' }] }))
      .toBe('Recorded name');
  });

  it('uses the same recorded name in the card title and resolved person links', () => {
    const entity: LinkedArtNode = { type: 'Person', is_appellative_subject_of: [
      { type: 'AppellativeStatus', ascribes_appellation: [{ type: 'Name', content: 'Karel Halstroom' }],
        classified_as: [{ type: 'Type', id: `${base}thesaurus:238ca80d-45f8-474b-a541-a28494ca576b` }] },
      { type: 'AppellativeStatus', ascribes_appellation: [{ type: 'Name', content: 'Carel Aalstroom' }],
        classified_as: [{ type: 'Type', id: `${base}thesaurus:31baab68-ad9e-4eb4-baba-0c4b163fc00c` }] },
    ] };
    expect(getPersonTitle(entity)).toBe('Carel Aalstroom');
    expect(getRelationValue(entity)).toBe('Carel Aalstroom');
  });

  it('keeps a corpus mentions link visible while its annotation collection loads', () => {
    const uri = `${base}person:Person_15.annotations`;
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', subject_of: [{
        id: uri, type: ['DigitalObject', 'AnnotationCollection'],
      }] },
    }));
    expect(body).toContain('Corpus mentions');
    expect(body).toContain(`href="${uri}.json"`);
    expect(body).not.toContain('not available yet');
  });

  it('preserves detached sources and a connection term without inventing a residence claim', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_residence_subject_of: [
        { type: 'LinguisticObject', identified_by: [{ type: 'Identifier', content: '395463' }],
          part_of: [{ type: 'LinguisticObject', _label: 'https://www.zotero.org/groups/4678659/items/3Y86C5R6' }] },
        { type: 'Type', _label: 'place_of_origin' },
      ] },
    }));
    expect(body).toContain('Other recorded information');
    expect(body).toContain('395463');
    expect(body).toContain('Recorded terms');
    expect(body).not.toContain('Origin:');
    expect(body).not.toContain('Birthplace:');
  });
  it('groups equivalent roles while keeping their dates and sources on separate records', () => {
    const records = [claim('1751-10-23', 'Source A'), claim('1754-10-02', 'Source B')];
    const groups = groupPersonClaims(records);
    expect(groups).toHaveLength(1);
    expect(groups[0].records).toEqual(records);

    const entity: LinkedArtNode = { type: 'Person', is_social_status_subject_of: records };
    const body = renderToStaticMarkup(createElement(PersonCardBody, { entity }));
    expect(body.match(/>ship gunner</g)).toHaveLength(1);
    expect(body).toContain('2 records');
    const headerFirstRecord = body.indexOf('>Record 1<');
    const headerSecondRecord = body.indexOf('>Record 2<');
    expect(body.slice(headerFirstRecord, headerSecondRecord)).toContain('1751-10-23');
    expect(body.slice(headerSecondRecord, body.indexOf('person-status-content'))).toContain('1754-10-02');
    const firstRecord = body.lastIndexOf('>Record 1<');
    const secondRecord = body.lastIndexOf('>Record 2<');
    expect(body.slice(firstRecord, secondRecord)).toContain('Source A');
    expect(body.slice(firstRecord, secondRecord)).not.toContain('Source B');
    expect(body.slice(secondRecord)).toContain('Source B');

    const overview = renderToStaticMarkup(createElement(PersonOverview, { entity }));
    expect(overview.match(/ship gunner/g)).toHaveLength(1);
  });

  it('keeps different geographic scopes and relationship targets in separate groups', () => {
    const role = claim('1737-01-01', 'Source');
    expect(groupPersonClaims([
      { ...role, has_geographic_scope: [{ type: 'Place', id: `${base}place:ternate` }] },
      { ...role, has_geographic_scope: [{ type: 'Place', id: `${base}place:bengal` }] },
    ])).toHaveLength(2);
    expect(groupPersonClaims([
      { ...role, ascribes_social_status_in_relation_to: [{ type: 'Group', id: `${base}group:a` }] },
      { ...role, ascribes_social_status_in_relation_to: [{ type: 'Group', id: `${base}group:b` }] },
    ])).toHaveLength(2);
  });

  it('groups identical names while retaining classifications and sources for every record', () => {
    const entity: LinkedArtNode = {
      type: 'Person',
      is_appellative_subject_of: ['Source A', 'Source B'].map((source, index) => ({
        type: 'AppellativeStatus',
        ascribes_appellation: [{ type: 'Name', content: 'Carel Aalstroom' }],
        classified_as: [{ type: 'Type', _label: index ? 'Variant name' : 'Recorded name' }],
        referred_to_by: [{ type: 'LinguisticObject', content: source }],
      })),
    };
    const body = renderToStaticMarkup(createElement(PersonCardBody, { entity }));
    expect(body.match(/>Carel Aalstroom</g)).toHaveLength(1);
    expect(body).toContain('Recorded name');
    expect(body).toContain('Variant name');
    expect(body).toContain('Source A');
    expect(body).toContain('Source B');
  });

  it('does not render a disclosure button for a name without details', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: {
        type: 'Person',
        is_appellative_subject_of: [{
          type: 'AppellativeStatus', ascribes_appellation: 'Pieter Vuyst',
          identified_by: [{ type: 'Identifier', content: 'vocop_obs_1336719' }],
        }],
      },
    }));
    expect(body).toContain('Pieter Vuyst');
    expect(body).not.toContain('person-status-toggle');
    expect(body).not.toContain('vocop_obs_1336719');
    expect(body).not.toContain('Record ID');
  });

  it('uses the existing object-card disclosure control for expandable claims', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_social_status_subject_of: [claim('1737-01-01', 'Source')] },
    }));
    expect(body).toContain('class="section-toggle person-status-toggle"');
    expect(body).toContain('section-toggle-icon');
    expect(body).not.toContain('person-status-toggle-icon');
  });

  it('names disclosure buttons from their summaries and connects them to panels with the correct hidden state', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_social_status_subject_of: [claim('1737-01-01', 'First source'), claim('1738-01-01', 'Second source')],
        referred_to_by: [{ type: 'LinguisticObject', content: 'Person source' }],
      },
    }));
    const buttons = [...body.matchAll(/<button\b[^>]*class="section-toggle person-status-toggle"[^>]*>/g)];
    expect(buttons.length).toBeGreaterThan(1);
    for (const [button] of buttons) {
      const controls = /aria-controls="([^"]+)"/.exec(button)?.[1];
      const labels = /aria-labelledby="([^"]+)"/.exec(button)?.[1]?.split(' ');
      expect(controls).toBeDefined();
      expect(labels).toHaveLength(2);
      for (const labelId of labels ?? []) {
        expect(body).toContain(`id="${labelId}"`);
      }
      const panel = body.slice(body.indexOf(`<div id="${controls}"`)).split('>')[0];
      expect(panel).toContain('person-status-content');
      expect(panel.includes('hidden=""')).toBe(button.includes('aria-expanded="false"'));
    }
    expect(body).toContain('>Details for</span>');
  });
});

describe('readable person sources', () => {
  it('preserves notes on sources without titles or visible identifiers', () => {
    const source = { type: 'LinguisticObject', id: '_:b1', note: 'Recorded provenance note' };
    const html = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', referred_to_by: [source] },
    }));
    expect(html).toContain('Recorded provenance note');
    expect(html).not.toContain('_:b1');
    expect(renderToStaticMarkup(createElement(SourceList, { sources: [source] }))).toBe('');
  });

  it('does not expose blank-node or observation labels inside otherwise readable source notes', () => {
    const html = renderToStaticMarkup(createElement(SourceList, { showNotes: true, sources: [{
      type: 'LinguisticObject', content: 'Readable source', note: [
        { type: 'LinguisticObject', _label: '_:b8' }, 'vocop_obs_1336719', 'Readable note',
      ],
    }] }));
    expect(html).toContain('Readable note');
    expect(html).not.toContain('_:b8');
    expect(html).not.toContain('vocop_obs_1336719');
  });
  it('keeps bibliographic prose plain and links only its DOI and source URI', () => {
    const citation = 'Petram, L., Koolen, M., Wevers, M., van Koert, R., and van Lottum, J. “The Dutch East India Company’s Eighteenth-Century Workforce: An Enriched Data Collection.” Version 0.1.0. Zenodo, February 12, 2024. https://doi.org/10.5281/zenodo.10599528.';
    const href = 'https://www.zotero.org/groups/4678659/items/3Y86C5R6';
    const work = {
      type: 'LinguisticObject', id: '_:b12', _label: 'Outdated source label',
      identified_by: [
        { type: 'Identifier', id: '_:b14', content: href },
        { type: 'Name', content: 'Short alternative name' },
        { type: 'Name', id: '_:b15', content: citation,
          classified_as: [{ type: 'Type', id: 'http://vocab.getty.edu/aat/300417193' }] },
      ],
    };
    const html = renderToStaticMarkup(createElement(SourceList, {
      sources: [{ type: 'LinguisticObject', part_of: [work],
        identified_by: [{ type: 'Identifier', content: '1336920' }] }],
    }));
    expect(html).toContain(citation.split(' https://')[0]);
    expect(html).toContain('href="https://doi.org/10.5281/zenodo.10599528"');
    expect(html).not.toMatch(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*Petram/);
    expect(html).toContain(`href="${href}"`);
    expect(html).toContain('1336920');
    expect(html).not.toContain('Outdated source label');
    expect(html).not.toContain('Short alternative name');
    expect(html).not.toContain('_:b');
    const withoutLabel = renderToStaticMarkup(createElement(SourceList, {
      sources: [{ type: 'LinguisticObject', part_of: [{ ...work, _label: undefined }] }],
    }));
    expect(withoutLabel).toContain(citation.split(' https://')[0]);
    expect(withoutLabel).toContain(`href="${href}"`);
  });

  it('links mixed-case HTTPS and bare DOIs without linking surrounding punctuation or prose', () => {
    const html = renderToStaticMarkup(createElement(SourceList, { sources: [{ type: 'LinguisticObject',
      content: 'A citation. Https://hdl.handle.net/10622/DITM0Z. Another (10.1234/example).',
    }] }));
    expect(html).toContain('href="https://hdl.handle.net/10622/DITM0Z"');
    expect(html).toContain('href="https://doi.org/10.1234/example"');
    expect(html).not.toMatch(/<a\b[^>]*>A citation/);
  });

  it('preserves source content when the source also has an identifier', () => {
    const html = renderToStaticMarkup(createElement(SourceList, {
      sources: [{ type: 'LinguisticObject', content: 'Bibliographic citation content',
        identified_by: [{ type: 'Identifier', content: '264' }] }],
    }));
    expect(html).toContain('Bibliographic citation content');
    expect(html).toContain('264');
  });
  it('hides blank-node and observation identifiers while retaining citation text and links', () => {
    const html = renderToStaticMarkup(createElement(SourceList, {
      includeInternalLabels: true,
      showNotes: true,
      sources: [
        { id: '_:b8', type: 'LinguisticObject', _label: '_:b8' },
        {
          id: '_:b9', type: 'LinguisticObject',
          identified_by: [{ type: 'Identifier', content: 'vocop_obs_1336719' }],
        },
        {
          id: '_:b10', type: 'LinguisticObject', _label: 'Recorded source title',
          note: 'A source note',
        },
        {
          id: '_:b11', type: 'LinguisticObject',
          identified_by: [{ type: 'Identifier', content: '264' }],
          part_of: [{ id: '_:b12', type: 'LinguisticObject', _label: 'https://www.zotero.org/groups/4678659/items/3Y86C5R6' }],
        },
      ],
    }));
    expect(html).not.toContain('_:b');
    expect(html).not.toContain('vocop_obs_');
    expect(html).toContain('Recorded source title');
    expect(html).toContain('A source note');
    expect(html).toContain('264');
    expect(html).toContain('href="https://www.zotero.org/groups/4678659/items/3Y86C5R6"');
  });
});

describe('person dates and event details', () => {
  it('shows full date bounds once in the occupation header without creating empty details', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_social_status_subject_of: [{
        type: 'SocialStatus', ascribes_social_status: [occupation],
        timespan: {
          type: 'TimeSpan',
          begin_of_the_begin: '1776-09-19T00:00:00',
          end_of_the_begin: '1776-09-19T23:59:59',
          begin_of_the_end: '1777-08-17T00:00:00',
          end_of_the_end: '1777-08-17T23:59:59',
        },
      }] },
    }));
    expect(body).toContain('Occupations and statuses');
    expect(body).not.toContain('Date bounds');
    expect(body).not.toContain('person-status-content');
    expect(body.match(/Earliest start:/g)).toHaveLength(1);
    expect(body).toContain('Earliest start: 1776-09-19');
    expect(body).toContain('Latest start: 1776-09-19');
    expect(body).toContain('Earliest end: 1777-08-17');
    expect(body).toContain('Latest end: 1777-08-17');
    expect(body).not.toContain('00:00:00');
    expect(body).not.toContain('23:59:59');
  });
  it('retains all four uncertainty bounds at date precision', () => {
    expect(formatTimespanBoundaries({
      beginOfTheBegin: '1776-09-19T00:00:00',
      endOfTheBegin: '1776-09-19T23:59:59',
      beginOfTheEnd: '1777-08-17T00:00:00',
      endOfTheEnd: '1777-08-17T23:59:59',
    })).toEqual([
      'Earliest start: 1776-09-19',
      'Latest start: 1776-09-19',
      'Earliest end: 1777-08-17',
      'Latest end: 1777-08-17',
    ]);
    expect(formatTimespanBoundaries({ beginOfTheBegin: '1776-09-19' }))
      .toContain('Latest start: not recorded');
  });
  it('shows complete year bounds at year precision and keeps a missing end explicit', () => {
    expect(formatTimespan({
      beginOfTheBegin: '1737-01-01T00:00:00',
      endOfTheBegin: '1737-12-31T23:59:59',
    })).toEqual(['Start: 1737', 'End: not recorded']);
    expect(formatDateRange('1736-04-01', '1736-09-30'))
      .toBe('between 1736-04-01 and 1736-09-30');
    expect(formatDateRange(undefined, '1736-09-30')).toBe('on or before 1736-09-30');
  });

  it('does not turn merged date arrays or conflicting event dates into a paired period', () => {
    const status: LinkedArtNode = {
      type: 'SocialStatus',
      timespan: {
        type: 'TimeSpan',
        begin_of_the_begin: ['1736-01-01', '1737-01-01'],
        end_of_the_begin: '1737-12-31',
        end_of_the_end: ['1761-01-01', '1762-01-01'],
      },
    };
    expect(getPersonTimespan(status)).toBeNull();
    expect(getRecordedDates(status)).toEqual({
      starts: ['1736-01-01', '1737-01-01', '1737-12-31'],
      ends: ['1761-01-01', '1762-01-01'], dates: [],
    });
    expect(getPersonTimespan({ type: 'Death', 'crm:P4_has_time-span': ['1754-10-02', '1755-10-02'] })).toBeNull();
  });

  it('keeps the conflicting starts and ends observed in Person_697170 as unpaired recorded dates', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: { type: 'Person', is_social_status_subject_of: [{
        type: 'SocialStatus', ascribes_social_status: [occupation],
        timespan: {
          type: 'TimeSpan',
          begin_of_the_begin: ['1752-06-24T00:00:00', '1761-03-09T00:00:00'],
          end_of_the_begin: ['1752-06-24T23:59:59', '1761-03-09T23:59:59'],
          begin_of_the_end: ['1753-03-31T00:00:00', '1761-09-23T00:00:00'],
          end_of_the_end: ['1753-03-31T23:59:59', '1761-09-23T23:59:59'],
        },
      }] },
    }));
    expect(body).toContain('Recorded starts: 1752-06-24, 1761-03-09');
    expect(body).toContain('Recorded ends: 1753-03-31, 1761-09-23');
    expect(body).not.toContain('Earliest start:');
    expect(body).not.toContain('between 1752-06-24 and 1761-03-09');
  });

  it('accepts typed dates and the observed CRM end-boundary alias', () => {
    const span = getPersonTimespan({
      type: 'SocialStatus',
      timespan: {
        type: 'TimeSpan',
        begin_of_the_begin: { type: 'xsd:dateTime', '@value': '1737-01-01T00:00:00' },
        end_of_the_begin: '1737-12-31T23:59:59',
        begin_of_the_end: '1740-01-01T00:00:00',
        'crm:P82b_end_of_the_end': '1740-12-31T23:59:59',
      },
    });
    expect(span && formatTimespan(span)).toEqual(['Start: 1737', 'End: 1740']);
  });

  it('shows birth/death places in the overview and preserves death classifications in the body', () => {
    const entity: LinkedArtNode = {
      type: 'Person',
      born: { type: 'Birth', took_place_at: [{ type: 'Place', _label: 'Aarendal' }] },
      died: {
        type: 'Death',
        'crm:P4_has_time-span': [{ type: 'xsd:dateTime', '@value': '1754-10-02T00:00:00' }, '1754-10-02'],
        took_place_at: [{ type: 'Place', _label: 'Asia' }],
        classified_as: [{
          type: 'Type',
          id: 'https://github.com/globalise-huygens/nlp-event-detection/wiki#beingdead',
          _label: ['Death penalty', 'Deceased', 'Murdered'],
        }],
      },
    };
    const overview = renderToStaticMarkup(createElement(PersonOverview, { entity }));
    expect(overview).toContain('Aarendal');
    expect(overview).toContain('1754-10-02');
    expect(overview).toContain('Asia');
    const body = renderToStaticMarkup(createElement(PersonCardBody, { entity }));
    expect(body).toContain('Birthplace');
    expect(body).toContain('Place of death');
    expect(body).toContain('Recorded classifications');
    expect(body).toContain('https://github.com/globalise-huygens/nlp-event-detection/wiki#beingdead');
    expect(body).toContain('Vocabulary term');
    expect(body).not.toContain('Deceased');
    expect(body).not.toContain('Death penalty');
    expect(body).not.toContain('Murdered');
  });

  it('shows detached status dates without attaching them to an occupation', () => {
    const body = renderToStaticMarkup(createElement(PersonCardBody, {
      entity: {
        type: 'Person',
        'aaao:ZP17i_is_social_status_subject_of': [{ type: 'xsd:dateTime', '@value': '1722-01-01T00:00:00' }],
      },
    }));
    expect(body).toContain('Recorded status dates');
    expect(body).toContain('1722-01-01');
    expect(body).toContain('not linked to a specific occupation or status');
    expect(body).not.toContain('Occupations and statuses');
  });

  it('keeps origin distinct from birthplace', () => {
    const entity: LinkedArtNode = {
      type: 'Person',
      is_residence_subject_of: [{
        type: 'ResidentialStatus',
        ascribes_residence_relation: [{ type: 'Type', _label: 'place_of_origin' }],
        ascribes_residence_place: [{ type: 'Place', _label: 'Stockholm' }],
      }],
    };
    const body = renderToStaticMarkup(createElement(PersonCardBody, { entity }));
    expect(body).toContain('Places');
    expect(body).toContain('Origin');
    expect(body).not.toContain('Birthplace');
    expect(renderToStaticMarkup(createElement(PersonOverview, { entity }))).toBe('');
  });
});

describe('person vocabulary values', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('allows a later lookup to recover after a temporary fetch failure', async () => {
    const uri = `${base}thesaurus:retry-label`;
    const fetch = vi.fn().mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ type: 'Type', prefLabel: 'Recovered term' })));
    vi.stubGlobal('fetch', fetch);
    expect(await resolveRelationValue(uri)).toBeUndefined();
    expect(await resolveRelationValue(uri)).toBe('Recovered term');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('resolves the preferred English Getty name rather than an embedded or alternative label', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      type: 'Type', id: 'http://vocab.getty.edu/aat/300445022', _label: 'old label',
      identified_by: [
        { type: 'Name', content: 'page number' },
        { type: 'Name', content: 'page numbers',
          classified_as: [{ type: 'Type', id: 'http://vocab.getty.edu/aat/300404670' }],
          language: [{ type: 'Language', id: 'http://vocab.getty.edu/language/en' }] },
      ],
    })));
    vi.stubGlobal('fetch', fetch);
    expect(await resolveRelationValue('http://vocab.getty.edu/aat/300445022')).toBe('page numbers');
    expect(fetch.mock.calls[0][0]).toBe('https://vocab.getty.edu/aat/300445022.json');
  });

  it('keeps embedded labels out of the initial display while a linked label is pending', () => {
    const body = renderToStaticMarkup(createElement(RelationValue, {
      node: { type: 'Type', id: `${base}thesaurus:pending`, _label: 'embedded label' },
    }));
    expect(body).not.toContain('embedded label');
    expect(body).toContain('Vocabulary term');
    expect(renderToStaticMarkup(createElement(RelationValue, {
      node: { type: 'Place', id: '_:b1', _label: 'Stockholm' },
    }))).toBe('Stockholm');
  });

  it('permits a fallback when the resource cannot supply a label', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      type: 'Type', id: `${base}thesaurus:no-label`,
    }))));
    expect(await resolveRelationValue(`${base}thesaurus:no-label`)).toBeUndefined();
  });

  it('uses the preferred language label and does not choose an arbitrary vocabulary variant', () => {
    const term: LinkedArtNode = {
      type: 'Type', id: `${base}thesaurus:merchant`,
      prefLabel: [{ '@language': 'nl', '@value': 'koopman' }, { '@language': 'en', '@value': 'merchant' }],
    };
    Object.assign(term, { _label: ['Koopm.', 'Koopm. en Fiscaal'] });
    expect(getRelationValue(term)).toBe('merchant');
    expect(getRelationValue({ ...term, prefLabel: undefined })).toBe('Vocabulary term');
    expect(getRelationValue({ type: 'Type', _label: `${base}thesaurus:merchant` }))
      .toBe('Vocabulary term');
    expect(getRelationValue({ type: 'LinguisticObject', id: '_:b8', _label: '_:b8' }))
      .toBe('LinguisticObject');
  });

  it('reads typed and language-tagged literal values without treating them as entities', () => {
    expect(getStatusValues({
      type: 'AppellativeStatus',
      ascribes_appellation: [{ type: 'xsd:string', '@value': 'Pieter Vuyst' }],
    }, ['ascribes_appellation'])).toEqual(['Pieter Vuyst']);
  });
});
