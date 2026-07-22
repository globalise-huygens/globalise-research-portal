import { isUrl } from '@globalise/common';

export type LangValue = {
  '@language': string;
  '@value': string;
};

export type SkosConcept = {
  id: string;
  type: string;
  _label?: string;
  'dcterms:title'?: LangValue[];
  prefLabel?: LangValue[];
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
  closeMatch?: string[];
  narrowMatch?: string[];
  exactMatch?: string[];
};

export function conceptLabel(concept: SkosConcept): string {
  if (concept._label) {
    return concept._label;
  }
  const first = concept.prefLabel?.[0];
  return first ? first['@value'] : concept.id;
}

export function getSkosUrl(uri: string): string {
  const result = `${uri}.json`;
  if (!isUrl(result)) {
    throw new Error(`Could not create url from uri ${uri}`);
  }
  return result;
}