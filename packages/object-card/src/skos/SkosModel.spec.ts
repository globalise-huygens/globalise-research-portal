import { describe, expect, it } from 'vitest';
import {
  getConceptLabel,
  getLanguageDisplayName,
  getPreferredLabel,
  SkosConcept,
} from './SkosModel.ts';

describe(getLanguageDisplayName.name, () => {
  it('returns an English display name for a language code', () => {
    expect(getLanguageDisplayName('nl')).toBe('Dutch');
    expect(getLanguageDisplayName('id')).toBe('Indonesian');
  });

  it('does not display missing or placeholder language codes', () => {
    expect(getLanguageDisplayName('')).toBeUndefined();
    expect(getLanguageDisplayName('?')).toBeUndefined();
  });
});

describe(getPreferredLabel.name, () => {
  const concept: SkosConcept = {
    id: 'example',
    type: 'Concept',
    prefLabel: [
      { '@language': 'nl', '@value': 'Olie' },
      { '@language': 'id', '@value': 'Minyak' },
      { '@language': 'en', '@value': 'Oil' },
    ],
  };

  it('selects English for the title without discarding other labels', () => {
    expect(getPreferredLabel(concept)).toEqual(
      { '@language': 'en', '@value': 'Oil' },
    );
    expect(getConceptLabel(concept)).toBe('Oil');
    expect(concept.prefLabel).toHaveLength(3);
  });
});
