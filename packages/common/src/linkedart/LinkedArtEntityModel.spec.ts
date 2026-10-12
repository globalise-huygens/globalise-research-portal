import { describe, expect, it } from 'vitest';
import { getLinkedArtEntityType } from './LinkedArtEntityModel.ts';

describe('linked-art entity types', () => {
  it('trusts the explicit namespace before words inside an identifier', () => {
    expect(getLinkedArtEntityType('https://example.org/place:Person_1')).toBe('place');
    expect(getLinkedArtEntityType('https://example.org/thesaurus:Person_1')).toBe('concept');
    expect(getLinkedArtEntityType('https://example.org/organization:Place_12')).toBe('organization');
  });

  it('recognizes legacy identifiers only when the namespace is not a known type', () => {
    expect(getLinkedArtEntityType('https://example.org/entity:Person_1')).toBe('person');
    expect(getLinkedArtEntityType('https://example.org/entity:Place_12')).toBe('place');
    expect(getLinkedArtEntityType('https://example.org/person-page-3.json')).toBe('person');
    expect(getLinkedArtEntityType('https://example.org/entity:unrecognized')).toBe('unknown');
  });
});
