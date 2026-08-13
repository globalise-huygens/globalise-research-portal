import { getValue, type LanguageValue } from '@globalise/common';

export type SkosValue = LanguageValue;

export type SkosConcept = {
  id: string;
  type: string | string[];
  _label?: string;
  prefLabel?: SkosValue[];
  altLabel?: SkosValue[];
  definition?: SkosValue[];
  references?: SkosValue;
  hiddenLabel?: SkosValue[];
  source?: SkosValue;
  notation?: string | string[];

  /**
   * Relations:
   */
  broader?: SkosConcept[];
  narrower?: SkosConcept[];
  related?: SkosConcept[];
  hasTopConcept?: SkosConcept[];
  inScheme?: SkosConcept[];
  topConceptOf?: SkosConcept[];

  /**
   * External relations:
   */
  closeMatch?: SkosMatch[];
  narrowMatch?: SkosMatch[];
  exactMatch?: SkosMatch[];
};

export type SkosMatch = SkosConcept | string;

export function getConceptLabel(concept: SkosConcept): string {
  const preferredLabel = getValue(concept.prefLabel);
  return preferredLabel ? preferredLabel : concept._label ?? '';
}

export function isSkosConcept(value: unknown): value is SkosConcept {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if ('prefLabel' in value) {
    return true;
  }
  return 'type' in value
    && typeof value.type === 'string'
    && value.type.startsWith('skos:');
}

export function matchUri(match: SkosMatch): string {
  if (typeof match === 'string') {
    return match;
  }
  return match.id;
}

export function matchLabel(match: SkosMatch): string {
  if (typeof match === 'string') {
    return match;
  }
  return match.prefLabel?.[0]['@value']
    ?? match._label
    ?? match.id;
}
