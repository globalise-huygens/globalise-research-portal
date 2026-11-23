import { describe, expect, it } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { getPlaceEvidence } from './PlaceEvidence.ts';

const remarkType = {
  type: 'Type',
  id: 'http://vocab.getty.edu/aat/300435415',
};

function citation(content: string) {
  return { type: 'LinguisticObject', content };
}

function place(referredToBy: unknown[]): LinkedArtNode {
  return { type: 'Place', referred_to_by: referredToBy };
}

describe('getPlaceEvidence', () => {
  it('takes citations as sources', () => {
    const { sources, notes } = getPlaceEvidence(place([citation('foo')]));

    expect(sources).toEqual([citation('foo')]);
    expect(notes).toEqual([]);
  });

  it('takes a remark as a note, and its citations as sources', () => {
    const remark = {
      type: 'LinguisticObject',
      content: 'bar',
      classified_as: [remarkType],
      referred_to_by: [citation('baz')],
    };

    const { sources, notes } = getPlaceEvidence(place([remark]));

    expect(notes).toEqual(['bar']);
    expect(sources).toEqual([citation('baz')]);
  });

  it('lists an identical citation once', () => {
    const evidence = place([citation('foo'), citation('foo')]);

    expect(getPlaceEvidence(evidence).sources).toEqual([citation('foo')]);
  });

  it('leaves out citations without anything to show', () => {
    const evidence = place([citation(''), citation('foo')]);

    expect(getPlaceEvidence(evidence).sources).toEqual([citation('foo')]);
  });
});
