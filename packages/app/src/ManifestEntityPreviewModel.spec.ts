import { describe, expect, it } from 'vitest';
import type { EntityBody } from '@globalise/common/annotation';
import {
  getEquivalentTarget,
  getInternalConceptUri,
  getLinkedObjectCardHref,
} from './ManifestEntityPreviewModel';

const conceptId = '8fa3d88a-021c-4976-ab8e-1773b93889fe';
const publicConceptUri =
  `https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:${conceptId}`;

function createBody(
  subjectId: string,
  type: EntityBody['type'] = 'AppellativeStatus',
): EntityBody {
  const subject = {
    id: subjectId,
    type: 'Person',
  };
  return {
    type,
    classified_as: { id: 'ner:per_name', type: 'Type', _label: 'Name of Person' },
    ascribes_classification: {
      id: 'ner:per_name',
      type: 'Type',
      _label: 'Name of Person',
    },
    ...(type === 'AppellativeStatus' && { has_appellative_subject: subject }),
    ...(type === 'ClassificatoryStatus' && { has_classificatory_subject: subject }),
    ...(type === 'Dimension' && { has_dimension_subject: subject }),
  };
}

describe('manifest entity preview links', () => {
  it('normalizes public GLOBALISE and PoolParty concept URIs', () => {
    expect(getInternalConceptUri(`${publicConceptUri}.json`))
      .toBe(publicConceptUri);
    expect(getInternalConceptUri(
      `https://digitaalerfgoed.poolparty.biz/globalise/${conceptId}`,
    )).toBe(publicConceptUri);
  });

  it('rejects concept URIs that cannot resolve to the public thesaurus', () => {
    expect(getInternalConceptUri('https://example.com/concept/123')).toBeUndefined();
    expect(getInternalConceptUri(
      'https://digitaalerfgoed.poolparty.biz/globalise/annotation/ner/ETH_REL',
    )).toBeUndefined();
    expect(getInternalConceptUri('not a URI')).toBeUndefined();
  });

  it.each([
    'AppellativeStatus',
    'ClassificatoryStatus',
    'Dimension',
  ] as const)('links public GLOBALISE %s subjects to their object cards', (type) => {
    const uri =
      'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/person:123';
    const href = getLinkedObjectCardHref(createBody(uri, type));
    expect(href).toBe('/hdl:20.500.14722/person:123');
  });

  it('does not link annotation-local or external entity subjects', () => {
    expect(getLinkedObjectCardHref(createBody(
      'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/annotations:entities#1',
    ))).toBeUndefined();
    expect(getLinkedObjectCardHref(createBody(
      'https://example.com/person/123',
    ))).toBeUndefined();
    expect(getLinkedObjectCardHref(createBody('#person'))).toBeUndefined();
  });
});

describe('recorded equivalent targets', () => {
  const target = { id: publicConceptUri, type: 'Concept' };
  const match = {
    type: 'SimilarityStatus',
    ascribes_similarity_relation: 'la:equivalent',
    ascribes_similarity_target: target,
  };

  it('uses a single recorded equivalent target', () => {
    expect(getEquivalentTarget({
      type: 'Concept', is_similarity_subject_of: [match],
    })).toEqual(target);
  });

  it('does not choose between different equivalent targets', () => {
    const other = { ...match, ascribes_similarity_target: {
      ...target, id: `${publicConceptUri}-other`,
    } };
    expect(getEquivalentTarget({
      type: 'Concept', is_similarity_subject_of: [match, other],
    })).toBeUndefined();
  });
});
