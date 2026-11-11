import { describe, expect, it } from 'vitest';
import parseQuery from './parseQuery.server';

import type { TreeQuery } from '@knaw-huc/searchfield';

const span = { from: 0, to: 0 };
const term = (value: string): TreeQuery => ({ type: 'term', value, span });
const field = (field: string, value: string): TreeQuery => ({ type: 'field', field, clause: term(value), span });
const placeToken = { match: { query: 'type:Place', analyzer: 'keyword' } };

describe(parseQuery.name, () => {
  it('finds an annotation type regardless of case', () => {
    expect(parseQuery(field('type', 'humanmadeobject'))).toEqual({
      term: { annotatedText: { value: 'type:HumanMadeObject' } },
    });
  });

  it('rejects an unsupported annotation type', () => {
    expect(() => parseQuery(field('type', 'constructor'))).toThrow('Unsupported annotation type \'constructor\'');
  });

  it('finds a term inside an annotation type field regardless of case', () => {
    expect(parseQuery(field('Place', 'batavia'))).toEqual({
      intervals: {
        annotatedText: {
          all_of: { intervals: [{ match: { query: 'batavia' } }], filter: { overlapping: placeToken } },
        },
      },
    });
  });

  it('finds a term inside an annotation', () => {
    const query: TreeQuery = { type: 'containing', container: field('type', 'place'), clause: term('batavia'), span };
    expect(parseQuery(query)).toEqual({
      intervals: {
        annotatedText: {
          all_of: { intervals: [{ match: { query: 'batavia' } }], filter: { overlapping: placeToken } },
        },
      },
    });
  });

  it('finds a term outside an annotation', () => {
    const query: TreeQuery = { type: 'notContaining', container: field('type', 'place'), clause: term('batavia'), span };
    expect(parseQuery(query)).toEqual({
      intervals: {
        annotatedText: {
          all_of: { intervals: [{ match: { query: 'batavia' } }], filter: { not_overlapping: placeToken } },
        },
      },
    });
  });

  it('finds a term in a metadata field', () => {
    const query: TreeQuery = { type: 'containing', container: term('title'), clause: term('missive'), span };
    expect(parseQuery(query)).toEqual({ match: { title: { query: 'missive' } } });
  });

  it('excludes documents with a term in a metadata field', () => {
    const query: TreeQuery = { type: 'notContaining', container: term('title'), clause: term('missive'), span };
    expect(parseQuery(query)).toEqual({ bool: { must_not: [{ match: { title: { query: 'missive' } } }] } });
  });

  it('finds a term inside an annotation in near()', () => {
    const containing: TreeQuery = { type: 'containing', container: field('type', 'place'), clause: term('batavia'), span };
    const query: TreeQuery = { type: 'near', clauses: [containing, term('schip')], distance: 3, span };
    expect(parseQuery(query)).toEqual({
      intervals: {
        annotatedText: {
          all_of: {
            intervals: [
              { all_of: { intervals: [{ match: { query: 'batavia' } }], filter: { overlapping: placeToken } } },
              { match: { query: 'schip' } },
            ],
            max_gaps: 3,
            ordered: false,
          },
        },
      },
    });
  });

  it('rejects a metadata field in near()', () => {
    const containing: TreeQuery = { type: 'containing', container: term('title'), clause: term('missive'), span };
    const query: TreeQuery = { type: 'near', clauses: [containing, term('schip')], distance: 3, span };
    expect(() => parseQuery(query)).toThrow('Metadata field \'title\' is not supported inside near()');
  });
});
