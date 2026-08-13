export type SkosValue = {
  '@language': string;
  '@value': string;
};

export type SkosConcept = {
  id: string;
  type: string | string[];
  _label?: string;
  prefLabel: SkosValue[];
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
  const prefLabel =
    // Pick english by default:
    concept.prefLabel.find((l) => l['@language'] === 'en')
    // Use dutch when missing:
    ?? concept.prefLabel.find((l) => l['@language'] === 'nl')
    // Any other label when present:
    ?? concept.prefLabel[0];
  if(prefLabel) {
    return prefLabel?.['@value'];
  }
  // Use dev _label when no prefLabel:
  return concept._label ?? '';
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