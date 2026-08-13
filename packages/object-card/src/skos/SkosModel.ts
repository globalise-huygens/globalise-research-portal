export type SkosValue = {
  '@language': string;
  '@value': string;
};

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

const languageDisplayNames = new Intl.DisplayNames(['en'], {
  type: 'language',
});

export function getPreferredLabel(concept: SkosConcept): SkosValue | undefined {
  return (
    // Pick english by default:
    concept.prefLabel?.find((l) => l['@language'] === 'en')
    // Use dutch when missing:
    ?? concept.prefLabel?.find((l) => l['@language'] === 'nl')
    // Any other label when present:
    ?? concept.prefLabel?.[0]
  );
}

export function getConceptLabel(concept: SkosConcept): string {
  const prefLabel = getPreferredLabel(concept);
  // Use dev _label when no prefLabel:
  return prefLabel?.['@value'] ?? concept._label ?? '';
}

export function getLanguageTag(language: string): string | undefined {
  const normalized = language.trim();
  return normalized && normalized !== '?' ? normalized : undefined;
}

export function getLanguageDisplayName(language: string): string | undefined {
  const normalized = getLanguageTag(language);
  if (!normalized) {
    return undefined;
  }

  try {
    return languageDisplayNames.of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
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
