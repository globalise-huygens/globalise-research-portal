import { describe, expect, it } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { getPlaceRelationship } from './PlaceRelationship.ts';

const foo = { type: 'Place', _label: 'foo' };
const bar = { type: 'Place', _label: 'bar' };
const near = { type: 'Type', _label: 'near' };
const north = { type: 'Type', _label: 'north of' };

function record(fields: Record<string, unknown>): LinkedArtNode {
  return fields as LinkedArtNode;
}

describe('getPlaceRelationship', () => {
  it('has none for a record without a relationship target', () => {
    const name = record({ type: 'AppellativeStatus' });

    expect(getPlaceRelationship(name, [])).toBeUndefined();
  });

  it('relates a topographical record to its places by its relation', () => {
    const topographical = record({
      type: 'TopographicalStatus',
      ascribes_place: [foo],
      ascribes_topographical_relation: [near],
    });

    expect(getPlaceRelationship(topographical, [])).toEqual({
      targets: [foo],
      types: [near],
      statements: [],
      isCombined: false,
    });
  });

  it('prefers the classifications of a topographical record as its types', () => {
    const topographical = record({
      type: 'TopographicalStatus',
      ascribes_place: [foo],
      ascribes_topographical_relation: [near],
    });

    const { types } = getPlaceRelationship(topographical, [north])!;

    expect(types).toEqual([north]);
  });

  it('relates a similarity record to its targets by its similarity relation', () => {
    const similarity = record({
      type: 'SimilarityStatus',
      ascribes_similarity_target: [foo],
      ascribes_similarity_relation: [near],
    });

    const { targets, types } = getPlaceRelationship(similarity, [north])!;

    expect(targets).toEqual([foo]);
    expect(types).toEqual([near]);
  });

  it('combines several places with several relations, keeping the recorded statements', () => {
    const topographical = record({
      type: 'TopographicalStatus',
      _label: ['foo near baz', 'bar north of baz'],
      ascribes_place: [foo, bar],
      ascribes_topographical_relation: [near, north],
    });

    const { statements, isCombined } = getPlaceRelationship(topographical, [])!;

    expect(isCombined).toBe(true);
    expect(statements).toEqual(['foo near baz', 'bar north of baz']);
  });
});
