import { isUrl } from '@globalise/common';

export type LangValue = {
  '@language': string;
  '@value': string;
};

export type SkosConcept = {
  id: string;
  type: string | string[];
  _label?: string;
  prefLabel: LangValue[];
  altLabel?: LangValue[];
  definition?: LangValue[];
  references?: LangValue;
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

export function getConceptLabel(concept: SkosConcept): string {
  return (
    // Pick english by default:
    concept.prefLabel.find((l) => l['@language'] === 'en')?.['@value']
    // Use dutch when missing:
    ?? concept.prefLabel.find((l) => l['@language'] === 'nl')?.['@value']
    // Any other label when present:
    ?? concept.prefLabel[0]
    // Or dev _label when no prefLabel:
    ?? concept._label
    ?? ''
  );
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