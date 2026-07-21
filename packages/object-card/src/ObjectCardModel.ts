import { isUrl } from '@globalise/common';

export type LangValue = {
  '@language': string;
  '@value': string;
};

export type ConceptRef = {
  id: string;
  type: string;
  _label?: string;
  prefLabel?: LangValue[];
};

export type SkosConcept = {
  id: string;
  type: string;
  _label?: string;
  'dcterms:title'?: LangValue[];
  prefLabel?: LangValue[];
  altLabel?: LangValue[];
  hasTopConcept?: ConceptRef[];
  broader?: ConceptRef[];
  narrower?: ConceptRef[];
  inScheme?: ConceptRef[];
  topConceptOf?: ConceptRef[];
};

export function conceptLabel(concept: ConceptRef): string {
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