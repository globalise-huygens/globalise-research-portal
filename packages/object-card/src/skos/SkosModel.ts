import { isUrl } from '@globalise/common';

export type LangValue = {
  '@language': string;
  '@value': string;
};

export type SkosConcept = {
  id: string;
  type: string | string[];
  _label?: string;
  prefLabel?: LangValue[];
  altLabel?: LangValue[];
  definition?: LangValue[];
  references?: LangValue;
  hiddenLabel?: LangValue[];
  source?: LangValue;
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

export function getPreferredLabel(concept: SkosConcept): LangValue | undefined {
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

/**
 * Convert ID URI into a URL by adding `.json`
 */
export function getSkosUrl(uri: string): string {
  const result = `${uri}.json`;
  if (!isUrl(result)) {
    throw new Error(`Could not create url from uri ${uri}`);
  }
  return result;
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
