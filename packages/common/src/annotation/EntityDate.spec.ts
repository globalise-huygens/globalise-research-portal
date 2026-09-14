import { describe, expect, it } from 'vitest';
import { getEntityDateTimespan, type EntityBody } from './EntityModel';

const body: EntityBody = {
  type: 'AppellativeStatus',
  classified_as: { id: 'gan:DATE', type: 'Type', _label: 'Date' },
  ascribes_classification: { id: 'gan:DATE', type: 'Type', _label: 'Date' },
  label: 'A„o 1780',
  timespan: {
    type: 'TimeSpan',
    end_of_the_begin: '1782-12-31T23:59:59Z',
    begin_of_the_end: '1782-01-01T00:00:00Z',
  },
};

describe('entity date interpretation', () => {
  it('uses the interpreted year even when the status has a different year', () => {
    const target = {
      type: 'TimeSpan',
      begin_of_the_begin: '1780-01-01T00:00:00Z',
      end_of_the_end: '1780-12-31T23:59:59Z',
    };
    expect(getEntityDateTimespan({
      ...body,
      has_appellative_subject: {
        id: '#timespan',
        type: 'TimeSpan',
        is_similarity_subject_of: {
          ascribes_similarity_relation: 'la:equivalent',
          ascribes_similarity_target: target,
        },
      },
    })).toEqual(target);
  });

  it('never substitutes status dates or parses a year from the label', () => {
    expect(getEntityDateTimespan(body)).toBeUndefined();
    expect(getEntityDateTimespan({ ...body, label: '1 Junij' })).toBeUndefined();
  });

  it('does not treat a non-equivalent relation as the named date', () => {
    expect(getEntityDateTimespan({
      ...body,
      has_appellative_subject: {
        id: '#timespan',
        type: 'TimeSpan',
        is_similarity_subject_of: {
          ascribes_similarity_relation: 'related',
          ascribes_similarity_target: body.timespan,
        },
      },
    })).toBeUndefined();
  });
});
