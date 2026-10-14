import { describe, expect, it, vi } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { getPersonPlaces, getPlaceCoordinates } from './PersonPlacesModel.ts';

vi.mock('../../../common/src/util/getSVGElement.ts', () => ({ getSVGElement: vi.fn() }));
const place: LinkedArtNode = { type: 'Place', id: 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/place:test', _label: 'Test place' };
const coordinate = (content: string, type: string): LinkedArtNode => ({
  type: 'GeometricPlaceExpression', content, classified_as: [{ type: 'Type', id: `http://vocab.getty.edu/aat/${type}` }],
});
const latitude = (value: string) => coordinate(value, '300387565');
const longitude = (value: string) => coordinate(value, '300387567');

describe('recorded person places', () => {
  it('collects and deduplicates linked birth, place and geographic scope records', () => {
    const places = getPersonPlaces({ type: 'Person',
      born: { type: 'Birth', took_place_at: [place] },
      is_residence_subject_of: [{ type: 'ResidentialStatus', ascribes_residence_place: [place] }],
      is_social_status_subject_of: [{ type: 'SocialStatus', has_geographic_scope: [place] }, { type: 'SocialStatus', has_geographic_scope: [place] }],
    });
    expect(places).toEqual([place]);
  });
  it('does not map places belonging to a related person or a source', () => {
    expect(getPersonPlaces({ type: 'Person',
      is_familial_subject_of: [{ type: 'FamilyStatus', ascribes_relative: [{ type: 'Person', born: { type: 'Birth', took_place_at: [place] } }] }],
      referred_to_by: [{ type: 'LinguisticObject', took_place_at: [place] }],
    })).toEqual([]);
  });
  it('excludes places without a resolvable link', () => {
    const unlinked = { type: 'Place', _label: 'Amsterdam' };
    expect(getPersonPlaces({ type: 'Person', died: { type: 'Death', took_place_at: [unlinked] } })).toEqual([]);
    expect(getPersonPlaces({ type: 'Person', died: { type: 'Death', took_place_at: [{ type: 'Place', id: '_:b1' }] } })).toEqual([]);
  });
});

describe('place coordinates', () => {
  it('reads the current place dataset latitude and longitude with longitude first', () => {
    expect(getPlaceCoordinates({ type: 'Place', is_approximated_by_declarative_place: {
      type: 'DeclarativePlace', place_is_defined_by: [latitude('-33.926009'), longitude('18.427668')],
    } })).toEqual([18.427668, -33.926009]);
  });
  it('accepts zero coordinates and repeated consistent values', () => {
    expect(getPlaceCoordinates({ type: 'Place', place_is_defined_by: [latitude('0'), longitude('0'), latitude('0')] })).toEqual([0, 0]);
  });
  it('does not guess coordinate types from labels', () => {
    expect(getPlaceCoordinates({ type: 'Place', place_is_defined_by: [{ type: 'GeometricPlaceExpression', content: '52', classified_as: [{ type: 'Type', _label: 'latitude' }] }, longitude('4')] })).toBeUndefined();
  });
  it('rejects incomplete, empty, invalid, out-of-range and conflicting coordinates', () => {
    for (const expressions of [
      [latitude('52')], [latitude(''), longitude('4')], [latitude('NaN'), longitude('4')],
      [latitude('91'), longitude('4')], [latitude('52'), longitude('181')],
      [latitude('52'), latitude('53'), longitude('4')],
    ]) {expect(getPlaceCoordinates({ type: 'Place', place_is_defined_by: expressions })).toBeUndefined();}
  });
});
