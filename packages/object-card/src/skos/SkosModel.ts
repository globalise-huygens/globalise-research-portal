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

export function conceptLabel(concept: SkosConcept): string {
  if (concept._label) {
    return concept._label;
  }
  const first = concept.prefLabel?.[0];
  return first ? first['@value'] : concept.id;
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